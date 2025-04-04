from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from extensions import db
from models import User, Question, Option, Career, TestResult, CareerRecommendation
from ai_engine import analyze_results, recommend_careers

main = Blueprint('main', __name__)

@main.route('/api/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201

@main.route('/api/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    return jsonify([{
        'id': q.id,
        'text': q.text,
        'category': q.category,
        'options': [{'id': o.id, 'text': o.text} for o in q.options]
    } for q in questions])

@main.route('/api/submit-test', methods=['POST'])
def submit_test():
    try:
        data = request.json
        
        # Validate input
        if not data or 'user_id' not in data or 'answers' not in data:
            return jsonify({'error': 'Invalid request data'}), 400
            
        user = User.query.get(data['user_id'])
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