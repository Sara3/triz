import React, { useState } from 'react';
import { ExternalLink, Clock, FileText, AlertTriangle, Check, Edit, Plus, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PatentAnalysis, Patent, TrizContradiction } from '@/lib/types';
import { formatDistance } from 'date-fns';
import { 
  getAllParameters, 
  getPrincipleDetailsByName, 
  getAllPrincipleNames,
  addCustomParameter,
  addCustomPrinciple
} from '@/lib/triz-utils';

interface AnalysisViewerProps {
  analysis: PatentAnalysis;
  patent?: Patent;
  onReviewComplete?: () => void;
}

const AnalysisViewer: React.FC<AnalysisViewerProps> = ({ 
  analysis, 
  patent,
  onReviewComplete 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [contradictions, setContradictions] = useState(
    analysis.extracted_data.contradictions
  );
  const [newParameter, setNewParameter] = useState('');
  const [newPrinciple, setNewPrinciple] = useState('');
  const [expandedPrinciples, setExpandedPrinciples] = useState<{[key: number]: boolean}>({});
  
  const formattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const timeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };
  
  const handleApproveAnalysis = () => {
    if (onReviewComplete) {
      onReviewComplete();
    }
  };

  // Get all engineering parameters for dropdowns
  const allParameters = getAllParameters();
  
  // Get all principle names for dropdown
  const allPrinciples = getAllPrincipleNames();
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset any changes when exiting edit mode without saving
      setContradictions(analysis.extracted_data.contradictions);
    }
  };
  
  // Handle saving changes
  const saveChanges = () => {
    // In a real app, this would send the updated data to the API
    // Here we'll just update the local state and show a toast
    analysis.extracted_data.contradictions = contradictions;
    setEditMode(false);
    toast.success("Changes saved successfully");
  };
  
  // Update a contradiction parameter
  const updateContradictionParameter = (
    index: number, 
    field: 'improving_parameter' | 'worsening_parameter', 
    value: string
  ) => {
    const updatedContradictions = [...contradictions];
    updatedContradictions[index].contradiction[field] = value;
    setContradictions(updatedContradictions);
  };
  
  // Update a contradiction's principles
  const updateContradictionPrinciples = (index: number, principles: string[]) => {
    const updatedContradictions = [...contradictions];
    updatedContradictions[index].suggested_principles = principles;
    setContradictions(updatedContradictions);
  };
  
  // Add a new principle to a contradiction
  const addPrincipleToContradiction = (index: number) => {
    if (!newPrinciple) return;
    
    const updatedContradictions = [...contradictions];
    
    // Check if principle already exists
    if (!updatedContradictions[index].suggested_principles.includes(newPrinciple)) {
      updatedContradictions[index].suggested_principles.push(newPrinciple);
      setContradictions(updatedContradictions);
      
      // If this is a new principle not in our list, add it
      if (!allPrinciples.includes(newPrinciple)) {
        addCustomPrinciple({
          name: newPrinciple,
          description: "Custom principle added by user",
          examples: []
        });
        toast.success(`Added new principle: ${newPrinciple}`);
      }
    } else {
      toast.error("This principle is already in the list");
    }
    
    setNewPrinciple('');
  };
  
  // Remove a principle from a contradiction
  const removePrincipleFromContradiction = (contradictionIndex: number, principleIndex: number) => {
    const updatedContradictions = [...contradictions];
    updatedContradictions[contradictionIndex].suggested_principles.splice(principleIndex, 1);
    setContradictions(updatedContradictions);
  };
  
  // Add a new contradiction
  const addContradiction = () => {
    if (!newParameter) return;
    
    // Check if parameter is already in our list, if not, add it
    if (!allParameters.includes(newParameter)) {
      addCustomParameter(newParameter);
    }
    
    const newContradiction = {
      contradiction: {
        improving_parameter: newParameter,
        worsening_parameter: allParameters[0]
      },
      suggested_principles: []
    };
    
    setContradictions([...contradictions, newContradiction]);
    setNewParameter('');
    toast.success("New contradiction added");
  };
  
  // Remove a contradiction
  const removeContradiction = (index: number) => {
    const updatedContradictions = [...contradictions];
    updatedContradictions.splice(index, 1);
    setContradictions(updatedContradictions);
    toast.success("Contradiction removed");
  };

  // Toggle principle details expansion
  const togglePrincipleDetails = (index: number) => {
    setExpandedPrinciples(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>TRIZ Analysis</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Generated {timeAgo(analysis.analysis_date)} - {formattedDate(analysis.analysis_date)}
                </span>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <Button size="sm" variant="outline" onClick={toggleEditMode}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Analysis
                </Button>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={toggleEditMode}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {patent && (
            <>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-lg mb-1">{patent.title}</h3>
                  <Badge variant="outline">{patent.patent_number}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {patent.abstract || 'No abstract available'}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Inventor:</span>
                    <span>{patent.inventor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Assignee:</span>
                    <span>{patent.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Filing Date:</span>
                    <span>{patent.filing_date}</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <h3 className="font-medium text-lg mb-4">TRIZ Contradictions</h3>
            
            <div className="mb-4">
              <p className="text-muted-foreground mb-2">
                Identified contradictions and suggested principles for resolution
              </p>
            </div>
            
            {contradictions.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">No contradictions found</p>
                  <p className="text-sm mt-1">
                    The analysis did not identify any TRIZ contradictions in this patent.
                    This could be due to insufficient information or the nature of the patent.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* List all contradictions with edit capabilities */}
                <div className="space-y-4">
                  {contradictions.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-end items-start mb-1">
                        {editMode && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeContradiction(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Improving Parameter</label>
                          {editMode ? (
                            <Select 
                              value={item.contradiction.improving_parameter}
                              onValueChange={(value) => updateContradictionParameter(index, 'improving_parameter', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select parameter" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {allParameters.map((param) => (
                                  <SelectItem key={param} value={param}>
                                    {param}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="p-2 border rounded bg-muted/30">
                              {item.contradiction.improving_parameter}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Worsening Parameter</label>
                          {editMode ? (
                            <Select 
                              value={item.contradiction.worsening_parameter}
                              onValueChange={(value) => updateContradictionParameter(index, 'worsening_parameter', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select parameter" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {allParameters.map((param) => (
                                  <SelectItem key={param} value={param}>
                                    {param}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="p-2 border rounded bg-muted/30">
                              {item.contradiction.worsening_parameter}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Suggested Principles</label>
                        <div className="space-y-2">
                          {item.suggested_principles.map((principle, pidx) => (
                            <div key={pidx} className="flex items-center gap-2">
                              {editMode ? (
                                <>
                                  <div className="flex-1 p-2 border rounded bg-accent/20">
                                    {principle}
                                  </div>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removePrincipleFromContradiction(index, pidx)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="p-2 border rounded bg-muted/30 w-full">
                                  {principle}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Add new principle to this contradiction */}
                          {editMode && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1">
                                <Select
                                  value={newPrinciple}
                                  onValueChange={setNewPrinciple}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a principle to add" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {allPrinciples.map((principle) => (
                                      <SelectItem key={principle} value={principle}>
                                        {principle}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => addPrincipleToContradiction(index)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Principle details section */}
                      {!editMode && item.suggested_principles.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="text-sm font-medium">Principle Details</h5>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => togglePrincipleDetails(index)}
                              className="h-7 px-2"
                            >
                              {expandedPrinciples[index] ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Show Details
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {expandedPrinciples[index] && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.suggested_principles.map((principle, pidx) => {
                                const details = getPrincipleDetailsByName(principle);
                                return details ? (
                                  <div key={pidx} className="p-3 bg-accent/30 rounded-md">
                                    <div className="flex items-center justify-between mb-1">
                                      <h6 className="font-medium">{principle}</h6>
                                      {details.id && (
                                        <Badge variant="outline" className="text-xs">
                                          Principle {details.id}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{details.description}</p>
                                    {details.examples?.length > 0 && (
                                      <div className="mt-2">
                                        <span className="text-xs">Example: </span>
                                        <span className="text-xs text-muted-foreground">{details.examples[0]}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Add new contradiction */}
                {editMode && (
                  <div className="border border-dashed rounded-lg p-4">
                    <h4 className="font-medium mb-4">Add New Contradiction</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Select
                          value={newParameter}
                          onValueChange={setNewParameter}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select improving parameter" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {allParameters.map((param) => (
                              <SelectItem key={param} value={param}>
                                {param}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addContradiction}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contradiction
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t p-6">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Review Analysis</h3>
              {analysis.review_status === 'approved' && (
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
              )}
            </div>
            {analysis.review_status !== 'approved' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1" 
                  onClick={handleApproveAnalysis}
                >
                  <Check className="mr-2 h-4 w-4" /> 
                  Approve Analysis
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Add Review Notes
                </Button>
              </div>
            )}
            {analysis.user_feedback && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium mb-1">Review Notes:</p>
                <p>{analysis.user_feedback}</p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AnalysisViewer; 