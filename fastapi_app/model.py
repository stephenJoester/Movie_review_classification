from keras.models import load_model
from transformers import DistilBertTokenizer, TFDistilBertMainLayer
from preprocessing import clean_data, prepare_data
import numpy as np
from typing import List

model = load_model("models/TFDistilBert_model.h5", custom_objects={'TFDistilBertMainLayer':TFDistilBertMainLayer})

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

def model_pipeline(text_list : List[str]) :
    data = list(map(clean_data, text_list))

    X_input_ids, X_attn_masks = prepare_data(data, tokenizer)
    a = {'input_ids': X_input_ids, 'attention_mask': X_attn_masks}
    y_pred = model.predict(a)
    # print(y_pred)
    y_pred = np.argmax(y_pred, axis=1)
    print(y_pred)
    classes = ['positive', 'neutral', 'negative']
    y_pred = [classes[i] for i in y_pred]
    print(y_pred)
    return y_pred
    