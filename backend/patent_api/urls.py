from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrizPrincipleViewSet,
    EngineeringParameterViewSet,
    ContradictionMatrixViewSet,
    PatentViewSet,
    PatentAnalysisViewSet,
    PatentCitationViewSet,
    health_check
)

router = DefaultRouter()
router.register(r'triz/principles', TrizPrincipleViewSet)
router.register(r'triz/parameters', EngineeringParameterViewSet)
router.register(r'triz/matrix', ContradictionMatrixViewSet)
router.register(r'patents', PatentViewSet)
router.register(r'analyses', PatentAnalysisViewSet)
router.register(r'citations', PatentCitationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health_check'),
    path('analyze-patent/', PatentViewSet.as_view({'post': 'analyze'}), name='analyze_patent'),
] 