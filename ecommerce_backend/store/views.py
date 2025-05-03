from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Category, Product, CartItem, Order
from .serializers import (
    CategorySerializer, ProductSerializer, CartItemSerializer,
    OrderSerializer, UserSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


# Update the ProductViewSet class to explicitly allow public access
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]  # Explicitly allow anyone to access products
    
    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        search_query = self.request.query_params.get('search')
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query)
            )
        
        return queryset
    
    @action(detail=False)
    def featured(self, request):
        """Return featured products (latest 4)"""
        featured = self.get_queryset().order_by('-created')[:4]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)


# Also update CategoryViewSet to be explicitly public
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]  # Explicitly allow anyone to access categories

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}
    
# Add this CartViewSet class to your existing views.py file

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from cart"""
        cart_items = self.get_queryset()
        cart_items.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        """Get cart total"""
        cart_items = self.get_queryset()
        total = sum(item.total_price for item in cart_items)
        return Response({
            'total': str(total),
            'count': cart_items.count()
        })
    
    @action(detail=True, methods=['patch'])
    def update_quantity(self, request, pk=None):
        """Update item quantity"""
        cart_item = self.get_object()
        quantity = request.data.get('quantity', 1)
        
        if quantity <= 0:
            cart_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        cart_item.quantity = quantity
        cart_item.save()
        serializer = self.get_serializer(cart_item)
        return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# For JWT token auth
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view that returns user info"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            from django.contrib.auth.models import User
            user = User.objects.get(username=request.data['username'])
            user_data = UserSerializer(user).data
            response.data['user'] = user_data
            
        return response


# Add a view for current user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get details of the currently authenticated user
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)