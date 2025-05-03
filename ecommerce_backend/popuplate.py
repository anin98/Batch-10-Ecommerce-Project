import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product

def create_sample_data():
    """Create sample categories and products"""
    
    # Create superuser if doesn't exist
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created admin user (username: admin, password: admin123)")
    
    # Create categories
    categories = [
        {'name': 'Electronics', 'slug': 'electronics'},
        {'name': 'Clothing', 'slug': 'clothing'},
        {'name': 'Books', 'slug': 'books'},
        {'name': 'Home & Kitchen', 'slug': 'home-kitchen'},
    ]
    
    for cat_data in categories:
        Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
    
    print(f"Created {len(categories)} categories")
    
    # Get category instances
    electronics = Category.objects.get(slug='electronics')
    clothing = Category.objects.get(slug='clothing')
    books = Category.objects.get(slug='books')
    home_kitchen = Category.objects.get(slug='home-kitchen')
    
    # Create products
    products = [
        {
            'category': electronics,
            'name': 'Smartphone X',
            'slug': 'smartphone-x',
            'description': 'The latest smartphone with amazing features.',
            'price': 699.99,
            'stock': 50,
        },
        {
            'category': electronics,
            'name': 'Laptop Pro',
            'slug': 'laptop-pro',
            'description': 'Powerful laptop for professionals.',
            'price': 1299.99,
            'stock': 20,
        },
        {
            'category': electronics,
            'name': 'Wireless Headphones',
            'slug': 'wireless-headphones',
            'description': 'Premium sound quality with noise cancellation.',
            'price': 199.99,
            'stock': 100,
        },
        {
            'category': clothing,
            'name': 'Men\'s T-Shirt',
            'slug': 'mens-tshirt',
            'description': 'Comfortable cotton t-shirt for everyday wear.',
            'price': 19.99,
            'stock': 200,
        },
        {
            'category': clothing,
            'name': 'Women\'s Jeans',
            'slug': 'womens-jeans',
            'description': 'Stylish and durable jeans for women.',
            'price': 49.99,
            'stock': 150,
        },
        {
            'category': books,
            'name': 'Programming Basics',
            'slug': 'programming-basics',
            'description': 'Learn the fundamentals of programming.',
            'price': 29.99,
            'stock': 75,
        },
        {
            'category': books,
            'name': 'Science Fiction Collection',
            'slug': 'scifi-collection',
            'description': 'A collection of the best science fiction stories.',
            'price': 24.99,
            'stock': 60,
        },
        {
            'category': home_kitchen,
            'name': 'Coffee Maker',
            'slug': 'coffee-maker',
            'description': 'Automatic coffee maker for perfect coffee every time.',
            'price': 89.99,
            'stock': 40,
        },
        {
            'category': home_kitchen,
            'name': 'Knife Set',
            'slug': 'knife-set',
            'description': 'Professional grade kitchen knife set.',
            'price': 129.99,
            'stock': 30,
        },
        {
            'category': electronics,
            'name': 'Smart Watch',
            'slug': 'smart-watch',
            'description': 'Track your fitness and stay connected.',
            'price': 249.99,
            'stock': 45,
        },
        {
            'category': clothing,
            'name': 'Running Shoes',
            'slug': 'running-shoes',
            'description': 'Comfortable shoes for running and training.',
            'price': 79.99,
            'stock': 80,
        },
        {
            'category': books,
            'name': 'Cooking Recipes',
            'slug': 'cooking-recipes',
            'description': 'A comprehensive guide to cooking delicious meals.',
            'price': 19.99,
            'stock': 90,
        },
    ]
    
    created_count = 0
    
    for product_data in products:
        product, created = Product.objects.get_or_create(
            slug=product_data['slug'],
            defaults={
                'category': product_data['category'],
                'name': product_data['name'],
                'description': product_data['description'],
                'price': product_data['price'],
                'stock': product_data['stock'],
            }
        )
        
        if created:
            created_count += 1
    
    print(f"Created {created_count} products")

if __name__ == '__main__':
    create_sample_data()