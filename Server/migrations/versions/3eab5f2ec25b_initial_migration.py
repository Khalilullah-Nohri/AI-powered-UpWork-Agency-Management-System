"""Initial migration with indexes, constraints, and full-text support.

Revision ID: 3eab5f2ec25b
Revises: 
Create Date: 2025-09-15 16:38:46.093407
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "3eab5f2ec25b"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # --- Jobs table ---
    with op.batch_alter_table("jobs", schema=None) as batch_op:
        batch_op.alter_column(
            "match_score",
            existing_type=mysql.INTEGER(),
            type_=sa.Float(),
            existing_nullable=True,
            existing_server_default=sa.text("'0'"),
        )
        batch_op.create_index("ix_jobs_status", ["status"], unique=False)
        batch_op.create_index("ix_jobs_title", ["title"], unique=False)

    # Add FULLTEXT indexes manually (MySQL only)
    op.execute("CREATE FULLTEXT INDEX IF NOT EXISTS ft_jobs_skills ON jobs (skills)")
    op.execute(
        "CREATE FULLTEXT INDEX IF NOT EXISTS ft_jobs_title_description ON jobs (title, description)"
    )

    # --- Tasks table ---
    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.create_index("ix_tasks_assigned_to", ["assigned_to"], unique=False)
        batch_op.create_index("ix_tasks_job_id", ["job_id"], unique=False)
        batch_op.create_index("ix_tasks_priority", ["priority"], unique=False)
        batch_op.create_index("ix_tasks_status", ["status"], unique=False)

    # Foreign keys for tasks
    op.create_foreign_key("fk_tasks_job", "tasks", "jobs", ["job_id"], ["id"])
    op.create_foreign_key(
        "fk_tasks_user", "tasks", "users", ["assigned_to"], ["id"]
    )

    # --- Users table ---
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.create_index("ix_users_email", ["email"], unique=True)

    # Add FULLTEXT index for users
    op.execute("CREATE FULLTEXT INDEX IF NOT EXISTS ft_users_skills ON users (skills)")


def downgrade():
    # --- Users table ---
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_index("ix_users_email")

    op.execute("DROP INDEX IF EXISTS ft_users_skills ON users")

    # --- Tasks table ---
    op.drop_constraint("fk_tasks_user", "tasks", type_="foreignkey")
    op.drop_constraint("fk_tasks_job", "tasks", type_="foreignkey")

    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.drop_index("ix_tasks_status")
        batch_op.drop_index("ix_tasks_priority")
        batch_op.drop_index("ix_tasks_job_id")
        batch_op.drop_index("ix_tasks_assigned_to")

    # --- Jobs table ---
    with op.batch_alter_table("jobs", schema=None) as batch_op:
        batch_op.drop_index("ix_jobs_title")
        batch_op.drop_index("ix_jobs_status")
        batch_op.alter_column(
            "match_score",
            existing_type=sa.Float(),
            type_=mysql.INTEGER(),
            existing_nullable=True,
            existing_server_default=sa.text("'0'"),
        )

    op.execute("DROP INDEX IF EXISTS ft_jobs_title_description ON jobs")
    op.execute("DROP INDEX IF EXISTS ft_jobs_skills ON jobs")
