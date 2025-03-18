
import React, { useState } from "react";
import { Check, ChevronsUpDown, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  getAllPrincipleNames, 
  getPrincipleDetailsByName,
  addCustomPrinciple 
} from "@/lib/triz-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PrincipleSelectorProps {
  value: string[];
  onChange: (values: string[]) => void;
  maxSelections?: number;
  className?: string;
  showAutoSuggestions?: boolean;
  autoSuggestedPrinciples?: string[];
  predefinedPrinciples?: string[];
  allowCustomPrinciples?: boolean;
}

const PrincipleSelector: React.FC<PrincipleSelectorProps> = ({
  value = [],
  onChange,
  maxSelections = 4,
  className,
  showAutoSuggestions = false,
  autoSuggestedPrinciples = [],
  predefinedPrinciples,
  allowCustomPrinciples = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'all' | 'selected' | 'suggested'>('all');
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customPrincipleDialogOpen, setCustomPrincipleDialogOpen] = useState(false);
  const [newPrinciple, setNewPrinciple] = useState({
    name: "",
    description: "",
    examples: [""]
  });
  const [principlesRefreshKey, setPrinciplesRefreshKey] = useState(0);

  // Ensure all arrays are valid
  const safeValue = Array.isArray(value) ? value : [];
  const safeAutoSuggested = Array.isArray(autoSuggestedPrinciples) ? autoSuggestedPrinciples : [];
  
  // Get available principles
  const allAvailablePrinciples = React.useMemo(() => {
    // First try predefinedPrinciples, fallback to getAllPrincipleNames()
    const principlesSource = predefinedPrinciples || getAllPrincipleNames();
    // Ensure we have a valid array
    return Array.isArray(principlesSource) ? principlesSource : [];
  }, [predefinedPrinciples, principlesRefreshKey]);

  // Filter principles based on view mode and search query
  const displayedPrinciples = React.useMemo(() => {
    let filteredPrinciples: string[] = [];
    
    // First filter by view mode
    switch (viewMode) {
      case 'selected':
        filteredPrinciples = allAvailablePrinciples.filter(p => safeValue.includes(p));
        break;
      case 'suggested':
        filteredPrinciples = safeAutoSuggested;
        break;
      case 'all':
      default:
        filteredPrinciples = allAvailablePrinciples;
        break;
    }
    
    // Then filter by search if needed
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredPrinciples = filteredPrinciples.filter(
        principle => principle.toLowerCase().includes(query)
      );
    }
    
    return filteredPrinciples;
  }, [allAvailablePrinciples, safeValue, safeAutoSuggested, viewMode, searchQuery]);

  const handleSelect = (currentValue: string) => {
    if (!currentValue) return;
    
    let newValues: string[] = [...safeValue];
    
    if (safeValue.includes(currentValue)) {
      newValues = safeValue.filter((val) => val !== currentValue);
    } else {
      if (safeValue.length < maxSelections) {
        newValues.push(currentValue);
      }
    }
    
    onChange(newValues);
  };

  const removeValue = (valueToRemove: string) => {
    if (!valueToRemove) return;
    onChange(safeValue.filter((val) => val !== valueToRemove));
  };

  const handleSelectAll = (principles: string[]) => {
    if (!Array.isArray(principles)) return;
    
    const newValues = [...safeValue];
    principles.forEach(principle => {
      if (!newValues.includes(principle) && newValues.length < maxSelections) {
        newValues.push(principle);
      }
    });
    
    onChange(newValues);
    setOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddExample = () => {
    setNewPrinciple({
      ...newPrinciple,
      examples: [...newPrinciple.examples, ""]
    });
  };

  const handleRemoveExample = (index: number) => {
    const updatedExamples = [...newPrinciple.examples];
    updatedExamples.splice(index, 1);
    setNewPrinciple({
      ...newPrinciple,
      examples: updatedExamples
    });
  };

  const handleExampleChange = (value: string, index: number) => {
    const updatedExamples = [...newPrinciple.examples];
    updatedExamples[index] = value;
    setNewPrinciple({
      ...newPrinciple,
      examples: updatedExamples
    });
  };

  const handleCreatePrinciple = () => {
    // Validate
    if (!newPrinciple.name.trim()) {
      toast.error("Principle name is required");
      return;
    }

    if (!newPrinciple.description.trim()) {
      toast.error("Description is required");
      return;
    }

    // Filter out empty examples
    const filteredExamples = newPrinciple.examples.filter(ex => ex.trim() !== "");

    // Create the principle
    const createdPrinciple = addCustomPrinciple({
      name: newPrinciple.name,
      description: newPrinciple.description,
      examples: filteredExamples.length > 0 ? filteredExamples : ["No examples provided"]
    });

    // Add the new principle to selection if possible
    if (safeValue.length < maxSelections) {
      onChange([...safeValue, createdPrinciple.name]);
    }

    // Reset form
    setNewPrinciple({
      name: "",
      description: "",
      examples: [""]
    });

    // Close dialog
    setCustomPrincipleDialogOpen(false);
    
    // Refresh principles list
    setPrinciplesRefreshKey(prev => prev + 1);
    
    toast.success(`New principle "${createdPrinciple.name}" added successfully!`);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {safeValue.map((item) => (
          <TooltipProvider key={item}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="secondary" 
                  className="py-1 px-2 cursor-pointer hover:bg-secondary/80 flex items-center"
                >
                  {item}
                  <X 
                    className="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(item);
                    }}
                  />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {getPrincipleDetailsByName(item)?.description || ""}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {safeValue.length > 0
                ? `${safeValue.length} principle${safeValue.length !== 1 ? 's' : ''} selected`
                : "Select principles..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="flex flex-col">
              <div className="flex items-center p-2 border-b">
                <div className="flex-1 mr-2">
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search principles..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {allowCustomPrinciples && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => {
                        setCustomPrincipleDialogOpen(true);
                        setOpen(false);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add New</span>
                    </Button>
                  )}
                  
                  {showAutoSuggestions && safeAutoSuggested.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setViewMode('all')}>
                          View All Principles
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setViewMode('selected')}>
                          View Selected Principles
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setViewMode('suggested')}>
                          View Suggested Principles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleSelectAll(safeAutoSuggested)}>
                          Select All Suggested
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="overflow-hidden">
                {displayedPrinciples.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No principles available
                  </div>
                ) : (
                  <ScrollArea className="h-60">
                    <div className="p-1">
                      {displayedPrinciples.map((principle) => (
                        <div
                          key={principle}
                          className={cn(
                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                            safeValue.includes(principle) ? "bg-accent text-accent-foreground" : ""
                          )}
                          onClick={() => handleSelect(principle)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Checkbox
                              checked={safeValue.includes(principle)}
                              className="mr-1"
                              onCheckedChange={() => handleSelect(principle)}
                            />
                            <span>{principle}</span>
                            {safeAutoSuggested.includes(principle) && showAutoSuggestions && (
                              <Badge variant="outline" className="ml-auto text-xs">Suggested</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
            {safeValue.length >= maxSelections && (
              <div className="p-2 text-xs text-muted-foreground border-t">
                Maximum {maxSelections} principles allowed
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Dialog for adding custom principles */}
      <Dialog open={customPrincipleDialogOpen} onOpenChange={setCustomPrincipleDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New TRIZ Principle</DialogTitle>
            <DialogDescription>
              Create a custom TRIZ principle that will be available for selection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="principle-name">Principle Name</Label>
              <Input 
                id="principle-name" 
                value={newPrinciple.name} 
                onChange={(e) => setNewPrinciple({...newPrinciple, name: e.target.value})}
                placeholder="Enter a concise, descriptive name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newPrinciple.description} 
                onChange={(e) => setNewPrinciple({...newPrinciple, description: e.target.value})}
                placeholder="Briefly describe what this principle entails"
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Examples</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddExample}
                  className="h-8 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Example
                </Button>
              </div>
              <div className="space-y-2">
                {newPrinciple.examples.map((example, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={example} 
                      onChange={(e) => handleExampleChange(e.target.value, index)}
                      placeholder={`Example ${index+1}`}
                    />
                    {newPrinciple.examples.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveExample(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomPrincipleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePrinciple}>
              Add Principle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrincipleSelector;
