import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, MapPin, Weight, Ruler, Edit, Eye } from 'lucide-react';
import { Crate, CrateStatus } from '@/types/warehouse';
import { cn } from '@/lib/utils';

interface CrateCardProps {
  crate: Crate;
  onEdit?: (crate: Crate) => void;
  onView?: (crate: Crate) => void;
  className?: string;
}

const getStatusColor = (status: CrateStatus) => {
  const colors = {
    available: 'bg-status-available text-white',
    occupied: 'bg-status-occupied text-white',
    scheduled_delivery: 'bg-status-scheduled text-white',
    in_transit: 'bg-status-transit text-white'
  };
  return colors[status];
};

const getStatusLabel = (status: CrateStatus) => {
  const labels = {
    available: 'Available',
    occupied: 'Occupied',
    scheduled_delivery: 'Scheduled',
    in_transit: 'In Transit'
  };
  return labels[status];
};

export default function CrateCard({ crate, onEdit, onView, className }: CrateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInWarehouse = () => {
    const arrival = new Date(crate.arrival_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - arrival.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className={cn("card-hover transition-all duration-200 border-l-4", 
      crate.status === 'available' ? 'border-l-status-available' :
      crate.status === 'occupied' ? 'border-l-status-occupied' :
      crate.status === 'scheduled_delivery' ? 'border-l-status-scheduled' :
      'border-l-status-transit', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-warehouse-primary" />
            <div>
              <h3 className="font-semibold text-foreground">{crate.barcode}</h3>
              <p className="text-sm text-muted-foreground">ID: {crate.id}</p>
            </div>
          </div>
          <Badge className={getStatusColor(crate.status)}>
            {getStatusLabel(crate.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div>
          <p className="font-medium text-foreground">{crate.customer_name}</p>
          <p className="text-sm text-muted-foreground">Customer ID: {crate.customer_id}</p>
        </div>

        {/* Location & Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-warehouse-accent" />
            <span>Line {crate.current_line}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-warehouse-accent" />
            <span>{getDaysInWarehouse()} days</span>
          </div>
        </div>

        {/* Dimensions & Weight */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-neutral-400" />
            <span>{crate.dimensions.length}×{crate.dimensions.width}×{crate.dimensions.height}</span>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-neutral-400" />
            <span>{crate.weight} kg</span>
          </div>
        </div>

        {/* Contents */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">Contents:</p>
          <p className="text-sm text-foreground truncate">{crate.contents_description}</p>
        </div>

        {/* Arrival Date */}
        <div className="text-sm">
          <span className="text-muted-foreground">Arrived: </span>
          <span className="text-foreground font-medium">{formatDate(crate.arrival_date)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView?.(crate)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-warehouse-primary hover:bg-warehouse-primary-light"
            onClick={() => onEdit?.(crate)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}