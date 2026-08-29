import random
from decimal import Decimal

from faker import Faker

from app.database import Base, SessionLocal, engine
from app.models import Product

PRODUCT_COUNT = 20

# adjective/noun word banks per category, so seeded names actually read like
# products in that category instead of generic stuff
PRODUCT_NAMES: dict[str, tuple[list[str], list[str]]] = {
    "Electronics": (
        ["Wireless", "4K", "Smart", "Portable", "Bluetooth", "Rechargeable", "HD", "Compact"],
        ["Headphones", "Speaker", "Smartwatch", "Power Bank", "Webcam", "Router", "Monitor", "Keyboard", "Charger", "Earbuds"],
    ),
    "Home & Kitchen": (
        ["Stainless Steel", "Non-Stick", "Ceramic", "Electric", "Digital", "Compact", "Cast Iron"],
        ["Cookware Set", "Blender", "Toaster", "Coffee Maker", "Air Fryer", "Cutting Board", "Knife Set", "Mixing Bowl", "Kettle", "Storage Container"],
    ),
    "Sports": (
        ["Adjustable", "Foldable", "Lightweight", "Non-Slip", "Insulated", "Waterproof"],
        ["Yoga Mat", "Dumbbell Set", "Water Bottle", "Resistance Bands", "Jump Rope", "Running Shoes", "Gym Bag", "Fitness Tracker", "Foam Roller", "Bike Helmet"],
    ),
    "Toys": (
        ["Interactive", "Remote Control", "Wooden", "Educational", "Glow-in-the-Dark", "Plush"],
        ["Building Blocks", "Puzzle", "Action Figure", "Race Car", "Board Game", "Stuffed Bear", "Toy Robot", "Play Kitchen Set", "Card Game", "Drone"],
    ),
    "Books": (
        ["Silent", "Hidden", "Last", "Forgotten", "Broken", "Golden", "Endless", "Secret"],
        ["Garden", "Voyage", "Kingdom", "Promise", "River", "Storm", "Library", "Shadow"],
    ),
    "Beauty": (
        ["Hydrating", "Matte", "Vitamin C", "Anti-Aging", "Organic", "Long-Lasting"],
        ["Face Serum", "Lipstick", "Moisturizer", "Sunscreen", "Shampoo", "Eyeshadow Palette", "Facial Cleanser", "Hand Cream", "Body Lotion", "Perfume"],
    ),
    "Grocery": (
        ["Organic", "Whole Grain", "Gluten-Free", "Extra Virgin", "Farm Fresh", "Roasted"],
        ["Honey", "Olive Oil", "Pasta", "Coffee Beans", "Granola", "Almond Butter", "Rice", "Trail Mix", "Cereal", "Tea"],
    ),
}

CATEGORIES = list(PRODUCT_NAMES)

fake = Faker()


def _make_name(category: str) -> str:
    adjectives, nouns = PRODUCT_NAMES[category]
    name = f"{random.choice(adjectives)} {random.choice(nouns)}"
    return f"The {name}" if category == "Books" else name


def seed_products() -> None:
    db = SessionLocal()
    try:
        if db.query(Product).count() > 0:
            print("products table already has data, skipping seed")
            return

        used_names: set[str] = set()
        products = []
        for _ in range(PRODUCT_COUNT):
            category = random.choice(CATEGORIES)
            name = _make_name(category)
            while name in used_names:
                name = _make_name(category)
            used_names.add(name)

            products.append(
                Product(
                    name=name,
                    description=fake.sentence(nb_words=12),
                    category=category,
                    price=Decimal(str(round(random.uniform(5, 500), 2))),
                    stock_quantity=random.randint(0, 200),
                    total_sold=random.randint(0, 500),
                    is_favourite=False,
                )
            )

        db.add_all(products)
        db.commit()
        print(f"seeded {PRODUCT_COUNT} products")
    finally:
        db.close()


if __name__ == "__main__":
    # lets this run standalone too: docker-compose exec backend python -m app.seed
    Base.metadata.create_all(bind=engine)
    seed_products()
