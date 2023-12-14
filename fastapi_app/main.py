from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from model import model_pipeline
from pydantic import BaseModel

app = FastAPI()

origins = ["*"]
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionInput(BaseModel):
    text_list: List[str]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict") 
def predict(input_data: PredictionInput): 
    results = model_pipeline(input_data.text_list)
    return results
