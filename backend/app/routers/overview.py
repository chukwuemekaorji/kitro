from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import OverviewStats

router = APIRouter(prefix="/overview", tags=["overview"])


@router.get("/stats", response_model=OverviewStats)
def get_stats(db: Session = Depends(get_db)) -> OverviewStats:
    total_sold, total_available = db.execute(
        select(
            func.coalesce(func.sum(Product.total_sold), 0),
            func.coalesce(func.sum(Product.stock_quantity), 0),
        )
    ).one()
    return OverviewStats(total_sold=total_sold, total_available=total_available)
