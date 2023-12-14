import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
import re
import string
from nltk import word_tokenize, pos_tag
import numpy as np


def clean_text_round1(text):
    '''Make text lowercase, remove text in round  brackets, remove new line character, remove punctuation and remove words containing numbers.'''
    text = str(text).lower()
    text = re.sub(r'\(.*?\)', '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'[·–‘’“”…]', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()

stop_words = ['film', 'movie', 'story', 'show', 'character', 'one', 'like']
stop_words.extend(stopwords.words('english'))

def clean_text_round2(text):
    '''Remove stop words'''
    # Create a regex pattern to match stop words
    pattern = r'\b(?:' + '|'.join(map(re.escape, stop_words)) + r')\b'
    text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

wnet = nltk.stem.WordNetLemmatizer()

def lemmtization(text):
    '''Lemmtization'''
    words = text.split(' ')
    lemmatized_words = [wnet.lemmatize(word) for word in words]
    lemmatized_text = ' '.join(lemmatized_words)
    return lemmatized_text

list_except = ['dont', 'doesnt', 'didnt', 'cant', 'couldnt', 'shouldnt', 'isnt', 'arent', 'hasnt', 'havent' 'wont']
def remove_nouns(text):
    '''Given a string of text, tokenize the text and pull out only the nouns.'''
    is_noun = lambda pos: pos[:2] == 'NN'
    tokenized = word_tokenize(text)
    all_nouns = [word for (word, pos) in pos_tag(tokenized) if not is_noun(pos) & (word not in list_except)]
    return ' '.join(all_nouns)

def clean_data(text):
    text_r1 = clean_text_round1(text)
    text_r2 = clean_text_round2(text_r1)
    text_lem = lemmtization(text_r2)
    text_cleaned = remove_nouns(text_lem)
    return text_cleaned

max_length = 256

def prepare_data(input_data, tokenizer):
    ids = np.zeros((len(input_data), max_length))
    masks = np.zeros((len(input_data), max_length))
    for i, text in enumerate(input_data):
        tokenized_text = tokenizer.encode_plus(
            text,
            max_length=max_length,
            truncation=True,
            padding='max_length',
            add_special_tokens=True,
            return_tensors='tf'
        )
        ids[i, :] = tokenized_text.input_ids
        masks[i, :] = tokenized_text.attention_mask
    return ids, masks
