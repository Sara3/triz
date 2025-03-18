
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Filter, ChevronDown, FileText, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { getAllAnalysisResults } from '@/lib/triz-utils';
import { PatentAnalysis } from '@/lib/types';
import { MOCK_PATENTS } from '@/lib/mock-data';

const MultipleAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatentAnalysis['review_status'][]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Get all analyses from the utility function
  const allAnalyses = getAllAnalysisResults();
  
  // Helper function to apply filters
  const getFilteredAnalyses = () => {
    return allAnalyses
      .filter(analysis => {
        // Apply status filter
        if (statusFilter.length > 0 && !statusFilter.includes(analysis.review_status)) {
          return false;
        }
        
        // Get associated patent info
        const patent = MOCK_PATENTS.find(p => p.id === analysis.patent_id);
        
        // Apply search term filter (case insensitive)
        if (searchTerm && patent) {
          const term = searchTerm.toLowerCase();
          return (
            patent.title.toLowerCase().includes(term) ||
            patent.patent_number.toLowerCase().includes(term) ||
            patent.inventor.toLowerCase().includes(term) ||
            patent.assignee.toLowerCase().includes(term)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.analysis_date).getTime();
        const dateB = new Date(b.analysis_date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  };
  
  const filteredAnalyses = getFilteredAnalyses();

  // Status count for filters
  const statusCounts = allAnalyses.reduce((acc, analysis) => {
    acc[analysis.review_status] = (acc[analysis.review_status] || 0) + 1;
    return acc;
  }, {} as Record<PatentAnalysis['review_status'], number>);
  
  // Get patent info by patent ID
  const getPatentInfo = (patentId: string) => {
    return MOCK_PATENTS.find(p => p.id === patentId);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Patent Analyses</h1>
          <p className="text-muted-foreground">View and manage extracted TRIZ analysis results</p>
        </div>
        <Button asChild>
          <Link to="/admin/upload">
            <Plus className="h-4 w-4 mr-2" />
            Upload New Patent
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                View all TRIZ analysis results generated from uploaded patents
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 md:ml-auto">
              {filteredAnalyses.length} Result{filteredAnalyses.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search analyses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Status
                    <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('pending')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'pending'] 
                          : statusFilter.filter(s => s !== 'pending')
                      );
                    }}
                  >
                    Pending
                    <Badge className="ml-auto bg-amber-50 text-amber-700 font-normal">
                      {statusCounts.pending || 0}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('reviewed')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'reviewed'] 
                          : statusFilter.filter(s => s !== 'reviewed')
                      );
                    }}
                  >
                    Reviewed
                    <Badge className="ml-auto bg-blue-50 text-blue-700 font-normal">
                      {statusCounts.reviewed || 0}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('approved')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'approved'] 
                          : statusFilter.filter(s => s !== 'approved')
                      );
                    }}
                  >
                    Approved
                    <Badge className="ml-auto bg-green-50 text-green-700 font-normal">
                      {statusCounts.approved || 0}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-normal"
                    onClick={() => setStatusFilter([])}
                  >
                    Clear filters
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'newest'}
                    onCheckedChange={() => setSortOrder('newest')}
                  >
                    Newest First
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'oldest'}
                    onCheckedChange={() => setSortOrder('oldest')}
                  >
                    Oldest First
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Analyses Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {statusFilter.length === 0 && searchTerm === ''
                  ? "No patent analyses have been generated yet. Upload patents to see analysis results."
                  : "No analyses match your current search criteria. Try adjusting your filters."}
              </p>
              {statusFilter.length === 0 && searchTerm === '' && (
                <Button asChild className="mt-4">
                  <Link to="/admin/upload">Upload Patents</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patent</TableHead>
                    <TableHead>Contradictions</TableHead>
                    <TableHead>Analysis Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => {
                    const patent = getPatentInfo(analysis.patent_id);
                    return (
                      <TableRow key={analysis.id} className="animate-fade-in">
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{patent?.title || 'Unknown Patent'}</div>
                            <div className="text-xs text-muted-foreground">
                              {patent?.patent_number || 'No patent number'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{analysis.extracted_data.contradictions.length}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(analysis.analysis_date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            analysis.review_status === 'approved' 
                              ? "bg-green-50 text-green-700"
                              : analysis.review_status === 'reviewed'
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                          }>
                            {analysis.review_status.charAt(0).toUpperCase() + analysis.review_status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div 
                                className={`h-full ${
                                  analysis.confidence_score > 0.8 
                                    ? "bg-green-500" 
                                    : analysis.confidence_score > 0.6 
                                      ? "bg-amber-500" 
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${analysis.confidence_score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs">
                              {Math.round(analysis.confidence_score * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="View Analysis"
                          >
                            <Link to={`/admin/analysis/${analysis.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleAnalysis;
