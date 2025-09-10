from django.apps import AppConfig


class BukuBesarConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'buku_besar'
    
    def ready(self):
        import buku_besar.signals