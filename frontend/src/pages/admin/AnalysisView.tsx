
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import AnalysisViewer from '@/components/ui-custom/AnalysisViewer';
import { getAnalysisById, storeAnalysisResult } from '@/lib/triz-utils';
import { MOCK_PATENTS } from '@/lib/mock-data';

const AnalysisView: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Use the utility function to get the analysis data
  const analysis = analysisId ? getAnalysisById(analysisId) : undefined;
  
  // Find the associated patent
  const patent = analysis ? MOCK_PATENTS.find(p => p.id === analysis.patent_id) : undefined;
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (!analysis) {
        setError(`Analysis not found with ID: ${analysisId}`);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [analysisId, analysis]);
  
  const handleReviewComplete = () => {
    if (analysis && patent) {
      // Update the analysis with approval status and current date
      const updatedAnalysis = {
        ...analysis,
        approved_date: new Date().toISOString(),
        status: 'approved' as const,
        review_status: 'approved' as const, // Use 'as const' to ensure it matches the expected type
        title: patent.title,
        principles: analysis.extracted_data.contradictions.flatMap(item => 
          Array.isArray(item.suggested_principles) ? item.suggested_principles : []
        ).filter((value, index, self) => self.indexOf(value) === index).slice(0, 3)
      };
      
      // Store the updated analysis to make it available for the Dashboard
      storeAnalysisResult(updatedAnalysis);
      
      toast.success("Analysis approved and saved to database");
      
      // Set a short timeout before redirecting to allow the toast to be seen
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      toast.error("Failed to approve analysis: Missing data");
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-pulse">Loading analysis data...</div>
      </div>
    );
  }
  
  if (error || !analysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <Button asChild variant="ghost" size="sm" className="p-0 h-8 w-8">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Not Found</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "The requested analysis could not be found."}</AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-60">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Analysis Not Available</h3>
            <p className="text-muted-foreground max-w-md">
              The analysis you're looking for might have been deleted or doesn't exist.
              Try uploading a new patent or returning to the dashboard.
            </p>
            <div className="mt-6 flex gap-4">
              <Button asChild>
                <Link to="/admin/upload">Upload New Patent</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/admin">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="p-0 h-8 w-8">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">View Analysis</h1>
          </div>
          <p className="text-muted-foreground">Review TRIZ analysis of patent documents</p>
        </div>
      </div>
      
      <AnalysisViewer 
        analysis={analysis} 
        patent={patent}
        onReviewComplete={handleReviewComplete}
      />
    </div>
  );
};

export default AnalysisView;
