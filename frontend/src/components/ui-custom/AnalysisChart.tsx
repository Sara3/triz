
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { AnalyticsSummary } from '@/lib/types';
import { Badge } from "@/components/ui/badge";

interface AnalysisChartProps {
  data: AnalyticsSummary;
  variant: 'status' | 'principles' | 'contradictions';
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ data, variant }) => {
  // Get data based on variant
  const getItems = () => {
    if (variant === 'status') {
      return Object.entries(data.patents_by_status).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
      }));
    } else if (variant === 'principles') {
      return data.top_principles.map(item => ({
        name: item.principle,
        value: item.count
      }));
    } else {
      return data.top_contradictions.map(item => ({
        name: `${item.contradiction.improving_parameter} / ${item.contradiction.worsening_parameter}`,
        value: item.count
      }));
    }
  };

  const items = getItems();

  // Get title based on variant
  const getTitle = () => {
    switch (variant) {
      case 'status':
        return 'Patents by Status';
      case 'principles':
        return 'Top TRIZ Principles';
      case 'contradictions':
        return 'Top Contradictions';
    }
  };

  // Get description based on variant
  const getDescription = () => {
    switch (variant) {
      case 'status':
        return 'Distribution of patents by their current status';
      case 'principles':
        return 'Most frequently suggested TRIZ principles';
      case 'contradictions':
        return 'Most common contradictions identified in patents';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
              <span className="text-sm">{item.name}</span>
              <Badge variant="outline">{item.value}</Badge>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisChart;
