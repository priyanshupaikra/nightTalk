from django.core.management.base import BaseCommand
from chat.kafka.consumer import start_consumer


class Command(BaseCommand):
    help = "Run Kafka chat consumer"

    def handle(self, *args, **options):
        self.stdout.write("Starting Kafka consumer...")
        start_consumer()
