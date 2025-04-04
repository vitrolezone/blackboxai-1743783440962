from app import create_app
from extensions import db
from models import User, Question, Option, Career

def seed_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.session.query(Option).delete()
        db.session.query(Question).delete()
        db.session.query(Career).delete()
        db.session.commit()

        # Create sample careers
        careers = [
            Career(title='Software Engineer', description='Develop software applications',
                  required_skills='Programming, Problem Solving', education_path='Computer Science degree',
                  salary_range='$80,000-$120,000', demand='High'),
            Career(title='Data Scientist', description='Analyze complex data',
                  required_skills='Statistics, Machine Learning', education_path='Mathematics/Statistics degree',
                  salary_range='$90,000-$130,000', demand='High'),
            Career(title='Graphic Designer', description='Create visual content',
                  required_skills='Creativity, Adobe Suite', education_path='Design degree',
                  salary_range='$50,000-$80,000', demand='Medium')
        ]
        db.session.add_all(careers)
        db.session.commit()

        # Create sample questions
        questions = [
            Question(text='How much do you enjoy solving complex problems?', category='aptitude'),
            Question(text='How interested are you in working with visual design?', category='interest'),
            Question(text='Do you prefer working independently or in teams?', category='aptitude')
        ]
        db.session.add_all(questions)
        db.session.commit()

        # Create options for questions
        options = [
            Option(text='Not at all', score=1, question_id=1),
            Option(text='Somewhat', score=3, question_id=1),
            Option(text='Very much', score=5, question_id=1),
            Option(text='Not interested', score=1, question_id=2),
            Option(text='Neutral', score=3, question_id=2),
            Option(text='Very interested', score=5, question_id=2),
            Option(text='Independently', score=1, question_id=3),
            Option(text='Both equally', score=3, question_id=3),
            Option(text='In teams', score=5, question_id=3)
        ]
        db.session.add_all(options)
        db.session.commit()

        print("Successfully seeded database with initial data!")

if __name__ == '__main__':
    seed_data()