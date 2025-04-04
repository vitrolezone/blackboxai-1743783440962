"""Initial tables

Revision ID: 155170754f02
Revises: 
Create Date: 2025-03-27 04:31:18.388770

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '155170754f02'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('career',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('required_skills', sa.Text(), nullable=True),
    sa.Column('education_path', sa.Text(), nullable=True),
    sa.Column('salary_range', sa.String(length=50), nullable=True),
    sa.Column('demand', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('question',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=500), nullable=False),
    sa.Column('category', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('option',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('text', sa.String(length=200), nullable=False),
    sa.Column('score', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['question.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('test_result',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('date_taken', sa.DateTime(), nullable=False),
    sa.Column('aptitude_score', sa.Integer(), nullable=True),
    sa.Column('interest_score', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('career_recommendation',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('test_result_id', sa.Integer(), nullable=False),
    sa.Column('career_id', sa.Integer(), nullable=False),
    sa.Column('match_score', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['career_id'], ['career.id'], ),
    sa.ForeignKeyConstraint(['test_result_id'], ['test_result.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('career_recommendation')
    op.drop_table('test_result')
    op.drop_table('option')
    op.drop_table('user')
    op.drop_table('question')
    op.drop_table('career')
    # ### end Alembic commands ###
