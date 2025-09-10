from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AkunViewSet, JurnalUmumViewSet


# Buat router dan daftarkan ViewSet kita
router = DefaultRouter()
router.register(r'akun', AkunViewSet, basename='akun')
router.register(r'jurnal', JurnalUmumViewSet, basename='jurnal')

# URL API akan ditentukan secara otomatis oleh router.
urlpatterns = [
    path('', include(router.urls)),
]