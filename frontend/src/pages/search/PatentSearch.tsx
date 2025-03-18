import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Building2, User, FileText, Eye, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPatents } from '@/lib/api';

// Define TypeScript interface for Patent
interface Patent {
  id: string;
  patent_number: string;
  title: string;
  abstract: string;
  filing_date: string;
  upload_date: string;
  inventor: string;
  assignee: string;
  status: string;
  filename: string;
}

const PatentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch patents when component mounts or filters change
    fetchPatents();
  }, [statusFilter]);

  const fetchPatents = async () => {
    try {
      setLoading(true);
      const response = await getPatents(searchTerm, statusFilter);
      setPatents(response.patents || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching patents:', err);
      setError('Failed to load patents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatents();
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(prevFilters => {
      if (prevFilters.includes(status)) {
        return prevFilters.filter(item => item !== status);
      } else {
        return [...prevFilters, status];
      }
    });
  };

  return (
    <div className="w-full h-full">
      <div className="container max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">Patent Search</h1>
            <Link to="/admin/upload">
              <Button>Upload New Patent</Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search patents by title, abstract, inventor..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Filter className="h-4 w-4" /> Filters:
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-pending" 
                      checked={statusFilter.includes('pending')} 
                      onCheckedChange={() => handleStatusFilterChange('pending')}
                    />
                    <Label htmlFor="filter-pending">Pending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-analyzed" 
                      checked={statusFilter.includes('analyzed')} 
                      onCheckedChange={() => handleStatusFilterChange('analyzed')}
                    />
                    <Label htmlFor="filter-analyzed">Analyzed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-reviewed" 
                      checked={statusFilter.includes('reviewed')} 
                      onCheckedChange={() => handleStatusFilterChange('reviewed')}
                    />
                    <Label htmlFor="filter-reviewed">Reviewed</Label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner className="h-8 w-8" />
              <span className="ml-2">Loading patents...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error}</AlertDescription>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchPatents}
              >
                Retry
              </Button>
            </Alert>
          ) : (
            <div className="space-y-4">
              {patents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No patents found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                patents.map(patent => (
                  <Card key={patent.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <CardTitle className="text-lg">
                          {patent.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patent.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                            patent.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {patent.status.charAt(0).toUpperCase() + patent.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {patent.abstract}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Filed: {new Date(patent.filing_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Inventor: {patent.inventor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Assignee: {patent.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>Patent #: {patent.patent_number}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex justify-end gap-2">
                      <Link to={`/admin/review/${patent.id}`}>
                        <Button variant="secondary" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" /> View Details
                        </Button>
                      </Link>
                      <Link to={`/api/patents/${patent.id}/file`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatentSearch;
