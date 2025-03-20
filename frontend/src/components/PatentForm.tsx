import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPatent, updatePatent, Patent, analyzePatent, PatentAnalysisResult } from '@/lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Loader2, Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import AnalysisViewer from './AnalysisViewer';

interface PatentFormProps {
  initialData?: Partial<Patent>;
  onSuccess?: (data: Patent) => void;
  onCancel?: () => void;
}

export function PatentForm({ initialData, onSuccess, onCancel }: PatentFormProps) {
  const isEditing = !!initialData?.id;
  const queryClient = useQueryClient();
  const [filingDate, setFilingDate] = useState<Date | undefined>(
    initialData?.filing_date ? new Date(initialData.filing_date) : undefined
  );
  const [publicationDate, setPublicationDate] = useState<Date | undefined>(
    initialData?.publication_date ? new Date(initialData.publication_date) : undefined
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PatentAnalysisResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'complete' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm<Partial<Patent>>({
    defaultValues: initialData || {},
  });

  // File handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setFileError("Please upload PDF files only");
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) { // 100MB limit
        setFileError("File exceeds the maximum size limit (100MB)");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'application/pdf') {
        setFileError("Please upload PDF files only");
        return;
      }
      if (droppedFile.size > 100 * 1024 * 1024) { // 100MB limit
        setFileError("File exceeds the maximum size limit (100MB)");
        return;
      }
      setFile(droppedFile);
    }
  };

  // Analyze patent
  const handleAnalyzePatent = async () => {
    if (!file) {
      setFileError("Please upload a patent file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setUploadStatus('analyzing');
    setFileError(null);  // Clear any previous errors

    // Reset progress
    setUploadProgress(0);
    
    // Create progress interval 
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Simulate uploading progress
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);

      // Call the API to analyze the patent
      const response = await analyzePatent(file);
      if (progressInterval) clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Wait a bit to show 100% progress
      setTimeout(() => {
        setIsAnalyzing(false);
        setUploadStatus('complete');
        
        if (response) {
          setAnalysis(response);
          
          // If analysis contains patent metadata, prefill the form
          if (response.metadata) {
            if (response.metadata.title) setValue('title', response.metadata.title);
            if (response.metadata.abstract) setValue('abstract', response.metadata.abstract);
            if (response.metadata.inventors) setValue('inventors', response.metadata.inventors);
            if (response.metadata.assignee) setValue('assignee', response.metadata.assignee);
            if (response.metadata.patent_number) setValue('patent_number', response.metadata.patent_number);
          }
          
          // Add the file URL to the form
          if (response.fileUrl) {
            console.log(`Using file URL: ${response.fileUrl}`);
            setValue('pdf_file', response.fileUrl);
          }
          
          // Set contradictions found message
          if (response.contradictions && response.contradictions.length > 0) {
            toast.success(`${response.contradictions.length} contradictions found in the patent`);
          } else {
            toast.info("No contradictions found in the patent");
          }
        }
      }, 500);
    } catch (error) {
      console.error("Error analyzing patent:", error);
      if (progressInterval) clearInterval(progressInterval);
      setUploadProgress(0);
      setFileError(error instanceof Error ? error.message : "Failed to analyze patent. Please try again.");
      setUploadStatus('error');
      setIsAnalyzing(false);
    }
  };

  // Create patent mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Patent>) => {
      // If we have a file, include it in the request
      if (file) {
        const formData = new FormData();
        
        // Add the form data to the request
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, String(value));
          }
        });
        
        // If we have analysis data, include it
        if (analysis) {
          // Include the file URL instead of uploading the file again
          if (analysis.fileUrl) {
            formData.append('pdf_file', analysis.fileUrl);
            formData.append('pdf_file_name', file.name); // Include original filename
          }
          formData.append('analysis', JSON.stringify(analysis.contradictions || []));
        }
        
        return createPatent(formData as unknown as Omit<Patent, 'id'>);
      } else {
        // Regular create without file
        return createPatent(data as Omit<Patent, 'id'>);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['patents'] });
      toast.success('Patent created successfully');
      reset();
      setFilingDate(undefined);
      setPublicationDate(undefined);
      setFile(null);
      setAnalysis(null);
      setUploadStatus('idle');
      if (onSuccess && response.data) onSuccess(response.data);
    },
    onError: (error) => {
      toast.error(`Failed to create patent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Update patent mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<Patent>) => updatePatent(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['patents'] });
      if (response.data) {
        queryClient.invalidateQueries({ queryKey: ['patent', response.data.id] });
        if (onSuccess) onSuccess(response.data);
      }
      toast.success('Patent updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update patent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const onSubmit = (data: Partial<Patent>) => {
    // Format dates for submission
    const formattedData = {
      ...data,
      filing_date: filingDate ? format(filingDate, 'yyyy-MM-dd') : undefined,
      publication_date: publicationDate ? format(publicationDate, 'yyyy-MM-dd') : undefined,
    };

    if (isEditing && initialData.id) {
      updateMutation.mutate({ id: initialData.id, ...formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isAnalyzing;

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Patent' : 'Add New Patent'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the patent information in the database' 
            : 'Fill in the details to add a new patent to the database'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing && (
          <div className="mb-6">
            <Label>Upload Patent PDF (Optional)</Label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-4 mt-2 text-center cursor-pointer",
                "hover:border-primary/50 transition-colors",
                fileError ? "border-destructive" : "border-border"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('patent-file-upload')?.click()}
            >
              <input
                id="patent-file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p>Drag and drop a PDF file here, or click to browse</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF files only, up to 100MB</p>
                </div>
              )}
            </div>
            
            {fileError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            
            {file && (
              <div className="mt-2">
                {uploadStatus === 'analyzing' && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Analyzing patent with LLM... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
                
                {uploadStatus === 'complete' && analysis && (
                  <div className="mt-8">
                    <AnalysisViewer 
                      analysis={{
                        id: 'temp-analysis-id',
                        patent_id: initialData?.id ? String(initialData.id) : 'new-patent',
                        extracted_data: {
                          contradictions: analysis.contradictions || []
                        },
                        confidence_score: 0.8,
                        review_status: 'pending',
                        extraction_version: '1.0',
                        analysis_date: new Date().toISOString(),
                      }}
                      onReviewComplete={() => toast.success('Analysis approved')}
                    />
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to analyze patent. Please try again.</AlertDescription>
                  </Alert>
                )}
                
                {uploadStatus === 'idle' && (
                  <Button 
                    className="w-full mt-2" 
                    variant="secondary"
                    onClick={handleAnalyzePatent}
                    disabled={isLoading}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Patent with LLM'
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        
        <form id="patent-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patent_number">Patent Number <span className="text-red-500">*</span></Label>
              <Input
                id="patent_number"
                {...register('patent_number', { required: 'Patent number is required' })}
                placeholder="e.g., US12345678"
                disabled={isLoading}
              />
              {errors.patent_number && (
                <p className="text-sm text-red-500">{errors.patent_number.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee <span className="text-red-500">*</span></Label>
              <Input
                id="assignee"
                {...register('assignee', { required: 'Assignee is required' })}
                placeholder="Company or individual"
                disabled={isLoading}
              />
              {errors.assignee && (
                <p className="text-sm text-red-500">{errors.assignee.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Patent title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract <span className="text-red-500">*</span></Label>
            <Textarea
              id="abstract"
              {...register('abstract', { required: 'Abstract is required' })}
              placeholder="Patent abstract"
              className="min-h-[100px]"
              disabled={isLoading}
            />
            {errors.abstract && (
              <p className="text-sm text-red-500">{errors.abstract.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="inventors">Inventors <span className="text-red-500">*</span></Label>
            <Input
              id="inventors"
              {...register('inventors', { required: 'Inventors are required' })}
              placeholder="Comma-separated list of inventors"
              disabled={isLoading}
            />
            {errors.inventors && (
              <p className="text-sm text-red-500">{errors.inventors.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Filing Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filingDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filingDate ? format(filingDate, 'PPP') : <span>Select filing date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filingDate}
                    onSelect={setFilingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!filingDate && (
                <p className="text-sm text-red-500">Filing date is required</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Publication Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !publicationDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publicationDate ? format(publicationDate, 'PPP') : <span>Select publication date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publicationDate}
                    onSelect={setPublicationDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {!publicationDate && (
                <p className="text-sm text-red-500">Publication date is required</p>
              )}
            </div>
          </div>
          
          {analysis && analysis.contradictions && analysis.contradictions.length > 0 && (
            <div className="space-y-2 border rounded-md p-4 bg-slate-50">
              <Label>TRIZ Contradictions Analyzed</Label>
              <div className="space-y-2 mt-2">
                {analysis.contradictions.map((contradiction, index) => (
                  <div key={index} className="border rounded p-2 bg-white">
                    <p className="font-medium">Contradiction {index + 1}:</p>
                    <p>Improving: <span className="font-medium">{contradiction.contradiction.improving_parameter}</span></p>
                    <p>Worsening: <span className="font-medium">{contradiction.contradiction.worsening_parameter}</span></p>
                    <p className="mt-1">Suggested Principles:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contradiction.suggested_principles.map((principle, pIndex) => (
                        <span key={pIndex} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                          {principle}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="patent-form" 
          disabled={isLoading || !filingDate || !publicationDate}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Patent' : 'Create Patent'}
        </Button>
      </CardFooter>
    </Card>
  );
} 