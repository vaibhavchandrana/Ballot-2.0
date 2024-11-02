from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet
from .views import UserRegistrationView, UserLoginView, GetProfileDetails, ElectionAPIView, ElectionViaAdminAPIView, ElectionAdminAPIView, add_candidate, edit_candidate, candidates_by_election, delete_candidate, check_password_for_election, AddVoteView, register_admin, AdminLoginView
router = DefaultRouter()
router.register(r'admins', AdminViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('get/profile/id/', GetProfileDetails.as_view(), name='user-profile'),
    path('create/election/', ElectionAPIView.as_view(), name='create-election'),
    path('elections/<int:election_id>/', ElectionAPIView.as_view(),
         name='election-detail'),
    path('elections/admin/<int:election_id>/', ElectionAdminAPIView.as_view(),
         name='election-detail'),
    path('get/elections/admin/<int:admin_id>', ElectionViaAdminAPIView.as_view(),
         name='election-detail'),
#     path('detect_face/', detect_face),
    path('candidates/add/', add_candidate, name='add_candidate'),
    path('candidates/edit/<int:pk>/', edit_candidate, name='edit_candidate'),
    path('candidates/delete/<int:pk>/',
         delete_candidate, name='delete_candidate'),
    path('candidates/election/<int:election_id>/',
         candidates_by_election, name='candidates_by_election'),
    path('add_vote/election', AddVoteView.as_view(), name='add_vote'),
    path('check/password/election', check_password_for_election, name='add_vote'),
    path('admin/register/', register_admin, name='register_admin'),
    path('admin/login/', AdminLoginView.as_view(), name='login_admin'),
    path('elections/<int:election_id>/update/', ElectionAPIView.as_view(), name='update-election'),
]
