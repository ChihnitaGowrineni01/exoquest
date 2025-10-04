"""
Script to train ExoQuest models on actual NASA datasets.
Place your Kepler, K2, and TESS CSV files in the data/ directory.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def load_and_preprocess(filepath, target_col='koi_disposition'):
    """Load and preprocess exoplanet dataset"""
    df = pd.read_csv(filepath)
    
    # Feature columns
    feature_cols = [
        'koi_period', 'koi_duration', 'koi_depth', 
        'koi_prad', 'koi_teq', 'koi_insol'
    ]
    
    # Filter columns that exist
    available_features = [col for col in feature_cols if col in df.columns]
    
    if target_col not in df.columns:
        print(f"Warning: Target column {target_col} not found. Using mock data.")
        return None, None, available_features
    
    # Prepare features and target
    X = df[available_features].copy()
    y = df[target_col].copy()
    
    # Handle missing values
    X = X.fillna(X.mean())
    
    # Map target labels
    label_mapping = {
        'CONFIRMED': 'Confirmed',
        'CANDIDATE': 'Candidate',
        'FALSE POSITIVE': 'False Positive'
    }
    y = y.map(label_mapping).fillna('Candidate')
    
    return X, y, available_features

def train_model(X, y, model_name, model_type='random_forest'):
    """Train a model and save it"""
    print(f"\nTraining {model_name} model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Initialize model
    if model_type == 'random_forest':
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
    else:
        model = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=10,
            random_state=42
        )
    
    # Train
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, f'models/{model_name}_model.pkl')
    joblib.dump(scaler, f'models/{model_name}_scaler.pkl')
    
    print(f"Model saved to models/{model_name}_model.pkl")
    
    return accuracy

def main():
    """Train all models"""
    datasets = {
        'kepler': 'data/kepler_data.csv',
        'k2': 'data/k2_data.csv',
        'tess': 'data/tess_data.csv'
    }
    
    results = {}
    
    for name, filepath in datasets.items():
        if os.path.exists(filepath):
            X, y, features = load_and_preprocess(filepath)
            if X is not None:
                accuracy = train_model(X, y, name)
                results[name] = accuracy
            else:
                print(f"Skipping {name} - insufficient data")
        else:
            print(f"\nDataset not found: {filepath}")
            print(f"Please download the {name.upper()} dataset from NASA and place it in the data/ directory")
    
    if results:
        print("\n" + "="*50)
        print("TRAINING SUMMARY")
        print("="*50)
        for name, acc in results.items():
            print(f"{name.upper()}: {acc:.2%}")
    else:
        print("\nNo datasets found. Creating demo models with synthetic data...")
        # Create demo models
        from model import ExoplanetModel
        for name in ['kepler', 'k2', 'tess']:
            model = ExoplanetModel(name)
            model.save_model()
            print(f"Created demo model: {name}")

if __name__ == '__main__':
    main()
