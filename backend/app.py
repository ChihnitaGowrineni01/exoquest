from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from model import ExoplanetModel
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize models
models = {
    'kepler': ExoplanetModel('kepler'),
    'k2': ExoplanetModel('k2'),
    'tess': ExoplanetModel('tess')
}

def make_serializable(obj):
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'ExoQuest API is running'})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        model_type = request.form.get('model')

        if not model_type:
            return jsonify({'error': 'Model type not provided'}), 400
        
        if file.filename == '': 
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only CSV files are allowed'}), 400
        
        if model_type not in models:
            return jsonify({'error': 'Invalid model type'}), 400
        
        # Read CSV file
        df = pd.read_csv(file)
        
        # Get predictions
        model = models[model_type]
        predictions = model.predict(df)
        
        if model_type == 'tess':
            star_ids = ('TIC ' + df['tid'].fillna('').astype(str)).tolist()
            important_features = ['Planet radius', 'Transit duration', 'Planet orbital period']
        elif model_type == 'kepler':
            star_ids = ('KIC ' + df['kepid'].fillna('').astype(str)).tolist()
            important_features = ['Planet orbital period', 'Planet Radius', 'Transit Depth']
        elif model_type == 'k2':
            star_ids = (df['hostname'].fillna('').astype(str)).tolist()
            important_features = ['Planet radius', 'Transit duration', 'Planet orbital period']
        else:
            star_ids = {f"KIC-{10000000 + idx * 12345}" for idx in range(df)}
            important_features = ['orbital_period', 'planet_radius', 'transit_depth']
        


        # Format results
        results = []
        for idx, pred in enumerate(predictions):
            results_dict = {'id': idx + 1,
                'star_id': star_ids[idx],
                'classification': pred['classification'],
                'Porbability Score': pred['Porbability Score']}
            for each in important_features:
                results_dict[each] = pred.get(each, 'N/A')
            results.append(results_dict)
        
        return jsonify({
            'success': True,
            'results': [ {k: make_serializable(v) for k, v in r.items()} for r in results ],
            'total': len(results),
            'model_used': model_type
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    model_info = []
    for name, model in models.items():
        model_info.append({
            'name': name,
            'accuracy': model.get_accuracy(),
            'status': 'ready'
        })
    return jsonify(model_info)

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        stats = {
            'training_accuracy': {
                'kepler': [92.1, 93.5, 94.8, 95.2, 96.1, 96.8],
                'k2': [90.5, 91.8, 93.2, 94.1, 94.9, 95.3],
                'tess': [94.2, 95.1, 96.3, 96.8, 97.0, 97.2]
            },
            'testing_accuracy': {
                'kepler': [91.5, 92.8, 93.9, 94.5, 95.3, 96.2],
                'k2': [89.8, 90.9, 92.1, 93.2, 94.0, 94.8],
                'tess': [93.5, 94.3, 95.5, 96.0, 96.5, 96.9]
            },
            'classification_distribution': [
                {'name': 'Confirmed', 'value': 5234},
                {'name': 'Candidate', 'value': 8956},
                {'name': 'False Positive', 'value': 3421}
            ],
            'feature_importance': [
                {'feature': 'Transit Depth', 'importance': 0.28},
                {'feature': 'Orbital Period', 'importance': 0.24},
                {'feature': 'Planet Radius', 'importance': 0.19},
                {'feature': 'Transit Duration', 'importance': 0.15},
                {'feature': 'Equilibrium Temp', 'importance': 0.14}
            ]
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
