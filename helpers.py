import joblib
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import re

# Download NLTK data (only needed once)
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')

def load_artifacts():
    model = joblib.load('model/spam_classifier.pkl')
    vectorizer = joblib.load('model/tfidf_vectorizer.pkl')
    return model, vectorizer

def clean_text(text):
    lemmatizer = WordNetLemmatizer()
    stop_words = set(stopwords.words('english'))
    
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\@\w+|\#|[^a-zA-Z\s]', '', text)
    text = text.lower()
    tokens = [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    return ' '.join(tokens)

# Pre-load artifacts when module imports
model, vectorizer = load_artifacts()