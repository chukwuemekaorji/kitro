from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(search: str | None = None, db: Session = Depends(get_db)) -> list[Product]:
    query = select(Product).order_by(Product.id)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    return list(db.scalars(query).all())
