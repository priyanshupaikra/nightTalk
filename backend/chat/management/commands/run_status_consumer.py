from django.core.management.base import BaseCommand
from chat.kafka.status_consumer import start_status_consumer

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        start_status_consumer()
