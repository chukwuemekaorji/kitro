from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 - import registers Product/User on Base.metadata before create_all
from app.database import Base, engine
from app.routers import auth, overview, products
from app.seed import seed_all

FRONTEND_ORIGIN = "http://localhost:5173"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_all()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(overview.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
