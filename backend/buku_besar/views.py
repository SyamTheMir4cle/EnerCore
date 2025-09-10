from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Akun, JurnalUmum
from .serializers import AkunSerializer, JurnalUmumSerializer, AkunListSerializer

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

    @action(detail=False, methods=['get'])
    def list_all(self, request):
        """
        Custom endpoint to return a flat list of all accounts for form dropdowns.
        """
        queryset = Akun.objects.all().order_by('kode_akun')
        serializer = AkunListSerializer(queryset, many=True)
        return Response(serializer.data)


class JurnalUmumViewSet(viewsets.ModelViewSet):
    """
    API endpoint untuk membuat dan melihat Jurnal Umum.
    """
    queryset = JurnalUmum.objects.all().order_by('-tanggal')
    serializer_class = JurnalUmumSerializer
