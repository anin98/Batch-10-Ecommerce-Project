from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, CartItem, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'image', 'stock', 'available', 'category', 'category_name'
        ]

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price']
        
    def create(self, validated_data):
        user = self.context['request'].user
        product_id = validated_data.pop('product_id')
        product = Product.objects.get(id=product_id)
        
        # Check if item already exists in cart
        try:
            cart_item = CartItem.objects.get(user=user, product=product)
            cart_item.quantity += validated_data.get('quantity', 1)
            cart_item.save()
        except CartItem.DoesNotExist:
            cart_item = CartItem.objects.create(
                user=user,
                product=product,
                **validated_data
            )
        
        return cart_item

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'email', 'address', 'city',
            'postal_code', 'created', 'status', 'total_price', 'items'
        ]
        read_only_fields = ['created', 'status', 'total_price']  # Make total_price read-only
        
    def create(self, validated_data):
        user = self.context['request'].user
        
        # Calculate total from cart
        cart_items = CartItem.objects.filter(user=user)
        if not cart_items.exists():
            raise serializers.ValidationError("Your cart is empty")
        
        total_price = sum(item.total_price for item in cart_items)
        
        # Create order with calculated total_price
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            **validated_data
        )
        
        # Create order items
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                price=cart_item.product.price,
                quantity=cart_item.quantity
            )
        
        # Clear cart
        cart_items.delete()
        
        return order

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user