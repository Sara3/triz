from rest_framework import serializers
from .models import TrizPrinciple, EngineeringParameter, ContradictionMatrix, Patent, PatentAnalysis, PatentCitation

class TrizPrincipleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrizPrinciple
        fields = ['id', 'number', 'name', 'description', 'examples']

class EngineeringParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngineeringParameter
        fields = ['id', 'number', 'name', 'description']

class ContradictionMatrixSerializer(serializers.ModelSerializer):
    principles = TrizPrincipleSerializer(many=True, read_only=True)
    improving_parameter = EngineeringParameterSerializer(read_only=True)
    worsening_parameter = EngineeringParameterSerializer(read_only=True)

    class Meta:
        model = ContradictionMatrix
        fields = ['id', 'improving_parameter', 'worsening_parameter', 'principles']

class PatentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patent
        fields = ['id', 'patent_number', 'title', 'abstract', 'filing_date', 
                 'publication_date', 'inventors', 'assignee', 'pdf_file', 
                 'pdf_file_name', 'upload_date']

class PatentAnalysisSerializer(serializers.ModelSerializer):
    patent = PatentSerializer(read_only=True)
    improving_parameter = EngineeringParameterSerializer(read_only=True)
    worsening_parameter = EngineeringParameterSerializer(read_only=True)
    applied_principles = TrizPrincipleSerializer(many=True, read_only=True)

    class Meta:
        model = PatentAnalysis
        fields = ['id', 'patent', 'improving_parameter', 'worsening_parameter',
                 'applied_principles', 'analysis_date', 'notes']

class PatentCitationSerializer(serializers.ModelSerializer):
    citing_patent = PatentSerializer(read_only=True)
    cited_patent = PatentSerializer(read_only=True)

    class Meta:
        model = PatentCitation
        fields = ['id', 'citing_patent', 'cited_patent', 'citation_type'] 