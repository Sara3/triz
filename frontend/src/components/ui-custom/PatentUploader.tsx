import React, { useState } from 'react';
import { Upload, File, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { storeAnalysisResult } from '@/lib/triz-utils';
import { TrizExtraction, PatentAnalysis } from '@/lib/types';
import { MOCK_PATENTS } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

interface PatentUploaderProps {
  onUploadComplete?: (filename: string) => void;
  onAnalysisComplete?: (analysisId: string) => void;
}

type FileStatus = 'idle' | 'uploading' | 'processing' | 'analyzed' | 'success' | 'error';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: FileStatus;
  analysisId?: string;
}

const PatentUploader: React.FC<PatentUploaderProps> = ({ onUploadComplete, onAnalysisComplete }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    setUploadError(null);
    
    const newFiles = Array.from(fileList)
      .filter(file => {
        if (file.type !== 'application/pdf') {
          toast.error("Please upload PDF files only");
          return false;
        }
        
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File "${file.name}" exceeds the maximum size limit (100MB)`);
          return false;
        }
        
        return true;
      })
      .map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'idle' as FileStatus
      }));

    if (fileList.length > 0 && newFiles.length === 0) {
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const generateMockAnalysis = (fileId: string, fileName: string): PatentAnalysis => {
    const matchingPatent = MOCK_PATENTS.find(p => p.filename === fileName) || MOCK_PATENTS[0];
    
    const mockExtraction: TrizExtraction = {
      contradictions: [
        {
          contradiction: {
            improving_parameter: "Strength",
            worsening_parameter: "Weight of moving object"
          },
          suggested_principles: ["Segmentation", "Asymmetry", "Composite Materials"]
        },
        {
          contradiction: {
            improving_parameter: "Reliability",
            worsening_parameter: "Complexity"
          },
          suggested_principles: ["Preliminary Action", "Nesting", "Feedback"]
        }
      ]
    };
    
    const analysisId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    return {
      id: analysisId,
      patent_id: matchingPatent.id,
      extracted_data: mockExtraction,
      confidence_score: 0.85,
      review_status: 'pending',
      extraction_version: '1.0.0',
      analysis_date: now
    };
  };

  const simulateUpload = () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    const updatedFiles = [...files].map(file => ({
      ...file,
      status: 'uploading' as FileStatus
    }));
    
    setFiles(updatedFiles);
    
    updatedFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: 100, status: 'processing' } 
                : f
            )
          );
          
          setTimeout(() => {
            const mockAnalysis = generateMockAnalysis(file.id, file.name);
            storeAnalysisResult(mockAnalysis);
            
            setFiles(prev => 
              prev.map(f => 
                f.id === file.id 
                  ? { ...f, status: 'analyzed', analysisId: mockAnalysis.id } 
                  : f
              )
            );
            
            if (onAnalysisComplete) {
              onAnalysisComplete(mockAnalysis.id);
            }
            
            setTimeout(() => {
              setFiles(prev => 
                prev.map(f => 
                  f.id === file.id 
                    ? { ...f, status: 'success' } 
                    : f
                )
              );
              
              const allComplete = updatedFiles.every(f => f.id === file.id || f.status === 'success');
              if (allComplete) {
                setIsUploading(false);
                toast.success("All files uploaded and analyzed successfully");
                
                if (onUploadComplete) {
                  onUploadComplete(file.name);
                }
              }
            }, 1500);
          }, 3000);
        }
        
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, progress } 
              : f
          )
        );
      }, 200);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusText = (status: FileStatus) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing with LLM...';
      case 'analyzed': return 'Analysis complete';
      case 'success': return 'Ready for review';
      case 'error': return 'Error';
      default: return '';
    }
  };

  const handleViewAnalysis = (analysisId?: string) => {
    if (!analysisId) {
      toast.error("Analysis ID not found");
      return;
    }
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysisId);
    } else {
      navigate(`/admin/analysis/${analysisId}`);
      toast.success("Redirecting to analysis view");
    }
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-10 transition-all duration-200 ease-in-out text-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-secondary">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Patent Documents</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Drag and drop your PDF files here, or click to browse
            </p>
          </div>
          <div>
            <label htmlFor="file-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum file size: 100MB. PDF format only.
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Files to Upload</h3>
            <Button 
              onClick={simulateUpload} 
              disabled={isUploading || files.every(f => f.status === 'success')}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isUploading && "Upload & Analyze"}
            </Button>
          </div>
          
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden animate-slide-in">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-secondary rounded-md">
                        <File className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-md">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {file.status === 'uploading' 
                            ? `${Math.round(file.progress)}%` 
                            : getStatusText(file.status)
                          }
                        </span>
                      )}
                      {file.status === 'analyzed' && (
                        <span className="text-xs font-medium text-amber-600">
                          {getStatusText(file.status)}
                        </span>
                      )}
                      {file.status === 'success' ? (
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-green-600 mr-2">
                            {getStatusText(file.status)}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'uploading' || file.status === 'processing'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {file.status !== 'idle' && (
                    <div className="mt-2">
                      <Progress 
                        value={file.progress} 
                        className={cn(
                          "h-1",
                          file.status === 'success' ? "bg-green-100" : "",
                          file.status === 'analyzed' ? "bg-amber-100" : "",
                          file.status === 'processing' ? "bg-blue-100" : ""
                        )} 
                      />
                      
                      {(file.status === 'analyzed' || file.status === 'success') && (
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => handleViewAnalysis(file.analysisId)}
                        >
                          View Analysis
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatentUploader;
