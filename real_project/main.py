from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers import router as api_router
import os
import uvicorn

app = FastAPI()
app.include_router(api_router)

app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="localhost", port=port)