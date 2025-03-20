import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Check, X, Edit, Eye, EyeOff,
  AlertTriangle, FileText, Clock, CheckCircle 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getPrincipleByName } from '@/lib/mock-data';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Mock data for patent review
const getPatentById = (id: string) => {
  // Mock patent data
  return {
    id: '1',
    patent_number: 'US10123456B2',
    filename: 'medical_device_patent.pdf',
    title: 'Smart Medical Device for Patient Monitoring',
    filing_date: '2019-05-12',
    upload_date: '2023-06-15',
    raw_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    abstract: 'A smart medical device for monitoring patient vital signs with improved accuracy and reduced power consumption.',
    inventor: 'John Smith, Jane Doe',
    assignee: 'MedTech Innovations, Inc.',
    is_prior_art: false,
    is_competitor: true,
    keywords: 'patient monitoring, vital signs, low power, wireless',
    status: 'analyzed'
  };
};

const getPatentAnalysisById = (id: string) => {
  // Mock analysis data
  return {
    id: '1',
    patent_id: '1',
    extracted_data: {
      contradictions: [
        {
          contradiction: {
            improving_parameter: 'Accuracy of measurement',
            worsening_parameter: 'Power consumption'
          },
          suggested_principles: ['Segmentation', 'Intermediary', 'Periodic action']
        },
        {
          contradiction: {
            improving_parameter: 'Device complexity',
            worsening_parameter: 'Ease of manufacture'
          },
          suggested_principles: ['Nesting', 'Preliminary action', 'Universality']
        }
      ]
    },
    confidence_score: 0.87,
    review_status: 'approved',
    extraction_version: '1.0',
    analysis_date: '2023-06-16',
    feedback_date: '2023-06-18',
    user_feedback: 'Extraction is accurate. Added additional context to the second contradiction.'
  };
};

const PatentReviewDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const patent = getPatentById(id || '');
  const analysis = getPatentAnalysisById(id || '');
  
  const [editMode, setEditMode] = useState(false);
  const [editedContradictions, setEditedContradictions] = useState(
    analysis?.extracted_data.contradictions || []
  );
  
  if (!patent || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Patent Not Found</h2>
        <p className="text-muted-foreground mb-4">The patent you're looking for doesn't exist or hasn't been analyzed.</p>
        <Button asChild>
          <Link to="/admin/review">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Review List
          </Link>
        </Button>
      </div>
    );
  }
  
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          icon: <Clock className="h-4 w-4" />,
          label: 'Processing',
        };
      case 'analyzed':
        return {
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          icon: <FileText className="h-4 w-4" />,
          label: 'Analysis Complete',
        };
      case 'reviewed':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Reviewed',
        };
      case 'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Error',
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          icon: <FileText className="h-4 w-4" />,
          label: 'Unknown',
        };
    }
  };
  
  const statusDetails = getStatusDetails(patent.status);
  
  const handleSaveContradictions = () => {
    // In a real app, this would send the data to the server
    toast({
      title: "Contradictions updated",
      description: "Your changes have been saved successfully",
      variant: "default",
    });
    setEditMode(false);
  };
  
  const updateContradiction = (index: number, field: string, value: string) => {
    const updated = [...editedContradictions];
    if (field === 'improving_parameter' || field === 'worsening_parameter') {
      updated[index].contradiction[field] = value;
    } else if (field === 'principles') {
      updated[index].suggested_principles = value.split(',').map(p => p.trim());
    }
    setEditedContradictions(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/review">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Review List
            </Link>
          </Button>
          <Badge 
            variant="outline"
            className={cn(
              "ml-2",
              patent.status === 'processing' && "bg-blue-50 text-blue-700",
              patent.status === 'analyzed' && "bg-amber-50 text-amber-700",
              patent.status === 'reviewed' && "bg-green-50 text-green-700",
              patent.status === 'error' && "bg-red-50 text-red-700",
            )}
          >
            {statusDetails.icon}
            <span className="ml-1">{statusDetails.label}</span>
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit Contradictions
            </Button>
          ) : (
            <>
              <Button onClick={() => setEditMode(false)} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveContradictions} size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{patent.title}</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2 text-sm text-muted-foreground">
          <p><span className="font-medium">Patent #:</span> {patent.patent_number}</p>
          <p><span className="font-medium">Filed:</span> {new Date(patent.filing_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Inventors:</span> {patent.inventor}</p>
          <p><span className="font-medium">Assignee:</span> {patent.assignee}</p>
        </div>
      </div>
      
      <Tabs defaultValue="contradictions">
        <TabsList>
          <TabsTrigger value="contradictions">Contradictions</TabsTrigger>
          <TabsTrigger value="patent">Patent Text</TabsTrigger>
          <TabsTrigger value="matrix">TRIZ Matrix</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contradictions" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Extracted Contradictions</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">Confidence Score:</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded overflow-hidden">
                      <div 
                        className={cn(
                          "h-full",
                          analysis.confidence_score >= 0.8 ? "bg-green-500" :
                          analysis.confidence_score >= 0.6 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${analysis.confidence_score * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{(analysis.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editedContradictions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No contradictions have been extracted for this patent.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {editedContradictions.map((contradiction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Improving Parameter</label>
                          {editMode ? (
                            <Input 
                              value={contradiction.contradiction.improving_parameter}
                              onChange={(e) => updateContradiction(index, 'improving_parameter', e.target.value)}
                            />
                          ) : (
                            <div className="p-2 border rounded bg-muted/30">
                              {contradiction.contradiction.improving_parameter}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Worsening Parameter</label>
                          {editMode ? (
                            <Input 
                              value={contradiction.contradiction.worsening_parameter}
                              onChange={(e) => updateContradiction(index, 'worsening_parameter', e.target.value)}
                            />
                          ) : (
                            <div className="p-2 border rounded bg-muted/30">
                              {contradiction.contradiction.worsening_parameter}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Suggested Principles</label>
                        {editMode ? (
                          <Input 
                            value={contradiction.suggested_principles.join(', ')}
                            onChange={(e) => updateContradiction(index, 'principles', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 border rounded bg-muted/30">
                            <div className="flex flex-wrap gap-2">
                              {contradiction.suggested_principles.map((principle, i) => {
                                const principleData = getPrincipleByName(principle);
                                return (
                                  <Badge key={i} variant="secondary" className="bg-primary/10">
                                    {principle}
                                    {principleData && <span className="ml-1 opacity-60">({principleData.id})</span>}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!editMode && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Principle Details</label>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              Show Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Admin Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add your feedback about the extracted contradictions..."
                className="min-h-[100px]"
                value={analysis.user_feedback || ''}
                readOnly={!editMode}
              />
              {editMode && (
                <Button className="mt-4">Save Feedback</Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patent">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patent Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{patent.abstract}</p>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Full Patent Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto p-4 border rounded bg-muted/30">
                <p className="whitespace-pre-line">{patent.raw_text || "Full text not available."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">TRIZ Matrix View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Matrix Position</h3>
                {editedContradictions.length > 0 ? (
                  <div className="space-y-4">
                    {editedContradictions.map((contradiction, index) => (
                      <div key={index} className="p-3 border rounded bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex-1">
                            <span className="text-sm font-medium">Improving: </span>
                            <span className="text-sm">{contradiction.contradiction.improving_parameter}</span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium">Worsening: </span>
                            <span className="text-sm">{contradiction.contradiction.worsening_parameter}</span>
                          </div>
                          <Button variant="outline" size="sm">View in Matrix</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No contradictions available to display in the matrix.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Suggested TRIZ Principles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {editedContradictions.length > 0 && editedContradictions[0].suggested_principles.map((principle, index) => {
                    const principleData = getPrincipleByName(principle);
                    return principleData ? (
                      <div key={index} className="border rounded p-3">
                        <h4 className="font-medium">{principleData.id}. {principleData.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{principleData.description}</p>
                        {principleData.examples.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">Example: </span>
                            <span className="text-xs">{principleData.examples[0]}</span>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatentReviewDetail;
