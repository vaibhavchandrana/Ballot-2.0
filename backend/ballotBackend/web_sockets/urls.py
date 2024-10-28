from django.urls import path
from .views import ElectionResultsConsumer 

websocket_urlpatterns = [
    path('ws/get_result/election/<int:election_id>/', ElectionResultsConsumer.as_asgi()),
]
