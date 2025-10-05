import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

class ExoplanetModel:
    def __init__(self, model_type='kepler'):

        self.accuracy_map = {
                'kepler': 87,
                'k2': 92,
                'tess': 77
            }
        
        self.model_type = model_type

        if model_type == 'tess':

            self.scaler = joblib.load(os.path.join(MODEL_DIR, 'tess_scaler.pkl'))
            self.model = joblib.load(os.path.join(MODEL_DIR, 'tess_model.pkl'))
            self.medians = joblib.load(os.path.join(MODEL_DIR, 'tess_medians.pkl')) 

            self.feature_columns = [
                'st_pmra', 'st_pmdec', 'pl_orbper', 'pl_trandurh', 'pl_trandep',
                'pl_rade', 'pl_insol', 'pl_eqt', 'st_tmag', 'st_dist',
                'st_teff', 'st_logg', 'st_rad', 'pl_pnum'
            ] 
            self.log_features = [
                'pl_orbper', 'pl_trandurh', 'pl_trandep',
                'pl_rade', 'pl_insol', 'pl_eqt',
                'st_dist', 'st_rad'
            ]
        
        elif model_type == 'kepler':

            self.scaler = joblib.load(os.path.join(MODEL_DIR, 'kepler_scaler.pkl'))
            self.model = joblib.load(os.path.join(MODEL_DIR, 'kepler_model.pkl'))
            self.medians = joblib.load(os.path.join(MODEL_DIR, 'kepler_medians.pkl')) 
            self.encoder = joblib.load(os.path.join(MODEL_DIR, 'kepler_encoder.pkl')) 

            self.num_cols = [ 'koi_period', 'koi_eccen', 'koi_longp', 'koi_impact', 'koi_duration', 'koi_ingress', 'koi_depth', 'koi_ror',
                'koi_srho', 'koi_prad', 'koi_sma', 'koi_incl', 'koi_teq', 'koi_insol', 'koi_dor', 'koi_ldm_coeff4',
                'koi_ldm_coeff3', 'koi_ldm_coeff2', 'koi_ldm_coeff1', 'koi_max_sngle_ev', 'koi_max_mult_ev', 'koi_model_snr', 'koi_count',
                'koi_num_transits', 'koi_tce_plnt_num', 'koi_bin_oedp_sig', 'koi_model_dof',
                'koi_model_chisq', 'koi_steff', 'koi_slogg', 'koi_smet', 'koi_srad', 'koi_smass', 'koi_sage',
                'ra', 'dec', 'koi_kepmag', 'koi_gmag', 'koi_rmag', 'koi_imag', 'koi_zmag', 'koi_jmag', 'koi_hmag', 'koi_kmag', 'koi_fwm_stat_sig',
                'koi_fwm_sra', 'koi_fwm_sdec', 'koi_fwm_srao', 'koi_fwm_sdeco', 'koi_fwm_prao', 'koi_fwm_pdeco', 'koi_dicco_mra', 'koi_dicco_mdec',
                'koi_dicco_msky', 'koi_dikco_mra', 'koi_dikco_mdec', 'koi_dikco_msky']
            
            self.cat_cols = ['koi_fittype', 'koi_parm_prov', 'koi_tce_delivname', 'koi_sparprov']

        elif model_type == 'k2':

            self.scaler = joblib.load(os.path.join(MODEL_DIR, 'k2_scaler.pkl'))
            self.model = joblib.load(os.path.join(MODEL_DIR, 'k2_model.pkl'))
            self.medians = joblib.load(os.path.join(MODEL_DIR, 'k2_medians.pkl')) 

            self.feature_columns = ['st_dens','pl_cmasse','sy_kepmag','st_radv','pl_orbsmax','pl_dens','pl_massj','pl_insol','pl_bmasse','ra','pl_trandep','st_logg','sy_bmag','st_age','pl_occdep',
                'pl_orbeccen','sy_jmag','sy_kmag','elat','dec','sy_w1mag','st_rad','pl_rvamp','pl_bmassj','pl_orblper','pl_tranmid','sy_gmag','elon','sy_imag','st_rotp','pl_msinij',
                'pl_orbtper','sy_pm','st_teff','pl_orbper','sy_plx','sy_umag','pl_cmassj','pl_eqt','sy_gaiamag','st_mass','pl_masse','sy_rmag','sy_dist','sy_zmag','pl_orbincl',
                'sy_pmdec','st_met','glat','sy_w4mag','pl_imppar','ttv_flag','pl_projobliq','st_lum','sy_pmra','pl_trueobliq','pl_ratror','sy_icmag','pl_rade','pl_trandur',
                'sy_hmag','glon','pl_radj','st_vsin','sy_w2mag','sy_vmag','pl_msinie','sy_tmag','pl_ratdor','sy_w3mag']

        else:
            self.scaler = StandardScaler()
            self.feature_columns = [
                'koi_period', 'koi_duration', 'koi_depth', 
                'koi_prad', 'koi_teq', 'koi_insol'
            ]
            
            self._initialize_model()
    
    def _initialize_model(self):
        """Initialize or load pre-trained model"""
        model_path = f'models/{self.model_type}_model.pkl'
        
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            # Create a mock trained model for demo purposes
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=20,
                random_state=42
            )
            # Train with synthetic data
            X_train = np.random.randn(1000, len(self.feature_columns))
            y_train = np.random.choice(['Confirmed', 'Candidate', 'False Positive'], 1000)
            self.scaler.fit(X_train)
            X_scaled = self.scaler.transform(X_train)
            self.model.fit(X_scaled, y_train)
    
    def preprocess_data(self, df):
        """Preprocess input data"""


        if self.model_type == 'tess':
            
            X = df[self.feature_columns]

            X[self.feature_columns].fillna(self.medians, inplace=True)

            for col in self.log_features:
                X.loc[:, col] = np.log1p(X.loc[:, col])

            X_final = self.scaler.transform(X.values) 

        elif self.model_type == 'k2':
            
            X = df[self.feature_columns]

            X[self.feature_columns].fillna(self.medians, inplace=True)

            X_final = self.scaler.transform(X.values)    

        elif self.model_type == 'kepler':      

            X = df[self.num_cols+self.cat_cols]

            X[self.num_cols].fillna(self.medians, inplace=True)

            X_test_cat = self.encoder.transform(X[self.cat_cols])

            X_test_cat = pd.DataFrame(X_test_cat, columns=self.encoder.get_feature_names_out(self.cat_cols), index=X.index)

            X_ohe = pd.concat([X[self.num_cols], X_test_cat], axis=1)

            X_final = self.scaler.transform(X_ohe)

            self.feature_names = X_ohe.columns.tolist()

        else:
            # Handle missing columns
            for col in self.feature_columns:
                if col not in df.columns:
                    df[col] = np.random.randn(len(df))
            
            # Select and clean features
            X = df[self.feature_columns].copy()
            X_final = X.fillna(X.mean())
        
        return X_final
    
    def predict(self, df):
        """Make predictions on input data"""

        if self.model_type == 'tess':
            X = self.preprocess_data(df)
            
            predictions = self.model.predict(X)
            probabilities = self.model.predict_proba(X)

            results = []
            for idx, (pred, proba) in enumerate(zip(predictions, probabilities)):
                confidence = float(np.max(proba) * 100)

                results.append({
                    'classification': pred,
                    'Porbability Score': round(confidence, 2),
                    'Planet radius': round(float(df.loc[idx, 'pl_rade']), 3) if pd.notna(df.loc[idx, 'pl_rade']) else "",
                    'Transit duration': round(float(df.loc[idx, 'pl_trandurh']), 2) if pd.notna(df.loc[idx, 'pl_trandurh']) else "",
                    'Planet orbital period': round(float(df.loc[idx, 'pl_orbper']), 2) if pd.notna(df.loc[idx, 'pl_orbper']) else ""
                })

        elif self.model_type == 'k2':
            X = self.preprocess_data(df)
            
            predictions = self.model.predict(X)
            probabilities = self.model.predict_proba(X)

            results = []
            for idx, (pred, proba) in enumerate(zip(predictions, probabilities)):
                confidence = float(np.max(proba) * 100)

                results.append({
                    'classification': pred,
                    'Porbability Score': round(confidence, 2),
                    'Planet radius': round(float(df.loc[idx, 'pl_rade']), 3) if pd.notna(df.loc[idx, 'pl_rade']) else "",
                    'Transit duration': round(float(df.loc[idx, 'pl_trandur']), 2) if pd.notna(df.loc[idx, 'pl_trandur']) else "",
                    'Planet orbital period': round(float(df.loc[idx, 'pl_orbper']), 2) if pd.notna(df.loc[idx, 'pl_orbper']) else ""
                })

        elif self.model_type == 'kepler':  
            X = self.preprocess_data(df)
            
            predictions = self.model.predict(X)
            probabilities = self.model.predict_proba(X)

            results = []
            for idx, (pred, proba) in enumerate(zip(predictions, probabilities)):
                confidence = float(np.max(proba) * 100)

                results.append({
                    'classification': pred,
                    'Porbability Score': round(confidence, 2),
                    'Planet orbital period': round(float(df.loc[idx, 'koi_period']), 3) if pd.notna(df.loc[idx, 'koi_period']) else "",
                    'Planet Radius': round(float(df.loc[idx, 'koi_prad']), 2) if pd.notna(df.loc[idx, 'koi_prad']) else "",
                    'Transit Depth': round(float(df.loc[idx, 'koi_depth']), 2) if pd.notna(df.loc[idx, 'koi_depth']) else ""
                })


        else:
            X = self.preprocess_data(df)
            X_scaled = self.scaler.transform(X)
            
            predictions = self.model.predict(X_scaled)
            probabilities = self.model.predict_proba(X_scaled)
        
            results = []
            for idx, (pred, proba) in enumerate(zip(predictions, probabilities)):
                confidence = float(np.max(proba) * 100)
                
                # Extract features from input
                row = df.iloc[idx] if idx < len(df) else {}
                
                results.append({
                    'classification': pred,
                    'Porbability Score': round(confidence, 2),
                    'orbital_period': round(float(X.iloc[idx]['koi_period']), 3) if 'koi_period' in X.columns else None,
                    'planet_radius': round(float(X.iloc[idx]['koi_prad']), 2) if 'koi_prad' in X.columns else None,
                    'transit_depth': int(X.iloc[idx]['koi_depth']) if 'koi_depth' in X.columns else None
                })
        
        return results
    
    def get_accuracy(self):
        """Return model accuracy"""
        return self.accuracy_map.get(self.model_type, 95.0)
    
    def save_model(self, path=None):
        """Save trained model"""
        if path is None:
            path = f'models/{self.model_type}_model.pkl'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
