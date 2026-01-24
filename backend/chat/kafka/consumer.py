from confluent_kafka import Consumer
import json

consumer = Consumer({
    "bootstrap.servers": "kafka:9092",
    "group.id": "chat-consumers",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False
})

consumer.subscribe(["chat_messages"])
