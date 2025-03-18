
import React from 'react';
import { ArrowLeft, Layers, FileUp, Clipboard, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisChart from '@/components/ui-custom/AnalysisChart';
import { Badge } from "@/components/ui/badge";
import { MOCK_ANALYTICS } from '@/lib/mock-data';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="p-0 h-8 w-8">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          </div>
          <p className="text-muted-foreground">Monitor system performance and extraction quality</p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animated-list">
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-blue-100">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{MOCK_ANALYTICS.total_patents}</p>
              <p className="text-sm text-muted-foreground">Total Patents</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-amber-100">
                <FileUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">15</p>
              <p className="text-sm text-muted-foreground">Uploads this Month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-green-100">
                <Clipboard className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{(MOCK_ANALYTICS.average_confidence_score * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Avg. Confidence Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">1.4</p>
              <p className="text-sm text-muted-foreground">Model Version</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Processing Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Activity Summary</CardTitle>
              <CardDescription>
                Monthly summary of patent processing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Uploads</div>
                    <div className="text-2xl font-bold">15</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Analyzed</div>
                    <div className="text-2xl font-bold">13</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Reviewed</div>
                    <div className="text-2xl font-bold">10</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalysisChart data={MOCK_ANALYTICS} variant="status" />
            <AnalysisChart data={MOCK_ANALYTICS} variant="principles" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Contradictions</CardTitle>
              <CardDescription>
                Most commonly identified technical contradictions across all patents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisChart data={MOCK_ANALYTICS} variant="contradictions" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance</CardTitle>
              <CardDescription>
                Extraction model performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
                    <div className="text-2xl font-bold">86%</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
                    <div className="text-2xl font-bold">84%</div>
                  </div>
                  <div className="p-4 border rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Avg. Review Time</div>
                    <div className="text-2xl font-bold">5 min</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg mb-4">Model Version History</h3>
                  <div className="space-y-2">
                    {[
                      { version: '1.4', date: '2023-06-15', improvements: 'Improved contradiction detection' },
                      { version: '1.3', date: '2023-04-10', improvements: 'Enhanced principle mapping' },
                      { version: '1.2', date: '2023-02-22', improvements: 'Better parameter identification' },
                      { version: '1.1', date: '2023-01-05', improvements: 'Fixed accuracy issues' },
                      { version: '1.0', date: '2022-12-01', improvements: 'Initial release' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                        <div>
                          <div className="font-medium">Version {item.version}</div>
                          <div className="text-sm text-muted-foreground">{item.improvements}</div>
                        </div>
                        <Badge variant="outline">{item.date}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Status</CardTitle>
                <CardDescription>
                  Current review completion rate and feedback status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Reviewed</span>
                      </div>
                      <span className="font-medium">{MOCK_ANALYTICS.patents_by_status.reviewed} Patents</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${MOCK_ANALYTICS.review_completion_rate}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>{MOCK_ANALYTICS.review_completion_rate}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Feedback Summary</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span>Accurate extractions</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Required minor corrections</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Required major corrections</span>
                      <span className="font-medium">4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Processing Issues</CardTitle>
                <CardDescription>
                  Overview of processing errors and their resolution
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="font-medium">Processing Errors</span>
                      </div>
                      <span className="font-medium">{MOCK_ANALYTICS.patents_by_status.error} Patents</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(MOCK_ANALYTICS.patents_by_status.error / MOCK_ANALYTICS.total_patents) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span>{((MOCK_ANALYTICS.patents_by_status.error / MOCK_ANALYTICS.total_patents) * 100).toFixed(1)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Error Categories</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span>PDF parsing issues</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Missing sections</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>OCR quality</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Other issues</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score Trend</CardTitle>
              <CardDescription>
                Average confidence score of TRIZ extractions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {[
                    { month: 'Jan', score: 0.76 },
                    { month: 'Feb', score: 0.78 },
                    { month: 'Mar', score: 0.81 },
                    { month: 'Apr', score: 0.84 },
                    { month: 'May', score: 0.85 },
                    { month: 'Jun', score: 0.88 }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border rounded-md text-center">
                      <div className="text-sm text-muted-foreground mb-1">{item.month}</div>
                      <div className="text-xl font-bold">{(item.score * 100).toFixed(0)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patent Type Distribution</CardTitle>
                <CardDescription>
                  Distribution of patents by category and type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Competitor', count: 8 },
                    { name: 'Prior Art', count: 6 },
                    { name: 'Internal', count: 12 },
                    { name: 'Reference', count: 4 }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                      <span>{item.name}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Review Time Trend</CardTitle>
                <CardDescription>
                  Average time to review extractions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { month: 'Jan', time: 15 },
                    { month: 'Feb', time: 12 },
                    { month: 'Mar', time: 10 },
                    { month: 'Apr', time: 8 },
                    { month: 'May', time: 7 },
                    { month: 'Jun', time: 5 }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                      <span>{item.month}</span>
                      <Badge variant="outline">{item.time} min</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
