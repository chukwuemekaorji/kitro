import random
from decimal import Decimal

from faker import Faker

from app.database import Base, SessionLocal, engine
from app.models import Product

PRODUCT_COUNT = 35
CATEGORIES = ["Electronics", "Home & Kitchen", "Sports", "Toys", "Books", "Beauty", "Grocery"]

fake = Faker()


def seed_products() -> None:
    db = SessionLocal()
    try:
        if db.query(Product).count() > 0:
            print("products table already has data, skipping seed")
            return

        products = [
            Product(
                name=fake.unique.catch_phrase(),
                description=fake.sentence(nb_words=12),
                category=random.choice(CATEGORIES),
                price=Decimal(str(round(random.uniform(5, 500), 2))),
                stock_quantity=random.randint(0, 200),
                total_sold=random.randint(0, 500),
                is_favourite=False,
            )
            for _ in range(PRODUCT_COUNT)
        ]
        db.add_all(products)
        db.commit()
        print(f"seeded {PRODUCT_COUNT} products")
    finally:
        db.close()


if __name__ == "__main__":
    # lets this run standalone too: docker-compose exec backend python -m app.seed
    Base.metadata.create_all(bind=engine)
    seed_products()
