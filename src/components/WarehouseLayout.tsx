import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WarehouseLine } from '@/types/warehouse';
import { cn } from '@/lib/utils';
import { MapPin, Package, AlertCircle } from 'lucide-react';

interface WarehouseLayoutProps {
  lines: WarehouseLine[];
  onLineClick?: (line: WarehouseLine) => void;
}

const LineCard = ({ 
  line, 
  onClick 
}: { 
  line: WarehouseLine; 
  onClick?: (line: WarehouseLine) => void 
}) => {
  const getStatusColor = () => {
    if (line.status === 'maintenance') return 'bg-destructive';
    if (line.status === 'full') return 'bg-status-occupied';
    return 'bg-status-available';
  };

  const getOccupancyColor = () => {
    const percentage = (line.current_occupancy / line.capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 75) return 'text-status-scheduled';
    return 'text-status-available';
  };

  const occupancyPercentage = Math.round((line.current_occupancy / line.capacity) * 100);

  return (
    <Card 
      className={cn(
        "warehouse-grid-item cursor-pointer border-2 transition-all duration-200",
        "hover:border-warehouse-primary hover:shadow-md"
      )}
      onClick={() => onClick?.(line)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-warehouse-primary" />
            Line {line.line_number}
          </CardTitle>
          <Badge className={cn("text-white", getStatusColor())}>
            {line.status === 'maintenance' ? 'Maintenance' : 
             line.status === 'full' ? 'Full' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Capacity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-muted-foreground">Capacity</span>
            </div>
            <span className={cn("font-semibold", getOccupancyColor())}>
              {line.current_occupancy}/{line.capacity}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                occupancyPercentage >= 90 ? "bg-destructive" :
                occupancyPercentage >= 75 ? "bg-status-scheduled" :
                "bg-status-available"
              )}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>

          {/* Occupancy Percentage */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className={cn("font-semibold", getOccupancyColor())}>
              {occupancyPercentage}%
            </span>
          </div>

          {/* Zone Info */}
          <div className="text-sm text-muted-foreground">
            Zone: {line.location_coordinates.zone}
          </div>

          {/* Alerts */}
          {(line.status === 'maintenance' || occupancyPercentage >= 90) && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                {line.status === 'maintenance' ? 'Under Maintenance' : 'Near Capacity'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function WarehouseLayout({ lines, onLineClick }: WarehouseLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Warehouse Layout</h2>
          <p className="text-muted-foreground">Visual overview of all storage lines</p>
        </div>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          View Map
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {lines.map((line) => (
          <LineCard 
            key={line.line_number} 
            line={line} 
            onClick={onLineClick}
          />
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warehouse-primary">
                {lines.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Lines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-status-available">
                {lines.filter(l => l.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-status-occupied">
                {lines.filter(l => l.status === 'full').length}
              </div>
              <div className="text-sm text-muted-foreground">Full</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {lines.filter(l => l.status === 'maintenance').length}
              </div>
              <div className="text-sm text-muted-foreground">Maintenance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}