from rest_framework import serializers
from django.db import transaction
from .models import Akun, JurnalUmum, JurnalDetail
from decimal import Decimal

class AkunSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    saldo = serializers.SerializerMethodField()

    class Meta:
        model = Akun
        fields = [
            'kode_akun', 'nama_akun', 'tipe_akun', 'parent', 
            'saldo', 'saldo_awal', 'tanggal_saldo_awal', 'children'
        ]

    def get_children(self, obj):
        return AkunSerializer(obj.children.all(), many=True).data

    def get_saldo(self, obj):
        return obj.get_saldo_akumulasi

class JurnalDetailSerializer(serializers.ModelSerializer):
    akun_display = serializers.StringRelatedField(source='akun', read_only=True)
    class Meta:
        model = JurnalDetail
        fields = ['akun', 'akun_display', 'debit', 'kredit']

class JurnalUmumSerializer(serializers.ModelSerializer):
    details = JurnalDetailSerializer(many=True)

    class Meta:
        model = JurnalUmum
        fields = ['id', 'nomor_transaksi', 'tanggal', 'deskripsi', 'details']
        read_only_fields = ['nomor_transaksi']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        jurnal = JurnalUmum.objects.create(**validated_data)
        for detail_data in details_data:
            JurnalDetail.objects.create(jurnal=jurnal, **detail_data)
        return jurnal
    
    @transaction.atomic
    def update(self, instance, validated_data):
        instance.details.all().delete()

        details_data = validated_data.get('details')
        for detail_data in details_data:
            JurnalDetail.objects.create(jurnal=instance, **detail_data)

        instance.tanggal = validated_data.get('tanggal', instance.tanggal)
        instance.deskripsi = validated_data.get('deskripsi', instance.deskripsi)
        instance.save()
        
        return instance

    def validate(self, data):
        if not data.get('details'):
            raise serializers.ValidationError("Detail jurnal tidak boleh kosong.")
            
        total_debit = sum(d.get('debit', Decimal('0')) for d in data['details'])
        total_kredit = sum(d.get('kredit', Decimal('0')) for d in data['details'])
        
        if total_debit != total_kredit:
            raise serializers.ValidationError("Total Debit dan Kredit harus seimbang.")
        return data


    def validate(self, data):
        if not data.get('details'):
            raise serializers.ValidationError("Detail jurnal tidak boleh kosong.")
            
        total_debit = sum(d.get('debit', Decimal('0')) for d in data['details'])
        total_kredit = sum(d.get('kredit', Decimal('0')) for d in data['details'])
        
        if total_debit != total_kredit:
            raise serializers.ValidationError("Total Debit dan Kredit harus seimbang.")
        return data

class AkunListSerializer(serializers.ModelSerializer):
    """
    Serializer sederhana untuk menampilkan daftar flat semua akun,
    digunakan untuk dropdown di form.
    """
    class Meta:
        model = Akun
        fields = ['kode_akun', 'nama_akun']

