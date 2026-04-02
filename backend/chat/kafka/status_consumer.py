import json
from confluent_kafka import Consumer
from chat.models import Message, MessageStatus
from django.contrib.auth.models import User

consumer = Consumer({
    "bootstrap.servers": "kafka:9092",
    "group.id": "message-status-group",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
})

consumer.subscribe(["message_status"])


def start_status_consumer():
    while True:
        msg = consumer.poll(1.0)
        if msg is None:
            continue

        payload = json.loads(msg.value().decode())
        message = Message.objects.get(id=payload["message_id"])
        user = User.objects.get(id=payload["user_id"])

        MessageStatus.objects.update_or_create(
            message=message,
            user=user,
            defaults={"status": payload["status"]},
        )

        consumer.commit()
