
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Info, ExternalLink, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TRIZ_MATRIX, TRIZ_PRINCIPLES } from '@/lib/mock-data';
import { ENGINEERING_PARAMETERS } from '@/lib/triz-constants';
import PatentCard from '@/components/ui-custom/PatentCard';

const Index = () => {
  const [selectedCell, setSelectedCell] = useState<{
    improving: string;
    worsening: string;
    principles: number[];
  } | null>(null);
  
  const [selectedImprovingParameter, setSelectedImprovingParameter] = useState<string | null>(null);
  const [selectedWorseningParameter, setSelectedWorseningParameter] = useState<string | null>(null);
  
  const matrixRef = useRef<HTMLDivElement>(null);

  const parameters = Array.from(new Set([
    ...MOCK_TRIZ_MATRIX.map(item => item.improving_parameter),
    ...MOCK_TRIZ_MATRIX.map(item => item.worsening_parameter)
  ])).sort();

  const getCell = (improving: string, worsening: string) => {
    if (improving === worsening) return { content: '•', isActive: false };
    
    const matrixItem = MOCK_TRIZ_MATRIX.find(
      item => item.improving_parameter === improving && item.worsening_parameter === worsening
    );
    
    if (matrixItem) {
      return { 
        content: matrixItem.suggested_principles.join(', '),
        isActive: true,
        principles: matrixItem.suggested_principles
      };
    }
    
    return { content: '', isActive: false };
  };

  const handleCellClick = (improving: string, worsening: string) => {
    const matrixItem = MOCK_TRIZ_MATRIX.find(
      item => item.improving_parameter === improving && item.worsening_parameter === worsening
    );
    
    if (matrixItem) {
      setSelectedCell({
        improving,
        worsening,
        principles: matrixItem.suggested_principles
      });
      
      // Set the dropdowns to match the selected cell
      setSelectedImprovingParameter(improving);
      setSelectedWorseningParameter(worsening);
      
      setTimeout(() => {
        const selectedPrinciplesElement = document.getElementById('selected-principles');
        if (selectedPrinciplesElement) {
          selectedPrinciplesElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const getPrincipleById = (id: number) => {
    return TRIZ_PRINCIPLES.find(principle => principle.id === id);
  };

  const getRelatedPatents = () => {
    if (!selectedCell) return [];
    
    return [
      {
        id: "pat-001",
        patent_number: "US9876543",
        filename: "patent-9876543.pdf",
        title: `Improved ${selectedCell.improving} with minimal ${selectedCell.worsening} impact`,
        filing_date: "2023-04-15",
        upload_date: "2023-05-20",
        raw_text: "Lorem ipsum dolor sit amet...",
        abstract: `A novel approach to improving ${selectedCell.improving} while minimizing the negative effects on ${selectedCell.worsening}. Using principles ${selectedCell.principles.join(', ')}.`,
        inventor: "Jane Doe, John Smith",
        assignee: "TechCorp Inc.",
        is_prior_art: false,
        is_competitor: true,
        keywords: `${selectedCell.improving}, ${selectedCell.worsening}, innovation`,
        status: "analyzed" as const
      },
      {
        id: "pat-002",
        patent_number: "US8765432",
        filename: "patent-8765432.pdf",
        title: `Method for optimizing ${selectedCell.improving}`,
        filing_date: "2022-10-05",
        upload_date: "2023-01-12",
        raw_text: "Consectetur adipiscing elit...",
        abstract: `This invention provides a method for optimizing ${selectedCell.improving} in industrial applications while controlling ${selectedCell.worsening} parameters.`,
        inventor: "Robert Johnson",
        assignee: "InnovSolutions LLC",
        is_prior_art: true,
        is_competitor: false,
        keywords: `${selectedCell.improving}, optimization, industrial`,
        status: "reviewed" as const
      }
    ];
  };

  const isHighlighted = (improving: string, worsening: string) => {
    // Only highlight the specific cell that matches both selected parameters
    return selectedImprovingParameter === improving && selectedWorseningParameter === worsening;
  };

  // When either dropdown changes, update the selected cell if both parameters are selected
  const updateSelectedCellFromParameters = () => {
    if (selectedImprovingParameter && selectedWorseningParameter) {
      const matrixItem = MOCK_TRIZ_MATRIX.find(
        item => item.improving_parameter === selectedImprovingParameter && 
               item.worsening_parameter === selectedWorseningParameter
      );
      
      if (matrixItem) {
        setSelectedCell({
          improving: selectedImprovingParameter,
          worsening: selectedWorseningParameter,
          principles: matrixItem.suggested_principles
        });
        
        setTimeout(() => {
          const selectedPrinciplesElement = document.getElementById('selected-principles');
          if (selectedPrinciplesElement) {
            selectedPrinciplesElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        setSelectedCell(null);
      }
    }
  };

  // Call this when parameter selections change
  React.useEffect(() => {
    updateSelectedCellFromParameters();
  }, [selectedImprovingParameter, selectedWorseningParameter]);

  const relatedPatents = getRelatedPatents();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <h1 className="text-lg font-semibold">Patent Analytics Hub</h1>
          <nav className="ml-auto flex gap-4">
            <Link to="/admin" className="text-sm font-medium">Admin Portal</Link>
            <Link to="/principles" className="text-sm font-medium">TRIZ Principles</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">TRIZ Contradiction Matrix</h1>
            <p className="text-muted-foreground max-w-[800px] mx-auto">
              The TRIZ contradiction matrix helps solve engineering problems by identifying inventive principles 
              that can resolve technical contradictions.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <CardTitle>Complete TRIZ Contradiction Matrix</CardTitle>
                    <CardDescription>
                      Click on a cell to see the recommended principles for resolving that contradiction
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedImprovingParameter || undefined} 
                      onValueChange={(value) => {
                        if (value === "none") {
                          setSelectedImprovingParameter(null);
                        } else {
                          setSelectedImprovingParameter(value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select improving parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Clear selection)</SelectItem>
                        {ENGINEERING_PARAMETERS.map((param, idx) => (
                          <SelectItem key={idx} value={param}>
                            {param}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={selectedWorseningParameter || undefined} 
                      onValueChange={(value) => {
                        if (value === "none") {
                          setSelectedWorseningParameter(null);
                        } else {
                          setSelectedWorseningParameter(value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select worsening parameter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Clear selection)</SelectItem>
                        {ENGINEERING_PARAMETERS.map((param, idx) => (
                          <SelectItem key={idx} value={param}>
                            {param}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-4">
                        <p className="text-sm">
                          This matrix shows the relationship between improving parameters (rows) and 
                          worsening parameters (columns). The numbers in each cell represent the 
                          inventive principles that can help resolve the contradiction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <div ref={matrixRef} className="overflow-auto max-h-[70vh]">
                  <div className="min-w-[1200px]">
                    <Table className="border-collapse w-full">
                      <TableHeader>
                        <TableRow className="bg-muted">
                          <TableHead className="p-2 border sticky top-0 left-0 z-10 bg-muted min-w-[180px]">
                            <div className="font-medium text-left">
                              Improving ↓ / Worsening →
                            </div>
                          </TableHead>
                          {parameters.map((param, index) => (
                            <TableHead 
                              key={index} 
                              className={`p-2 border sticky top-0 z-[5] bg-muted min-w-[120px] ${
                                selectedWorseningParameter === param ? 'bg-primary/10' : ''
                              }`}
                            >
                              <div className="font-medium text-center">
                                {param}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parameters.map((improvingParam, rowIndex) => (
                          <TableRow 
                            key={rowIndex}
                            className={selectedImprovingParameter === improvingParam ? 'bg-primary/5' : ''}
                          >
                            <TableCell className="p-2 border font-medium sticky left-0 z-[5] bg-background min-w-[180px]">
                              <div>
                                {improvingParam}
                              </div>
                            </TableCell>
                            {parameters.map((worseningParam, colIndex) => {
                              const cell = getCell(improvingParam, worseningParam);
                              const isHighlightedCell = isHighlighted(improvingParam, worseningParam);
                              
                              return (
                                <TableCell 
                                  key={colIndex} 
                                  className={`p-2 border text-center ${
                                    selectedCell?.improving === improvingParam && 
                                    selectedCell?.worsening === worseningParam
                                      ? 'bg-primary/20 ring-2 ring-primary/30'
                                      : isHighlightedCell
                                        ? 'bg-primary/10 ring-1 ring-primary/20'
                                        : cell.isActive ? 'cursor-pointer hover:bg-muted/50' : ''
                                  }`}
                                  onClick={() => cell.isActive && handleCellClick(improvingParam, worseningParam)}
                                >
                                  {cell.isActive ? (
                                    <span className={`${
                                      selectedCell?.improving === improvingParam &&
                                      selectedCell?.worsening === worseningParam
                                        ? 'text-primary font-medium'
                                        : 'text-primary/80'
                                    }`}>
                                      {cell.principles?.join(', ')}
                                    </span>
                                  ) : (
                                    cell.content
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 pl-2">
                  Note: Numbers in cells correspond to TRIZ Inventive Principles (1-40)
                </div>
              </CardContent>
            </Card>

            {selectedCell && (
              <Card id="selected-principles">
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Inventive Principles</CardTitle>
                  <CardDescription>
                    For the contradiction: Improving <Badge className="mx-1 font-normal">{selectedCell.improving}</Badge> while 
                    avoiding worsening <Badge className="mx-1 font-normal">{selectedCell.worsening}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCell.principles.map(principleId => {
                      const principle = getPrincipleById(principleId);
                      return principle && (
                        <div key={principleId} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{principle.id}. {principle.name}</h4>
                            <Badge variant="outline">{principle.id}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{principle.description}</p>
                          {principle.examples.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium mt-2 mb-1">Examples:</h5>
                              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                {principle.examples.map((example, idx) => (
                                  <li key={idx}>{example}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedCell && relatedPatents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Patents</CardTitle>
                  <CardDescription>
                    Patents that use the principles for this contradiction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedPatents.map(patent => (
                      <PatentCard key={patent.id} patent={patent} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
