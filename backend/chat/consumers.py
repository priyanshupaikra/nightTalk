import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from chat.kafka.producer import send_chat_message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.group_name = f"chat_{self.conversation_id}"

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        content = data.get("content")
        sender_id = data.get("sender_id")

        # Send message to Kafka
        send_chat_message(
            conversation_id=self.conversation_id,
            sender_id=sender_id,
            content=content,
        )

    async def chat_message(self, event):
        # Receive message from Kafka consumer via channel layer
        await self.send(text_data=json.dumps(event["message"]))
