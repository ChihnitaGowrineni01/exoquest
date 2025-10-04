# ExoQuest Backend API

Flask-based backend for ExoQuest exoplanet detection system.

## Setup

### Local Development

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Predict Exoplanets
```
POST /api/predict
Content-Type: multipart/form-data

Parameters:
- file: CSV file with exoplanet data
- model: Model type (kepler, k2, or tess)
```

### Get Models Info
```
GET /api/models
```

### Dashboard Statistics
```
GET /api/dashboard/stats
```

## Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Create a Procfile:
```
web: gunicorn app:app
```

3. Deploy:
```bash
heroku create exoquest-api
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repository
2. Set root directory to `backend`
3. Railway will auto-detect Flask and deploy

## Expected CSV Format

The CSV file should contain these columns:
- `koi_period`: Orbital period (days)
- `koi_duration`: Transit duration (hours)
- `koi_depth`: Transit depth (ppm)
- `koi_prad`: Planetary radius (Earth radii)
- `koi_teq`: Equilibrium temperature (Kelvin)
- `koi_insol`: Insolation flux (Earth flux)
