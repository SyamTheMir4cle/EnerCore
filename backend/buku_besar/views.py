# buku_besar/views.py
from rest_framework import viewsets
from .models import Akun
from .serializers import AkunSerializer

class AkunViewSet(viewsets.ModelViewSet):
    """
    API endpoint yang memungkinkan akun untuk dilihat atau diubah.
    """
    serializer_class = AkunSerializer
    queryset = Akun.objects.all()

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(parent__isnull=True)
        return super().get_queryset()

    def perform_create(self, serializer):
        # Saat membuat akun baru, saldo awal langsung menjadi saldo utama.
        instance = serializer.save()
        instance.saldo = instance.saldo_awal
        instance.save()

    def perform_update(self, serializer):
        # Simpan perubahan dari form terlebih dahulu.
        instance = serializer.save()
        instance.saldo = instance.saldo_awal
        instance.save()

