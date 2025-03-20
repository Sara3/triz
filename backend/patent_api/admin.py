from django.contrib import admin
from .models import TrizPrinciple, EngineeringParameter, ContradictionMatrix, Patent, PatentAnalysis, PatentCitation

@admin.register(TrizPrinciple)
class TrizPrincipleAdmin(admin.ModelAdmin):
    list_display = ('number', 'name')
    search_fields = ('name', 'description')
    ordering = ('number',)

@admin.register(EngineeringParameter)
class EngineeringParameterAdmin(admin.ModelAdmin):
    list_display = ('number', 'name')
    search_fields = ('name', 'description')
    ordering = ('number',)

@admin.register(ContradictionMatrix)
class ContradictionMatrixAdmin(admin.ModelAdmin):
    list_display = ('improving_parameter', 'worsening_parameter')
    filter_horizontal = ('principles',)
    search_fields = ('improving_parameter__name', 'worsening_parameter__name')

@admin.register(Patent)
class PatentAdmin(admin.ModelAdmin):
    list_display = ('patent_number', 'title', 'filing_date', 'publication_date', 'assignee')
    search_fields = ('patent_number', 'title', 'abstract', 'inventors', 'assignee')
    list_filter = ('filing_date', 'publication_date')
    date_hierarchy = 'publication_date'

@admin.register(PatentAnalysis)
class PatentAnalysisAdmin(admin.ModelAdmin):
    list_display = ('patent', 'analysis_date')
    filter_horizontal = ('applied_principles',)
    search_fields = ('patent__patent_number', 'patent__title', 'notes')
    list_filter = ('analysis_date',)

@admin.register(PatentCitation)
class PatentCitationAdmin(admin.ModelAdmin):
    list_display = ('citing_patent', 'cited_patent', 'citation_type')
    search_fields = ('citing_patent__patent_number', 'cited_patent__patent_number')
    list_filter = ('citation_type',)
