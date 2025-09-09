from rest_framework import viewsets
from .models import Akun
from .serializers import AkunSerializer

class AkunViewSet(viewsets.ModelViewSet):
    """
    API endpoint yang memungkinkan akun untuk dilihat atau diubah.
    """
    serializer_class = AkunSerializer
    
    # Kunci penting: Saat menampilkan daftar semua akun,
    # kita hanya ingin menampilkan akun level teratas (yang tidak punya induk).
    # Serializer rekursif akan menangani sisanya (menampilkan anak-anaknya).
    def get_queryset(self):
        return Akun.objects.filter(parent__isnull=True)