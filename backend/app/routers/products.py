from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Product
from app.schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[ProductOut])
def list_products(search: str | None = None, db: Session = Depends(get_db)) -> list[Product]:
    query = select(Product).order_by(Product.id)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    return list(db.scalars(query).all())


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)) -> None:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="product not found")
    db.delete(product)
    db.commit()


@router.patch("/{product_id}/favourite", response_model=ProductOut)
def toggle_favourite(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="product not found")
    product.is_favourite = not product.is_favourite
    db.commit()
    db.refresh(product)
    return product
