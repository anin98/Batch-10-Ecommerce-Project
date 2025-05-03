# Update your store/urls.py file - uncomment the cart router registration

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, ProductViewSet, CartViewSet, OrderViewSet,
    RegisterView, CustomTokenObtainPairView, current_user
)
from rest_framework_simplejwt.views import TokenRefreshView

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')  # Uncomment this line
router.register(r'orders', OrderViewSet, basename='order')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', current_user, name='current_user'),
]