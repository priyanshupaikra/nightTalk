from confluent_kafka import Producer
import json

producer = Producer({"bootstrap.servers": "kafka:9092"})

def send_message(chat_id, payload):
    producer.produce(
        topic="chat_messages",
        key=str(chat_id),
        value=json.dumps(payload)
    )
    producer.flush()
