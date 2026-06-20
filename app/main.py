from fastapi import FastAPI
from pathlib import Path
import pickle


app = FastAPI(
    title="FastAPI Template",
    description="A simple FastAPI template.",
    version="1.0.0",
)

#getting the pickle file path
MODEL_PATH = Path(__file__).resolve().parent / "models" / "bengaluru_house_price_linear_regression_model.pickle"


#loading the model and feature columns from the pickle file
try:
    with open(MODEL_PATH, "rb") as file:
        model_package = pickle.load(file)

        model = model_package["model"]
        feature_columns = model_package["feature_columns"]

except FileNotFoundError:
    raise RuntimeError(f"The pickle file was not found at the specified path: {MODEL_PATH}")

except KeyError:
    raise RuntimeError("The pickle file does not contain the expected keys: 'model' and 'feature_columns'")

except Exception as e:
    raise RuntimeError(f"An unexpected error occurred: {e}")



#endpoints
@app.get("/")
def read_root():
    return {"message": "welcome to FastAPI Template!"}

@app.get("/health")
def read_health():
    return {"status": "ok"}

