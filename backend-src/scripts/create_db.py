import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='postgres',
        host='localhost'
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    
    # Create a cursor object
    cur = conn.cursor()
    
    try:
        # Create database if it doesn't exist
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'market_growth_db'")
        exists = cur.fetchone()
        if not exists:
            cur.execute('CREATE DATABASE market_growth_db')
            print("Database created successfully!")
        else:
            print("Database already exists!")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close cursor and connection
        cur.close()
        conn.close()

if __name__ == "__main__":
    create_database()