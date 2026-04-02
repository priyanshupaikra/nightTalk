from confluent_kafka import Producer
import uuid
import json

KAFKA_CONF = {
    "bootstrap.servers": "localhost:9092",  # docker exposed port
}

producer = Producer(KAFKA_CONF)


def send_chat_message(conversation_id, sender_id, content):
    message_id = str(uuid.uuid4())

    payload = {
        "message_id": message_id,
        "conversation_id": conversation_id,
        "sender_id": sender_id,
        "content": content,
    }

    producer.produce(
        topic="chat_messages",
        key=str(conversation_id),  # ordering guarantee
        value=json.dumps(payload).encode("utf-8"),
    )

    producer.flush()
    return message_id

def send_message_status(message_id, user_id, status):
    payload = {
        "message_id": message_id,
        "user_id": user_id,
        "status": status,
    }

    producer.produce(
        topic="message_status",
        key=str(message_id),
        value=json.dumps(payload).encode("utf-8"),
    )

    producer.flush()


# producer = Producer({"bootstrap.servers": "kafka:9092"})
# def send_message(chat_id, payload):
#     producer.produce(
#         topic="chat_messages",
#         key=str(chat_id),
#         value=json.dumps(payload)
#     )
#     producer.flush()
