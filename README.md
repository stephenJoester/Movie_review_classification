# Movie Review Classification

This project employs deep learning techniques, specifically utilizing BERT model to perform sentiment analysis on IMDb movie reviews. The reviews are classified into three sentiment categories : positive, negative, neutral.
The model is deployed using FastAPI and Uvicorn, provides real-time sentiment labels within IMDb platform with Chrome extension.
Contributors : Data : [NKQUAT](https://github.com/NK-QUOC), Model : [Le Trung Hoang](https://github.com/trunghoang2002), Deployment : [stephenJoester](https://github.com/stephenJoester)

## How to run 
1. Install dependencies
```
pip install -r requirements.txt
```
2. Start the FastAPI server
```
cd ./fastapi_app
uvicorn main:app --reload
```
3. Install Chrome extension
Load the Chrome extension by enabling developer mode, clicking "Load unpacked," and selecting the `Movie_review_classification/Review_classification_extension` directory.
4. Visit IMDb movie review pages to see the results.
