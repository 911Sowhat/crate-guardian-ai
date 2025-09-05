import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, BarChart3, Truck, AlertTriangle, Scan, Plus } from 'lucide-react';
import { WarehouseStats } from '@/types/warehouse';

interface DashboardProps {
  stats: WarehouseStats;
}

const StatCard = ({ title, value, icon: Icon, trend, description }: {
  title: string;
  value: string | number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}) => (
  <Card className="card-hover">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-warehouse-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'} 
               className="mt-2 text-xs">
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} Trend
        </Badge>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warehouse Dashboard</h1>
          <p className="text-muted-foreground">Monitor your crate inventory and operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Scan className="h-4 w-4 mr-2" />
            Scan Crate
          </Button>
          <Button className="bg-gradient-primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Crate
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Crates"
          value={stats.total_crates}
          icon={Package}
          trend="up"
          description="Active inventory"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancy_rate}%`}
          icon={BarChart3}
          trend={stats.occupancy_rate > 80 ? 'up' : 'neutral'}
          description="Warehouse utilization"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pending_deliveries}
          icon={Truck}
          trend={stats.pending_deliveries > 10 ? 'up' : 'neutral'}
          description="Scheduled for pickup"
        />
        <StatCard
          title="Available Capacity"
          value={stats.available_capacity}
          icon={AlertTriangle}
          trend={stats.available_capacity < 100 ? 'down' : 'up'}
          description="Remaining slots"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-warehouse-primary" />
              Recent Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                  <div>
                    <p className="font-medium">Crate #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Customer ABC Corp</p>
                  </div>
                  <Badge className="bg-status-available text-white">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-warehouse-secondary" />
              Scheduled Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-subtle">
                  <div>
                    <p className="font-medium">Crate #{2000 + i}</p>
                    <p className="text-sm text-muted-foreground">Due: Today {10 + i}:00 AM</p>
                  </div>
                  <Badge className="bg-status-scheduled text-white">Scheduled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}