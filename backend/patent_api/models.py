from django.db import models

# Create your models here.

class TrizPrinciple(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    examples = models.TextField()

    def __str__(self):
        return f"{self.number}. {self.name}"

class EngineeringParameter(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return f"{self.number}. {self.name}"

class ContradictionMatrix(models.Model):
    improving_parameter = models.ForeignKey(EngineeringParameter, on_delete=models.CASCADE, related_name='improving_contradictions')
    worsening_parameter = models.ForeignKey(EngineeringParameter, on_delete=models.CASCADE, related_name='worsening_contradictions')
    principles = models.ManyToManyField(TrizPrinciple)

    class Meta:
        unique_together = ('improving_parameter', 'worsening_parameter')

    def __str__(self):
        return f"{self.improving_parameter.name} vs {self.worsening_parameter.name}"

class Patent(models.Model):
    patent_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=500)
    abstract = models.TextField()
    filing_date = models.DateField()
    publication_date = models.DateField()
    inventors = models.TextField()  # Stored as comma-separated values
    assignee = models.CharField(max_length=500)
    pdf_file = models.URLField(max_length=500, null=True, blank=True, 
                              help_text="URL to the patent PDF file in storage")
    pdf_file_name = models.CharField(max_length=255, null=True, blank=True,
                                   help_text="Original filename of the uploaded PDF")
    upload_date = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return f"{self.patent_number} - {self.title}"

class PatentAnalysis(models.Model):
    patent = models.ForeignKey(Patent, on_delete=models.CASCADE, related_name='analyses')
    improving_parameter = models.ForeignKey(EngineeringParameter, on_delete=models.CASCADE, related_name='patent_improvements')
    worsening_parameter = models.ForeignKey(EngineeringParameter, on_delete=models.CASCADE, related_name='patent_worsenings')
    applied_principles = models.ManyToManyField(TrizPrinciple, related_name='patent_applications')
    analysis_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Analysis of {self.patent.patent_number}"

class PatentCitation(models.Model):
    citing_patent = models.ForeignKey(Patent, on_delete=models.CASCADE, related_name='citations_made')
    cited_patent = models.ForeignKey(Patent, on_delete=models.CASCADE, related_name='citations_received')
    citation_type = models.CharField(max_length=50)  # e.g., 'forward', 'backward'
    
    class Meta:
        unique_together = ('citing_patent', 'cited_patent')

    def __str__(self):
        return f"{self.citing_patent.patent_number} cites {self.cited_patent.patent_number}"
