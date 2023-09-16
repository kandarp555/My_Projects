# app.py
from flask import Flask, render_template, jsonify
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import zipfile

app = Flask(__name__)

# Function to read data from the ZIP file
def read_data_from_zip():
    with zipfile.ZipFile('Data.zip', 'r') as z:
        with z.open('Data.xlsx') as f:
            return pd.read_excel(f)

# Load the crime data from the Excel file in the ZIP
data = read_data_from_zip()

# One-hot encode the 'District' and 'Neighborhood' columns
data = pd.get_dummies(data, columns=['District', 'Neighborhood'])

# Encode the 'NumericLocation' column as numeric if it exists in the DataFrame
if 'NumericLocation' in data.columns:
    data['NumericLocation'] = pd.factorize(data['NumericLocation'])[0]

# Preprocess the data (You may need to customize this based on your dataset)
scaler = StandardScaler()
numeric_columns = data.select_dtypes(include=['int64', 'float64']).columns
data[numeric_columns] = scaler.fit_transform(data[numeric_columns])

# Implement hotspot analysis using K-means clustering (You can customize this)
def find_hotspots(k=10):
    # Select the scaled location data for clustering
    scaled_location_data = data[['District_District 1', 'District_District 2', 'Neighborhood_Neighborhood 1', 'Neighborhood_Neighborhood 2']]

    # Perform K-means clustering
    kmeans = KMeans(n_clusters=k, random_state=42)
    data['hotspot_label'] = kmeans.fit_predict(scaled_location_data)

    # Return the hotspot information along with the original data
    return data[['District', 'Neighborhood', 'NumericLocation', 'hotspot_label']].to_dict(orient='records')

# API endpoint to get crime hotspots
@app.route('/api/hotspots')
def get_hotspots():
    hotspots = find_hotspots(k=10)  # You can adjust the number of hotspots (k) here
    return jsonify(hotspots)

# Frontend routes
@app.route('/')
def index():
    return render_template('html.html')

@app.route('/map')
def map():
    return render_template('map.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
