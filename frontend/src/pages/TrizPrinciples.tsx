import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrizPrinciples } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define TypeScript interface for TRIZ Principle
interface TrizPrinciple {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

const TrizPrinciples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [principles, setPrinciples] = useState<TrizPrinciple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrinciples = async () => {
      try {
        setLoading(true);
        const data = await getTrizPrinciples();
        
        // Transform data into array format
        const principlesArray = Object.entries(data).map(([id, details]: [string, any]) => ({
          id,
          name: details.name,
          description: details.description,
          examples: details.examples || []
        }));
        
        setPrinciples(principlesArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching TRIZ principles:', err);
        setError('Failed to load TRIZ principles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrinciples();
  }, []);
  
  // Filter principles based on search term
  const filteredPrinciples = principles.filter(principle => 
    principle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    principle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (principle.examples && principle.examples.some(ex => 
      typeof ex === 'string' && ex.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <h1 className="text-lg font-semibold">Patent Analytics Hub</h1>
          </Link>
          <nav className="ml-auto flex gap-4">
            <Link to="/search" className="text-sm font-medium">Search</Link>
            <Link to="/admin" className="text-sm font-medium">Admin Portal</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">40 TRIZ Inventive Principles</h1>
            <p className="text-muted-foreground max-w-[800px]">
              TRIZ provides 40 principles for innovative problem-solving. These principles represent patterns 
              of invention that appear across different industries and sciences.
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search principles by name, description or examples..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner className="h-8 w-8" />
              <span className="ml-2">Loading principles...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error}</AlertDescription>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrinciples.map((principle) => (
                <Card key={principle.id} id={`principle-${principle.id}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {principle.id}. {principle.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">{principle.description}</p>
                    {principle.examples && principle.examples.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Examples:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {principle.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">{example}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && !error && filteredPrinciples.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No principles match your search criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrizPrinciples;
