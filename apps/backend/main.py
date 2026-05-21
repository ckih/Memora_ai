from fastapi import FastAPI

app = FastAPI(title="Memora AI API")


@app.get("/")
async def root():
    return {"message": "Welcome to Memora AI API"}
