import os
import subprocess
from datetime import datetime
from app.core.config import settings

def backup_database():
    """
    Create a backup of the PostgreSQL database
    """
    # Create backups directory if it doesn't exist
    backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
    os.makedirs(backup_dir, exist_ok=True)

    # Parse database URL
    db_url = settings.DATABASE_URL
    db_name = db_url.path[1:]  # Remove leading '/'
    db_user = db_url.user
    db_password = db_url.password
    db_host = db_url.host
    db_port = db_url.port or 5432

    # Set environment variable for password
    env = os.environ.copy()
    env['PGPASSWORD'] = db_password

    # Create backup filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(backup_dir, f'backup_{timestamp}.sql')

    try:
        # Run pg_dump
        subprocess.run([
            'pg_dump',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            '-F', 'c',  # Custom format
            '-b',  # Include large objects
            '-v',  # Verbose
            '-f', backup_file,
            db_name
        ], env=env, check=True)
        print(f"Backup created successfully: {backup_file}")
        return backup_file
    except subprocess.CalledProcessError as e:
        print(f"Error creating backup: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise

if __name__ == "__main__":
    backup_database()
