import React, { useState } from 'react';
import { ArrowLeft, Filter, ChevronDown, Check, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import PatentCard from '@/components/ui-custom/PatentCard';
import { Patent } from '@/lib/types';
import { MOCK_PATENTS } from '@/lib/mock-data';

const PatentReview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Patent['status'][]>(['analyzed']);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  const getFilteredPatents = () => {
    return MOCK_PATENTS
      .filter(patent => {
        if (statusFilter.length > 0 && !statusFilter.includes(patent.status)) {
          return false;
        }
        
        if (searchTerm) {
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
        const dateA = new Date(a.upload_date).getTime();
        const dateB = new Date(b.upload_date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  };
  
  const filteredPatents = getFilteredPatents();

  const statusCounts = MOCK_PATENTS.reduce((acc, patent) => {
    acc[patent.status] = (acc[patent.status] || 0) + 1;
    return acc;
  }, {} as Record<Patent['status'], number>);

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
            <h1 className="text-3xl font-bold tracking-tight">Patent Review</h1>
          </div>
          <p className="text-muted-foreground">Review and provide feedback on automated TRIZ extractions</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Review Queue</CardTitle>
              <CardDescription>
                Patents awaiting review after automated analysis
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 md:ml-auto">
              {filteredPatents.length} Patent{filteredPatents.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, number, inventor..."
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
                    checked={statusFilter.includes('processing')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'processing'] 
                          : statusFilter.filter(s => s !== 'processing')
                      );
                    }}
                  >
                    Processing
                    <Badge className="ml-auto bg-blue-50 text-blue-700 font-normal">
                      {statusCounts.processing || 0}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('analyzed')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'analyzed'] 
                          : statusFilter.filter(s => s !== 'analyzed')
                      );
                    }}
                  >
                    Analyzed
                    <Badge className="ml-auto bg-amber-50 text-amber-700 font-normal">
                      {statusCounts.analyzed || 0}
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
                    <Badge className="ml-auto bg-green-50 text-green-700 font-normal">
                      {statusCounts.reviewed || 0}
                    </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes('error')}
                    onCheckedChange={(checked) => {
                      setStatusFilter(
                        checked 
                          ? [...statusFilter, 'error'] 
                          : statusFilter.filter(s => s !== 'error')
                      );
                    }}
                  >
                    Error
                    <Badge className="ml-auto bg-red-50 text-red-700 font-normal">
                      {statusCounts.error || 0}
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
          
          {filteredPatents.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Patents Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {statusFilter.length === 0 
                  ? "Please select at least one status filter to view patents."
                  : "No patents match your current search criteria. Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animated-list">
              {filteredPatents.map((patent, index) => (
                <div key={patent.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <PatentCard patent={patent} className="h-full" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10 shrink-0">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">Review Guidelines</h3>
            <p className="text-muted-foreground">
              Your feedback on the automated TRIZ extraction helps improve the system accuracy. Focus on 
              checking the correctness of identified contradictions and suggested principles.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/admin/review/1">
              Review Next Patent
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentReview;
