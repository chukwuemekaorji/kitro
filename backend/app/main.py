from contextlib import asynccontextmanager

from fastapi import FastAPI

from app import models  # noqa: F401 - import registers Product on Base.metadata before create_all
from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
