import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Patent } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PatentCardProps {
  patent: Patent;
  className?: string;
  variant?: 'default' | 'compact';
}

const PatentCard: React.FC<PatentCardProps> = ({ patent, className, variant = 'default' }) => {
  const getStatusDetails = (status: Patent['status']) => {
    switch (status) {
      case 'processing':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          icon: <Clock className="h-4 w-4" />,
          label: 'Processing',
          description: 'Patent is currently being analyzed.'
        };
      case 'analyzed':
        return {
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          icon: <FileText className="h-4 w-4" />,
          label: 'Ready',
          description: 'Ready for review.'
        };
      case 'reviewed':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Reviewed',
          description: 'Patent has been reviewed and approved.'
        };
      case 'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          icon: <AlertTriangle className="h-4 w-4" />,
          label: 'Error',
          description: 'An error occurred during analysis.'
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          icon: <FileText className="h-4 w-4" />,
          label: 'Unknown',
          description: 'Unknown status.'
        };
    }
  };
  
  const statusDetails = getStatusDetails(patent.status);
  const isReviewable = patent.status === 'analyzed' || patent.status === 'reviewed';
  
  if (variant === 'compact') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium">{patent.title}</h4>
            <p className="text-xs text-muted-foreground">Patent #{patent.patent_number}</p>
          </div>
          <Badge 
            variant="outline"
            className={cn("font-normal text-xs", 
              patent.status === 'processing' && "bg-blue-50 text-blue-700",
              patent.status === 'analyzed' && "bg-amber-50 text-amber-700",
              patent.status === 'reviewed' && "bg-green-50 text-green-700",
              patent.status === 'error' && "bg-red-50 text-red-700",
            )}
          >
            {statusDetails.label}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Filed: {new Date(patent.filing_date).toLocaleDateString()}
          </p>
          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
            <Link to={`/admin/review/${patent.id}`}>
              Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={cn("transition-all hover:border-primary/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{patent.title}</CardTitle>
          <Badge 
            variant="outline"
            className={cn("font-normal", 
              patent.status === 'processing' && "bg-blue-50 text-blue-700",
              patent.status === 'analyzed' && "bg-amber-50 text-amber-700",
              patent.status === 'reviewed' && "bg-green-50 text-green-700",
              patent.status === 'error' && "bg-red-50 text-red-700",
            )}
          >
            {statusDetails.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium">Patent #:</span> {patent.patent_number}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Filed:</span> {new Date(patent.filing_date).toLocaleDateString()}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Inventors:</span> {patent.inventor}
          </p>
          <p className="text-muted-foreground line-clamp-2">
            <span className="font-medium">Abstract:</span> {patent.abstract}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          <div className={cn("flex items-center gap-1.5", statusDetails.color)}>
            {statusDetails.icon}
            <span className="text-xs">{statusDetails.description}</span>
          </div>
          
          <Button asChild size="sm" variant={isReviewable ? "default" : "outline"} disabled={patent.status === 'error'}>
            <Link to={patent.status !== 'error' ? `/admin/review/${patent.id}` : '#'}>
              {isReviewable ? "Review" : "View Details"}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PatentCard;
