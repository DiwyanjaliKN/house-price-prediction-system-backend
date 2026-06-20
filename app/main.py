from fastapi import FastAPI



app = FastAPI(
    title="FastAPI Template",
    description="A simple FastAPI template.",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "welcome to FastAPI Template!"}

@app.get("/health")
def read_health():
    return {"status": "ok"}

