
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  TrizContradiction, 
  TrizPrinciple 
} from '@/lib/types';
import { TRIZ_PRINCIPLES } from '@/lib/mock-data';
import { 
  DEFAULT_PRINCIPLES,
  isContradictionInMatrix,
  getPrincipleDetailsByName 
} from '@/lib/triz-utils';

interface TrizMatrixProps {
  contradictions: {
    contradiction: TrizContradiction;
    suggested_principles: string[];
  }[];
  className?: string;
}

const TrizMatrix: React.FC<TrizMatrixProps> = ({ contradictions, className }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAllPrinciples, setShowAllPrinciples] = useState<Record<number, boolean>>({});

  const toggleShowAll = (index: number) => {
    setShowAllPrinciples(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (contradictions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-medium">TRIZ Contradictions</CardTitle>
          <CardDescription>
            No contradictions have been identified for this patent yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">TRIZ Contradictions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4">
                <p className="text-sm">
                  TRIZ identifies contradictions where improving one parameter leads to the deterioration
                  of another, and suggests inventive principles to resolve them.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Identified contradictions and suggested principles for resolution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={expanded !== null ? expanded.toString() : undefined}
          onValueChange={(value) => setExpanded(value === "" ? null : parseInt(value))}
        >
          {contradictions.map((item, index) => {
            const isShowingAll = showAllPrinciples[index] || false;
            const displayedPrinciples = isShowingAll 
              ? item.suggested_principles 
              : item.suggested_principles.slice(0, 3);
            const hasMore = item.suggested_principles.length > 3;
            
            // Check if the contradiction exists in the matrix
            const inMatrix = isContradictionInMatrix(
              item.contradiction.improving_parameter, 
              item.contradiction.worsening_parameter
            );
            
            return (
              <AccordionItem 
                key={index} 
                value={index.toString()}
                className="border border-border rounded-lg mb-3 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 group">
                  <div className="flex flex-col items-start text-left w-full">
                    <div className="flex justify-between w-full">
                      <div>
                        <div className="flex space-x-1 text-base">
                          <span className="font-medium">Improving:</span>
                          <span className="text-primary">{item.contradiction.improving_parameter}</span>
                        </div>
                        <div className="flex space-x-1 text-base">
                          <span className="font-medium">Worsening:</span>
                          <span className="text-primary">{item.contradiction.worsening_parameter}</span>
                        </div>
                      </div>
                      {!inMatrix && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300 ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Not in Matrix
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  {!inMatrix && (
                    <div className="mb-4 p-3 bg-yellow-50/50 text-yellow-800 border border-yellow-200 rounded-md text-sm">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <p>
                          This contradiction is not found in the standard TRIZ matrix. 
                          The principles shown are either custom suggestions or default recommendations.
                        </p>
                      </div>
                    </div>
                  )}
                
                  <h4 className="text-sm font-medium mb-2">
                    {inMatrix ? "Suggested TRIZ Principles:" : "Recommended Principles:"}
                  </h4>
                  <div className="space-y-3">
                    {displayedPrinciples.map((principle, i) => {
                      const details = getPrincipleDetailsByName(principle);
                      return (
                        <div key={i} className="p-3 bg-accent/30 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium">{principle}</h5>
                            {details && details.id && (
                              <Badge variant="outline" className="text-xs">
                                Principle {details.id}
                              </Badge>
                            )}
                          </div>
                          {details && (
                            <>
                              <p className="text-sm text-muted-foreground mb-2">
                                {details.description}
                              </p>
                              {details.examples && details.examples.length > 0 && (
                                <div className="space-y-1">
                                  <h6 className="text-xs font-medium">Examples:</h6>
                                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                    {details.examples.map((example, j) => (
                                      <li key={j}>{example}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                    
                    {hasMore && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full mt-2 text-primary"
                        onClick={() => toggleShowAll(index)}
                      >
                        {isShowingAll ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show fewer principles
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show all principles
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TrizMatrix;
