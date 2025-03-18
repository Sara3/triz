
import React, { useState } from 'react';
import { FileText, Info, Check, Plus, Trash, Edit, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PatentUploader from '@/components/ui-custom/PatentUploader';
import { MOCK_PATENTS, TRIZ_PRINCIPLES } from '@/lib/mock-data';
import { 
  getAllParameters,
  COMMON_CONTRADICTIONS,
  getSuggestedPrinciples,
  getAllPrincipleNames,
  getPrincipleDetailsByName,
  addCustomParameter
} from '@/lib/triz-utils';
import { TrizContradiction } from '@/lib/types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrincipleSelector from '@/components/ui-custom/PrincipleSelector';
import { useNavigate } from 'react-router-dom';

const PatentUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [selectedPatent, setSelectedPatent] = useState<string | null>(null);
  const [isEditingContradiction, setIsEditingContradiction] = useState<number | null>(null);
  const [isAddingContradiction, setIsAddingContradiction] = useState(false);
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [newParameter, setNewParameter] = useState("");
  const [parametersRefreshKey, setParametersRefreshKey] = useState(0);
  
  const patentDetails = selectedPatent 
    ? MOCK_PATENTS.find(p => p.id === selectedPatent) 
    : null;
  
  const [mockContradictions, setMockContradictions] = useState([
    {
      contradiction: {
        improving_parameter: "Strength",
        worsening_parameter: "Weight of moving object"
      },
      suggested_principles: [
        "Segmentation",
        "Asymmetry",
        "Composite Materials"
      ]
    },
    {
      contradiction: {
        improving_parameter: "Reliability",
        worsening_parameter: "Complexity"
      },
      suggested_principles: [
        "Preliminary Action",
        "Nesting",
        "Feedback"
      ]
    }
  ]);

  const handleUploadComplete = (filename: string) => {
    setUploadedFilename(filename);
    toast.success(`Patent upload complete: ${filename}`);
    
    if (MOCK_PATENTS.length > 0) {
      setSelectedPatent(MOCK_PATENTS[0].id);
    }
  };

  const handleAnalysisComplete = (analysisId: string) => {
    navigate(`/admin/analysis/${analysisId}`);
  };

  const handleApproveAnalysis = () => {
    toast.success('Analysis approved and saved to database');
    setSelectedPatent(null);
    setUploadedFilename(null);
  };

  const handleSaveContradiction = (index: number, data: { 
    improving: string; 
    worsening: string;
    principles: string[];
  }) => {
    const principles = Array.isArray(data.principles) ? data.principles : [];
    
    const updatedContradictions = [...mockContradictions];
    updatedContradictions[index] = {
      contradiction: {
        improving_parameter: data.improving,
        worsening_parameter: data.worsening
      },
      suggested_principles: principles
    };
    
    setMockContradictions(updatedContradictions);
    setIsEditingContradiction(null);
    toast.success('Contradiction updated successfully');
  };

  const handleDeleteContradiction = (index: number) => {
    const updatedContradictions = mockContradictions.filter((_, i) => i !== index);
    setMockContradictions(updatedContradictions);
    toast.success('Contradiction removed');
  };

  const handleAddContradiction = (data: { 
    improving: string; 
    worsening: string;
    principles: string[];
  }) => {
    const principles = Array.isArray(data.principles) ? data.principles : [];
    
    const newContradiction = {
      contradiction: {
        improving_parameter: data.improving,
        worsening_parameter: data.worsening
      },
      suggested_principles: principles
    };
    
    setMockContradictions([...mockContradictions, newContradiction]);
    setIsAddingContradiction(false);
    toast.success('New contradiction added');
  };

  const handleAddParameter = () => {
    if (!newParameter.trim()) {
      toast.error("Parameter name cannot be empty");
      return;
    }
    
    // Add the parameter
    const updatedParameters = addCustomParameter(newParameter);
    
    // Reset form and close dialog
    setNewParameter("");
    setIsAddingParameter(false);
    setParametersRefreshKey(prev => prev + 1);
    
    toast.success(`New parameter "${newParameter}" added successfully!`);
  };

  const usedPrinciples = React.useMemo(() => {
    const allPrinciples = mockContradictions.flatMap(item => 
      Array.isArray(item.suggested_principles) ? item.suggested_principles : []
    );
    return Array.from(new Set(allPrinciples));
  }, [mockContradictions]);

  const allParameters = React.useMemo(() => {
    return getAllParameters();
  }, [parametersRefreshKey]);

  const ContradictionForm = ({ 
    onSubmit, 
    defaultValues,
    onCancel
  }: { 
    onSubmit: (data: { improving: string; worsening: string; principles: string[] }) => void; 
    defaultValues?: { improving: string; worsening: string; principles: string[] };
    onCancel: () => void;
  }) => {
    const form = useForm({
      defaultValues: defaultValues || { improving: '', worsening: '', principles: [] }
    });
    
    const [autoSuggestedPrinciples, setAutoSuggestedPrinciples] = useState<string[]>([]);
    
    React.useEffect(() => {
      const improving = form.watch('improving');
      const worsening = form.watch('worsening');
      
      if (improving && worsening) {
        const suggested = getSuggestedPrinciples(improving, worsening);
        setAutoSuggestedPrinciples(suggested || []);
        
        if ((!defaultValues?.principles || defaultValues.principles.length === 0) && suggested && suggested.length > 0) {
          form.setValue('principles', suggested);
        }
      }
    }, [form.watch('improving'), form.watch('worsening')]);

    const allPrincipleNames = getAllPrincipleNames();

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="improving"
              render={({ field }) => (
                <FormItem className="flex-1 mr-2">
                  <FormLabel>Improving Parameter</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parameter to improve" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allParameters.map((param) => (
                          <SelectItem key={param} value={param}>
                            {param}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setIsAddingParameter(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="worsening"
              render={({ field }) => (
                <FormItem className="flex-1 mr-2">
                  <FormLabel>Worsening Parameter</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parameter that worsens" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allParameters.map((param) => (
                          <SelectItem key={param} value={param}>
                            {param}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => setIsAddingParameter(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="principles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Suggested Principles
                  {autoSuggestedPrinciples && autoSuggestedPrinciples.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Auto-suggested from selected parameters)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <PrincipleSelector 
                    value={field.value || []} 
                    onChange={field.onChange}
                    maxSelections={6}
                    showAutoSuggestions={true}
                    autoSuggestedPrinciples={autoSuggestedPrinciples}
                    predefinedPrinciples={allPrincipleNames}
                    allowCustomPrinciples={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Patent Upload & Analysis</h1>
          <p className="text-muted-foreground">Upload patent documents and view TRIZ analysis results</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {!selectedPatent ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Upload Patents</CardTitle>
                    <CardDescription>
                      Upload patent PDF files for automated extraction and analysis
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    <Info className="h-3 w-3" />
                    <span>Accepts PDF format only</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PatentUploader 
                  onUploadComplete={handleUploadComplete} 
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </CardContent>
              <CardFooter className="bg-muted/20 border-t flex flex-col items-start p-6 space-y-3">
                <h3 className="font-medium text-sm">Upload Guidelines:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Upload patent documents in PDF format only.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Each PDF should contain a single patent document.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Scanned documents should be OCR'd for better extraction results.</span>
                  </li>
                </ul>
              </CardFooter>
            </Card>
            
            {uploadedFilename && (
              <Card className="bg-green-50 border-green-100 animate-fade-in">
                <CardContent className="p-6 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Upload Successful</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFilename} has been uploaded and analysis will appear shortly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : patentDetails ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>{patentDetails.title}</CardTitle>
                  <CardDescription>
                    Patent #{patentDetails.patent_number} • Uploaded on {new Date(patentDetails.upload_date).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Patent Abstract</h3>
                <p className="text-sm text-muted-foreground">
                  {patentDetails.abstract || 'No abstract available'}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">TRIZ Contradictions & Principles</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsAddingContradiction(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Contradiction
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Review and manage the contradictions identified in this patent.
                </p>
                
                {isAddingContradiction && (
                  <Card className="mb-6 border-dashed border-primary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Contradiction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ContradictionForm 
                        onSubmit={handleAddContradiction} 
                        onCancel={() => setIsAddingContradiction(false)}
                      />
                    </CardContent>
                  </Card>
                )}
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Improving Parameter</TableHead>
                        <TableHead className="w-1/3">Worsening Parameter</TableHead>
                        <TableHead className="w-1/4">Suggested Principles</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockContradictions.map((item, index) => (
                        <TableRow key={index}>
                          {isEditingContradiction === index ? (
                            <TableCell colSpan={4}>
                              <ContradictionForm 
                                defaultValues={{
                                  improving: item.contradiction.improving_parameter,
                                  worsening: item.contradiction.worsening_parameter,
                                  principles: Array.isArray(item.suggested_principles) ? item.suggested_principles : []
                                }}
                                onSubmit={(data) => handleSaveContradiction(index, data)}
                                onCancel={() => setIsEditingContradiction(null)}
                              />
                            </TableCell>
                          ) : (
                            <>
                              <TableCell>{item.contradiction.improving_parameter}</TableCell>
                              <TableCell>{item.contradiction.worsening_parameter}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(item.suggested_principles) && item.suggested_principles.slice(0, 2).map((principle, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {principle}
                                    </Badge>
                                  ))}
                                  {Array.isArray(item.suggested_principles) && item.suggested_principles.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.suggested_principles.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setIsEditingContradiction(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteContradiction(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                      {mockContradictions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No contradictions found. Add a new contradiction to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Principle Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usedPrinciples.map((principle, i) => {
                      const details = getPrincipleDetailsByName(principle);
                      
                      if (!details) return null;
                      
                      return (
                        <Card key={i} className="bg-accent/20">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{principle}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                Principle {details.id}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              {details.description}
                            </p>
                            <div className="space-y-1">
                              <h6 className="text-xs font-medium">Examples:</h6>
                              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                {details.examples.slice(0, 2).map((example, j) => (
                                  <li key={j}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t p-6">
              <div className="w-full space-y-4">
                <h3 className="font-medium">Review and Save</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1" 
                    variant="default" 
                    onClick={handleApproveAnalysis}
                  >
                    <Check className="mr-2 h-4 w-4" /> 
                    Save Analysis
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => setSelectedPatent(null)}
                  >
                    Upload Another Patent
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ) : null}
      </div>

      {/* Dialog for adding custom parameters */}
      <Dialog open={isAddingParameter} onOpenChange={setIsAddingParameter}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Parameter</DialogTitle>
            <DialogDescription>
              Create a custom engineering parameter to use in contradictions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="parameter-name">Parameter Name</Label>
              <Input 
                id="parameter-name" 
                value={newParameter} 
                onChange={(e) => setNewParameter(e.target.value)}
                placeholder="Enter a descriptive name for the parameter"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingParameter(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddParameter}>
              Add Parameter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatentUpload;
