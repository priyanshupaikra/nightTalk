import json
import time
from confluent_kafka import Consumer, KafkaException
from django.contrib.auth.models import User
from chat.models import Conversation, Message
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

KAFKA_CONF = {
    "bootstrap.servers": "localhost:9092",
    "group.id": "chat-consumer-group",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,
}

consumer = Consumer(KAFKA_CONF)
consumer.subscribe(["chat_messages"])

channel_layer = get_channel_layer()


def start_consumer():
    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue

        if msg.error():
            raise KafkaException(msg.error())

        try:
            payload = json.loads(msg.value().decode("utf-8"))

            message_id = payload["message_id"]
            conversation_id = payload["conversation_id"]
            sender_id = payload["sender_id"]
            content = payload["content"]

            # 🔒 Idempotency check
            if Message.objects.filter(id=message_id).exists():
                consumer.commit()
                continue

            conversation = Conversation.objects.get(id=conversation_id)
            sender = User.objects.get(id=sender_id)

            message = Message.objects.create(
                id=message_id,
                conversation=conversation,
                sender=sender,
                content=content,
            )

            # 📡 Push to WebSocket group
            async_to_sync(channel_layer.group_send)(
                f"chat_{conversation_id}",
                {
                    "type": "chat.message",
                    "message": {
                        "id": str(message.id),
                        "sender": sender.username,
                        "content": content,
                        "timestamp": message.created_at.isoformat(),
                    },
                },
            )

            # ✅ Commit offset only AFTER success
            consumer.commit()

        except Exception as e:
            print("Kafka consumer error:", e)
            time.sleep(2)  # retry delay
