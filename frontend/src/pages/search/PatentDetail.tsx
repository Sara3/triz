
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Building2, UserRound, FileText, Tag, ExternalLink, Copy, Clock, ChevronDown, ChevronUp, Download } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import TrizMatrix from '@/components/ui-custom/TrizMatrix';
import { Patent, PatentAnalysis, PatentCitation } from '@/lib/types';
import { 
  getPatentById, 
  getPatentAnalysisById, 
  getPatentCitationsById 
} from '@/lib/mock-data';

const PatentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fullTextExpanded, setFullTextExpanded] = useState(false);
  
  // Get patent and related data
  const patent = getPatentById(id || '');
  const analysis = getPatentAnalysisById(id || '');
  const citations = getPatentCitationsById(id || '');
  
  if (!patent) {
    return (
      <div className="container max-w-4xl py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Patent Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The patent you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/search">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </Button>
      </div>
    );
  }
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };
  
  return (
    <div className="container max-w-7xl space-y-8">
      <Button
        variant="ghost"
        className="gap-1"
        asChild
      >
        <Link to="/search">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {patent.patent_number}
                </Badge>
                {patent.is_competitor && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800">
                    Competitor
                  </Badge>
                )}
                {patent.is_prior_art && (
                  <Badge variant="outline" className="bg-violet-50 text-violet-800">
                    Prior Art
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">{patent.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Filing Date</p>
                    <p className="font-medium">{new Date(patent.filing_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upload Date</p>
                    <p className="font-medium">{new Date(patent.upload_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <UserRound className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inventor(s)</p>
                    <p className="font-medium">{patent.inventor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assignee</p>
                    <p className="font-medium">{patent.assignee}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Abstract</h3>
                <p className="text-muted-foreground">{patent.abstract}</p>
              </div>
              
              {patent.keywords && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center mr-1">
                    <Tag className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">Keywords:</span>
                  </div>
                  {patent.keywords.split(',').map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 pt-0">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => copyToClipboard(patent.patent_number, 'Patent number')}>
                <Copy className="h-3.5 w-3.5" />
                Copy Patent Number
              </Button>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Original Patent
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
          
          <Tabs defaultValue="triz" className="animate-fade-in">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="triz">TRIZ Analysis</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="fulltext">Full Text</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="triz" className="mt-6 animate-fade-in">
              {analysis ? (
                <TrizMatrix contradictions={analysis.extracted_data.contradictions} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">TRIZ Analysis</CardTitle>
                    <CardDescription>
                      No TRIZ analysis is available for this patent yet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The TRIZ extraction process has not been completed for this patent.
                      This may be because the patent is still being processed.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="citations" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Patent Citations</CardTitle>
                  <CardDescription>
                    References and citations identified in this patent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {citations.length === 0 ? (
                    <p className="text-muted-foreground">
                      No citations have been identified for this patent.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {citations.map((citation: PatentCitation) => (
                        <div key={citation.id} className="p-4 bg-accent/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{citation.cited_patent_number}</h3>
                            <Badge variant="outline" className={
                              citation.citation_type === 'prior-art' 
                                ? "bg-violet-50 text-violet-800" 
                                : "bg-blue-50 text-blue-700"
                            }>
                              {citation.citation_type === 'prior-art' ? 'Prior Art' : 'Related'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{citation.citation_context}</p>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">
                              Cited Date: {new Date(citation.citation_date).toLocaleDateString()}
                            </span>
                            <Button variant="ghost" size="sm" className="h-7 gap-1" asChild>
                              <a href="#" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                View Patent
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="fulltext" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-medium">Full Patent Text</CardTitle>
                      <CardDescription>
                        Complete text content of the patent document
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => setFullTextExpanded(!fullTextExpanded)}
                    >
                      {fullTextExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span className="sr-only">Collapse</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Expand</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className={fullTextExpanded ? "h-[600px]" : "h-[300px]"}>
                    <div className="p-4 text-sm whitespace-pre-wrap font-mono">
                      {patent.raw_text || 'Full text content is not available for this patent.'}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full gap-1"
                    onClick={() => copyToClipboard(patent.raw_text, 'Patent text')}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Full Text
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="files" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Patent Files</CardTitle>
                  <CardDescription>
                    Original and processed patent documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-md">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patent.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            Original Patent Document • PDF
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-md">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{patent.patent_number}_extraction.json</p>
                          <p className="text-xs text-muted-foreground">
                            Extracted Data • JSON
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-8">
          {analysis && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence Score</span>
                    <span className="font-medium">{(analysis.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${analysis.confidence_score * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Analysis Date</span>
                    <span className="text-sm font-medium">{new Date(analysis.analysis_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Review Status</span>
                    <Badge variant="outline" className={
                      analysis.review_status === 'approved' 
                        ? "bg-green-50 text-green-700" 
                        : analysis.review_status === 'reviewed'
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                    }>
                      {analysis.review_status.charAt(0).toUpperCase() + analysis.review_status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Extraction Version</span>
                    <span className="text-sm font-medium">{analysis.extraction_version}</span>
                  </div>
                </div>
                
                {analysis.user_feedback && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-1">Admin Feedback</h4>
                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                      {analysis.user_feedback}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Similar Patents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock similar patents */}
              <div className="p-3 border rounded-lg hover:bg-accent/20 transition-colors">
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs mb-1">US10865432B2</Badge>
                  <h4 className="font-medium line-clamp-2">Improved Medical Device with Enhanced Battery Management</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>MedTech, Inc.</span>
                  <span>2022-05-15</span>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-accent/20 transition-colors">
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs mb-1">US10954321B2</Badge>
                  <h4 className="font-medium line-clamp-2">Patient Monitoring System with Wireless Data Transmission</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>HealthSys Corp.</span>
                  <span>2021-09-30</span>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-accent/20 transition-colors">
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs mb-1">US11023456B2</Badge>
                  <h4 className="font-medium line-clamp-2">Low-Power Wearable Medical Sensor Array</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Wearable Health, LLC</span>
                  <span>2021-11-12</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                View More Similar Patents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatentDetail;
