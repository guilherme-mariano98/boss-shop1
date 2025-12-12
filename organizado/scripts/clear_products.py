#!/usr/bin/env python3
"""
Script to clear all products from the database
"""

import sqlite3
import os

def clear_products():
    """Clear all products from the database"""
    db_path = 'frontend/database.db'
    
    if not os.path.exists(db_path):
        print(f"Database file not found: {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Clear all products
        cursor.execute("DELETE FROM products")
        deleted_count = cursor.rowcount
        
        # Reset the autoincrement counter
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='products'")
        
        # Commit changes
        conn.commit()
        conn.close()
        
        print(f"Successfully deleted {deleted_count} products from the database")
        return True
        
    except Exception as e:
        print(f"Error clearing products: {e}")
        return False

if __name__ == "__main__":
    print("Clearing all products from the database...")
    if clear_products():
        print("Products cleared successfully!")
    else:
        print("Failed to clear products")