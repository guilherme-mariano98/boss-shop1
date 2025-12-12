#!/usr/bin/env python3
"""
Test script to check the database structure
"""

import sqlite3
import os

def test_database():
    """Test the database structure"""
    db_path = 'frontend/database.db'
    
    if not os.path.exists(db_path):
        print(f"Database file not found: {db_path}")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print("Tables in database:")
        for table in tables:
            print(f"  - {table[0]}")
            
            # Get table structure
            cursor.execute(f"PRAGMA table_info({table[0]})")
            columns = cursor.fetchall()
            print(f"    Columns:")
            for column in columns:
                print(f"      - {column[1]} ({column[2]})")
            print()
        
        conn.close()
    except Exception as e:
        print(f"Error accessing database: {e}")

if __name__ == "__main__":
    test_database()