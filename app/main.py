from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
import pickle
import numpy as np

allowed_origins = [
    "http://localhost:5173",
]

# Request Model


class HousePricePredictionInput(BaseModel):
    total_sqft: float
    bath: int
    balcony: int
    bhk: int
    area_type: str
    location: str


# FastAPI App


app = FastAPI(
    title="House Price Prediction API",
    description="An API for predicting Bengaluru house prices",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load Model


MODEL_PATH = (
    Path(__file__).resolve().parent
    / "models"
    / "bengaluru_house_price_linear_regression_model.pickle"
)

try:
    with open(MODEL_PATH, "rb") as file:
        model_package = pickle.load(file)

    model = model_package["model"]
    feature_columns = model_package["feature_columns"]

except FileNotFoundError:
    raise RuntimeError(
        f"Model file not found:\n{MODEL_PATH}"
    )

except KeyError:
    raise RuntimeError(
        "Pickle file must contain 'model' and 'feature_columns'."
    )

except Exception as e:
    raise RuntimeError(str(e))



# Feature Lists


NUMERICAL_TYPE_FEATURES = [
    "total_sqft",
    "bath",
    "balcony",
    "bhk",
]

AREA_TYPE_FEATURES = [
    "Built-up  Area",
    "Plot  Area",
    "Carpet  Area",
    "Super built-up  Area",
]

LOCATION_TYPE_FEATURES = [
    feature
    for feature in feature_columns
    if feature not in NUMERICAL_TYPE_FEATURES
    and feature not in AREA_TYPE_FEATURES
]


# Helper Function


def create_input_row(data: HousePricePredictionInput):

    input_row = np.zeros(len(feature_columns))

    numerical_features = {
        "total_sqft": data.total_sqft,
        "bath": data.bath,
        "balcony": data.balcony,
        "bhk": data.bhk,
    }

    for feature, value in numerical_features.items():
        index = feature_columns.index(feature)
        input_row[index] = value

    # Area Type

    if data.area_type not in AREA_TYPE_FEATURES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid area_type: {data.area_type}",
        )

    area_index = feature_columns.index(data.area_type)
    input_row[area_index] = 1

    # Location

    if data.location not in LOCATION_TYPE_FEATURES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid location: {data.location}",
        )

    location_index = feature_columns.index(data.location)
    input_row[location_index] = 1

    return input_row


# Endpoints


@app.get("/")
def root():
    return {
        "message": "House Price Prediction API Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/model-info")
def model_info():

    return {
        "model_type": type(model).__name__,
        "number_of_features": len(feature_columns),
        "sample_feature_columns": feature_columns[:10],
    }


@app.get("/options")
def get_options():

    return {
        "area_type_features": AREA_TYPE_FEATURES,
        "location_type_features": LOCATION_TYPE_FEATURES,
    }


@app.post("/predict")
def predict(data: HousePricePredictionInput):

    input_row = create_input_row(data)

    prediction = model.predict([input_row])[0]

    return {
        "prediction": round(float(prediction), 2),
        "input_data": data.model_dump(),
    }