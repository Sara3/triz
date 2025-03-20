from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import TrizPrinciple, EngineeringParameter, ContradictionMatrix, Patent, PatentAnalysis, PatentCitation
from .serializers import (
    TrizPrincipleSerializer,
    EngineeringParameterSerializer,
    ContradictionMatrixSerializer,
    PatentSerializer,
    PatentAnalysisSerializer,
    PatentCitationSerializer
)
from django.http import JsonResponse
import json
from datetime import datetime
import random

# Health check endpoint
def health_check(request):
    return JsonResponse({"status": "ok", "message": "Patent Analytics Hub API is running"})

# Create your views here.

class TrizPrincipleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows TRIZ principles to be viewed.
    """
    queryset = TrizPrinciple.objects.all().order_by('number')
    serializer_class = TrizPrincipleSerializer

class EngineeringParameterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows engineering parameters to be viewed.
    """
    queryset = EngineeringParameter.objects.all().order_by('number')
    serializer_class = EngineeringParameterSerializer

class ContradictionMatrixViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contradiction matrix to be viewed.
    """
    queryset = ContradictionMatrix.objects.all()
    serializer_class = ContradictionMatrixSerializer

    @action(detail=False, methods=['get'])
    def get_principles(self, request):
        improving = request.query_params.get('improving')
        worsening = request.query_params.get('worsening')
        
        if not improving or not worsening:
            return Response(
                {"error": "Both improving and worsening parameters are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        contradiction = get_object_or_404(
            ContradictionMatrix,
            improving_parameter__number=improving,
            worsening_parameter__number=worsening
        )
        
        serializer = self.get_serializer(contradiction)
        return Response(serializer.data)

class PatentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows patents to be viewed or edited.
    """
    queryset = Patent.objects.all()
    serializer_class = PatentSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        """
        Create a new patent with support for both JSON and form data.
        This method handles both direct uploads and CDN URL uploads.
        """
        # Handle JSON data (CDN URL approach)
        if request.content_type == 'application/json':
            return self._create_with_json(request)
        
        # Handle multipart form data (file upload)
        elif 'multipart/form-data' in request.content_type:
            return self._create_with_form_data(request)
        
        return Response(
            {"error": "Unsupported content type"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def _create_with_json(self, request):
        """Handle creation with JSON data (for CDN URLs)"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _create_with_form_data(self, request):
        """Handle creation with form data and possible file upload"""
        # Check if we have a file URL in the form
        if 'pdf_file' in request.data:
            # Just use the URL directly if it's provided
            data = {key: request.data[key] for key in request.data if key != 'analysis'}
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                patent = serializer.save()
                
                # Process analysis data if provided
                if 'analysis' in request.data:
                    try:
                        analysis_data = json.loads(request.data['analysis'])
                        self._process_analysis(patent, analysis_data)
                    except json.JSONDecodeError:
                        pass  # Silently ignore invalid JSON
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # We don't have a URL - check for a file
        elif 'file' in request.FILES:
            # For our mocked implementation, just generate a URL
            # In a real system, you would upload the file to a CDN/storage service
            filename = request.FILES['file'].name
            mock_url = self._generate_mock_cdn_url(filename)
            
            # Prepare the data with the mock URL
            data = {key: request.data[key] for key in request.data if key != 'file' and key != 'analysis'}
            data['pdf_file'] = mock_url
            data['pdf_file_name'] = filename
            
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                patent = serializer.save()
                
                # Process analysis data if provided
                if 'analysis' in request.data:
                    try:
                        analysis_data = json.loads(request.data['analysis'])
                        self._process_analysis(patent, analysis_data)
                    except json.JSONDecodeError:
                        pass  # Silently ignore invalid JSON
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            {"error": "No file or file URL provided"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def _generate_mock_cdn_url(self, filename):
        """Generate a mock CDN URL for testing"""
        timestamp = int(datetime.now().timestamp())
        return f"https://mock-cdn.example.com/patents/{timestamp}-{filename}"
    
    def _process_analysis(self, patent, analysis_data):
        """Process and store analysis data"""
        # In a real implementation, this would create PatentAnalysis objects
        # For now, we'll just print what we received
        print(f"Processing analysis for patent {patent.id}:")
        print(f"Analysis data: {analysis_data}")
        # This is where you would create the actual analysis records

    @action(detail=True, methods=['get'])
    def analyses(self, request, pk=None):
        patent = self.get_object()
        analyses = PatentAnalysis.objects.filter(patent=patent)
        serializer = PatentAnalysisSerializer(analyses, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def citations(self, request, pk=None):
        patent = self.get_object()
        citations = PatentCitation.objects.filter(citing_patent=patent)
        serializer = PatentCitationSerializer(citations, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['post'])
    def analyze(self, request):
        """
        Analyze a patent PDF and extract TRIZ contradictions.
        This is a mock implementation that returns random contradictions.
        """
        # Mock implementation for testing
        # In a real system, this would use a language model to analyze the patent
        
        # Check if we have a file URL
        file_url = request.data.get('file_url')
        
        # Or if we have a direct file upload
        if not file_url and 'file' in request.FILES:
            # Generate a mock URL for the uploaded file
            filename = request.FILES['file'].name
            file_url = self._generate_mock_cdn_url(filename)
        
        if not file_url:
            return Response(
                {"error": "No file or file URL provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Mock response with random contradictions
        improving_params = ["Speed", "Reliability", "Accuracy", "Strength", "Power"]
        worsening_params = ["Weight", "Complexity", "Cost", "Size", "Energy consumption"]
        principles = [
            "Segmentation", "Asymmetry", "Merging", "Nested doll", 
            "Feedback", "Intermediary", "Dynamicity", "Mechanical vibration",
            "Preliminary action", "Composite materials", "Counterweight"
        ]
        
        contradictions = []
        num_contradictions = random.randint(1, 3)
        
        for _ in range(num_contradictions):
            improving = random.choice(improving_params)
            worsening = random.choice(worsening_params)
            
            # Make sure they're different
            while improving == worsening:
                worsening = random.choice(worsening_params)
                
            # Select 1-4 random principles
            num_principles = random.randint(1, 4)
            selected_principles = random.sample(principles, num_principles)
            
            contradictions.append({
                "contradiction": {
                    "improving_parameter": improving,
                    "worsening_parameter": worsening
                },
                "suggested_principles": selected_principles
            })
            
        # Create a mock response with the file URL
        response_data = {
            "fileUrl": file_url,
            "contradictions": contradictions,
            "metadata": {
                "title": f"Patent {datetime.now().strftime('%Y%m%d%H%M%S')}",
                "abstract": "This patent describes an innovative solution using TRIZ principles.",
                "inventors": "John Smith, Jane Doe",
                "assignee": "Tech Innovations Inc.",
                "patent_number": f"US{random.randint(10000000, 99999999)}"
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

class PatentAnalysisViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows patent analyses to be viewed or edited.
    """
    queryset = PatentAnalysis.objects.all()
    serializer_class = PatentAnalysisSerializer

class PatentCitationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows patent citations to be viewed or edited.
    """
    queryset = PatentCitation.objects.all()
    serializer_class = PatentCitationSerializer
