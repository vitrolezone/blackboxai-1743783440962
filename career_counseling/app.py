from flask import Flask
from extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///careers.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
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
