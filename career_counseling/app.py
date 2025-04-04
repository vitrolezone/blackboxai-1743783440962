from flask import Flask
from extensions import db, migrate, jwt
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///careers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'  # Should be from env in production
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Import and register blueprints within app context
    with app.app_context():
        # Import models after app and db are initialized
        from models import User, Question, Option, Career, TestResult, CareerRecommendation
        
        # Register blueprints without URL prefix (prefix is in routes)
        from views import main
        app.register_blueprint(main)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
