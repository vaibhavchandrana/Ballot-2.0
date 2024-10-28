from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
import json

class ElectionResultsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.election_id = self.scope['url_route']['kwargs']['election_id']
        self.election_group_name = f'election_{self.election_id}'

        # Get the channel layer
        self.channel_layer = get_channel_layer()

        # Check if the channel layer is available
        if self.channel_layer is not None:
            # Join election group
            await self.channel_layer.group_add(
                self.election_group_name,
                self.channel_name
            )

        await self.accept()

    async def disconnect(self, close_code):
        # Check if the channel layer is available
        if self.channel_layer is not None:
            # Leave election group
            await self.channel_layer.group_discard(
                self.election_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # Handle received message if necessary
        pass

    async def send_election_results(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['data']))
