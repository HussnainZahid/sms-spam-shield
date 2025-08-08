from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import joblib
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import re
import nltk

nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)

# Load model and vectorizer
model = joblib.load('model/spam_classifier.pkl')
vectorizer = joblib.load('model/tfidf_vectorizer.pkl')

def clean_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\@\w+|\#|[^a-zA-Z\s]', '', text)
    text = text.lower()
    tokens = [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    return ' '.join(tokens)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        message = request.form['message']
        cleaned_text = clean_text(message)
        vectorized_text = vectorizer.transform([cleaned_text])
        prediction = model.predict(vectorized_text)[0]
        result = "SPAM" if prediction == 1 else "NOT SPAM"
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static/images'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

if __name__ == '__main__':
    app.run(debug=True)