from django.urls import path
from .views import MyView
from .views import UserRegistrationView, UserLoginView, GetProfileDetails
urlpatterns = [
    path('myview/', MyView.as_view(), name='myview'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('get/profile/id/', GetProfileDetails.as_view(), name='user-profile'),
]
