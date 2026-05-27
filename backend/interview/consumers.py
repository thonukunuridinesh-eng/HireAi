import json
from channels.generic.websocket import AsyncWebsocketConsumer

class InterviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Triggers instantly when the frontend opens a socket pipe connection stream.
        """
        print("🔌 [WebSocket Connect] Live interview room stream handshaking...")
        await self.accept()
        
        # Send a direct greeting package back to the client immediately after connection
        await self.send(text_data=json.dumps({
            'message': 'Connected to HireAI Live Interview Network Room!'
        }))

    async def disconnect(self, close_code):
        """
        Triggers when the candidate exits the view or closes the browser tab.
        """
        print(f"❌ [WebSocket Disconnect] Connection dropped. Code: {close_code}")

    async def receive(self, text_data):
        """
        Listens for incoming messages sent from the React frontend.
        """
        data = json.loads(text_data)
        user_message = data.get('message', '')
        print(f"📩 [WebSocket Message Received]: {user_message}")

        # Real-time echoing response payload processing simulation echo loop
        response_text = f"HireAI Core System Echo Processing Validation: {user_message}"
        
        await self.send(text_data=json.dumps({
            'message': response_text
        }))
