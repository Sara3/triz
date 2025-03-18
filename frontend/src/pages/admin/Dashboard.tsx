
import React, { useState, useEffect } from 'react';
import { FileText, Clock, Trash, Edit, X, Info, FileCheck, UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOCK_PATENTS } from '@/lib/mock-data';
import { getAllAnalysisResults, getAnalysisResultsByPatentId, storeAnalysisResult } from '@/lib/triz-utils';
import { formatDistance } from 'date-fns';
import { PatentAnalysis } from '@/lib/types';

const Dashboard: React.FC = () => {
  const [recentlyApproved, setRecentlyApproved] = useState<PatentAnalysis[]>([]);
  const [selectedPatentId, setSelectedPatentId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<PatentAnalysis[]>([]);
  const navigate = useNavigate();
  
  // Load approved analyses
  const loadApprovedAnalyses = () => {
    const analyses = getAllAnalysisResults();
    // Filter to only show approved analyses and sort by date
    const approved = analyses
      .filter(a => (a.status === 'approved' || a.review_status === 'approved') && (a.approved_date || a.feedback_date))
      .sort((a, b) => {
        const dateA = new Date(a.approved_date || a.feedback_date || 0);
        const dateB = new Date(b.approved_date || b.feedback_date || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5); // Limit to 5 most recent
    
    setRecentlyApproved(approved);
  };
  
  useEffect(() => {
    // Load approved analyses
    loadApprovedAnalyses();
  }, []);
  
  // Handle view analysis action
  const handleViewAnalysis = (patentId: string) => {
    setSelectedPatentId(patentId);
    const results = getAnalysisResultsByPatentId(patentId);
    setAnalysisResults(results);
  };
  
  // Handle closing analysis results dialog
  const handleCloseAnalysisResults = () => {
    setSelectedPatentId(null);
    setAnalysisResults([]);
  };

  // Handle approving an analysis
  const handleApproveAnalysis = (analysisId: string, patentId: string) => {
    const analyses = getAllAnalysisResults();
    const analysis = analyses.find(a => a.id === analysisId);
    const patentDetails = MOCK_PATENTS.find(p => p.id === patentId);
    
    if (!analysis || !patentDetails) return;
    
    // Get principles from analysis
    const principles = analysis.extracted_data.contradictions.flatMap(item => 
      Array.isArray(item.suggested_principles) ? item.suggested_principles : []
    ).filter((value, index, self) => self.indexOf(value) === index).slice(0, 3);
    
    // Update with approval info
    const updatedAnalysis = {
      ...analysis,
      title: patentDetails.title,
      approved_date: new Date().toISOString(),
      status: 'approved' as const,
      review_status: 'approved' as const,
      principles: principles
    };
    
    // Store updated analysis
    storeAnalysisResult(updatedAnalysis);
    
    // Update the recently approved list
    loadApprovedAnalyses();
  };
  
  // Handle delete analysis action
  const handleDeleteAnalysis = (analysisId: string) => {
    // In a real application, you would call an API to delete the analysis
    // For this example, we'll just update the local state
    
    // Remove the analysis from the mock database
    const updatedAnalyses = getAllAnalysisResults().filter(a => a.id !== analysisId);
    
    // Update the analysis results in the mock database
    getAllAnalysisResults().length = 0;
    updatedAnalyses.forEach(a => getAllAnalysisResults().push(a));
    
    // Update the recently approved list
    loadApprovedAnalyses();
  };
  
  const timeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor TRIZ analysis and manage patents</p>
        </div>
        <Button asChild>
          <Link to="/admin/upload">
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload New Patent
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recently Approved Analyses</CardTitle>
          <CardDescription>Last 5 TRIZ analyses approved by reviewers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyApproved.map(analysis => {
              const patent = MOCK_PATENTS.find(p => p.id === analysis.patent_id);
              return patent ? (
                <div key={analysis.id} className="flex items-center justify-between">
                  <div>
                    <Link to={`/admin/analysis/${analysis.id}`} className="font-medium hover:underline">
                      {analysis.title || patent.title}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{patent.patent_number}</span>
                      <Separator orientation="vertical" className="h-4" />
                      <Clock className="h-4 w-4" />
                      <span>{analysis.approved_date ? timeAgo(analysis.approved_date) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      asChild
                      variant="outline" 
                      size="sm"
                    >
                      <Link to={`/admin/analysis/${analysis.id}`}>
                        View Analysis
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteAnalysis(analysis.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="link" className="w-full justify-center">
            <Link to="/admin/analysis">
              View All Analyses
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Analysis Results Dialog */}
      <Dialog open={selectedPatentId !== null} onOpenChange={handleCloseAnalysisResults}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Analysis Results</DialogTitle>
            <DialogDescription>
              Review the TRIZ analysis results for the selected patent.
            </DialogDescription>
          </DialogHeader>
          
          {analysisResults.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <Info className="h-6 w-6 mr-2 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">No analysis results found for this patent.</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {analysisResults.map(analysis => {
                const patent = MOCK_PATENTS.find(p => p.id === analysis.patent_id);
                return patent ? (
                  <Card key={analysis.id}>
                    <CardHeader>
                      <CardTitle>
                        {patent.title}
                        <Badge className="ml-2">{patent.patent_number}</Badge>
                      </CardTitle>
                      <CardDescription>
                        Analysis Date: {analysis.analysis_date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Display analysis details here */}
                      <p>Confidence Score: {analysis.confidence_score}</p>
                      <p>Extracted Data: {JSON.stringify(analysis.extracted_data)}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      {analysis.status !== 'approved' && (
                        <Button variant="ghost">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {analysis.status !== 'approved' ? (
                        <Button onClick={() => handleApproveAnalysis(analysis.id, patent.id)}>
                          <FileCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileCheck className="h-4 w-4" />
                          Approved
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                ) : null;
              })}
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit" onClick={handleCloseAnalysisResults}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
