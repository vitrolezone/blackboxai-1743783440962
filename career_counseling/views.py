from flask import Blueprint, jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from itsdangerous import URLSafeTimedSerializer
import smtplib
from email.mime.text import MIMEText
from extensions import db
from models import User, Question, Option, Career, TestResult, CareerRecommendation
from ai_engine import analyze_results, recommend_careers

main = Blueprint('main', __name__)

@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
        
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user_id': user.id,
        'username': user.username
    })

@main.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
        
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201

@main.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@main.route('/api/questions', methods=['GET'])
@jwt_required()
def get_questions():
    questions = Question.query.all()
    return jsonify([{
        'id': q.id,
        'text': q.text,
        'category': q.category,
        'options': [{'id': o.id, 'text': o.text} for o in q.options]
    } for q in questions])

@main.route('/api/submit-test', methods=['POST'])
@jwt_required()
def submit_test():
    try:
        data = request.json
        
        # Validate input
        if not data or 'answers' not in data:
            return jsonify({'error': 'Invalid request data'}), 400
            
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        if not isinstance(data['answers'], list) or len(data['answers']) == 0:
            return jsonify({'error': 'Invalid answers format'}), 400
        
        # Calculate scores
        aptitude_score, interest_score = analyze_results(data['answers'])
        
        # Create test result with current timestamp
        from datetime import datetime
        test_result = TestResult(
            user_id=user.id,
            date_taken=datetime.utcnow(),
            aptitude_score=aptitude_score,
            interest_score=interest_score
        )
        db.session.add(test_result)
        db.session.commit()
        
        # Get career recommendations
        recommendations = recommend_careers(aptitude_score, interest_score)
        
        # Save recommendations
        for career_id, match_score in recommendations:
            recommendation = CareerRecommendation(
                test_result_id=test_result.id,
                career_id=career_id,
                match_score=match_score
            )
            db.session.add(recommendation)
        db.session.commit()
        
        return jsonify({
            'message': 'Test submitted successfully',
            'test_result_id': test_result.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@main.route('/api/recommendations/<int:user_id>', methods=['GET'])
@jwt_required()
def get_recommendations(user_id):
    results = TestResult.query.filter_by(user_id=user_id).order_by(TestResult.date_taken.desc()).first()
    if not results:
        return jsonify({'error': 'No test results found'}), 404
        
    recommendations = CareerRecommendation.query.filter_by(test_result_id=results.id)\
        .order_by(CareerRecommendation.match_score.desc()).limit(5).all()
    
    return jsonify([{
        'career': {
            'id': rec.career_id,
            'title': Career.query.get(rec.career_id).title,
            'description': Career.query.get(rec.career_id).description
        },
        'match_score': rec.match_score
    } for rec in recommendations])

@main.route('/api/careers', methods=['GET'])
def get_careers():
    careers = Career.query.all()
    return jsonify([{
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'required_skills': c.required_skills,
        'education_path': c.education_path,
        'salary_range': c.salary_range,
        'demand': c.demand
    } for c in careers])