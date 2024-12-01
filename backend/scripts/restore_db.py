import os
import subprocess
from app.core.config import settings

def restore_database(backup_file: str):
    """
    Restore a PostgreSQL database from a backup file
    """
    if not os.path.exists(backup_file):
        raise FileNotFoundError(f"Backup file not found: {backup_file}")

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

    try:
        # Drop existing connections
        subprocess.run([
            'psql',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            '-d', 'postgres',
            '-c', f'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = \'{db_name}\' AND pid <> pg_backend_pid();'
        ], env=env, check=True)

        # Drop and recreate database
        subprocess.run([
            'dropdb',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            '--if-exists',
            db_name
        ], env=env, check=True)

        subprocess.run([
            'createdb',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            db_name
        ], env=env, check=True)

        # Restore from backup
        subprocess.run([
            'pg_restore',
            '-h', db_host,
            '-p', str(db_port),
            '-U', db_user,
            '-d', db_name,
            '-v',  # Verbose
            backup_file
        ], env=env, check=True)
        print(f"Database restored successfully from: {backup_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error restoring database: {e}")
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python restore_db.py <backup_file>")
        sys.exit(1)
    restore_database(sys.argv[1])
