import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from '@/components/Dashboard';
import CrateCard from '@/components/CrateCard';
import WarehouseLayout from '@/components/WarehouseLayout';
import ScannerInterface from '@/components/ScannerInterface';
import { WarehouseStats, Crate, WarehouseLine } from '@/types/warehouse';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, LayoutGrid, BarChart3, Scan, Package } from 'lucide-react';

// Mock data
const mockStats: WarehouseStats = {
  total_crates: 1247,
  available_capacity: 156,
  occupancy_rate: 78,
  pending_deliveries: 23,
  recent_arrivals: 8
};

const mockCrates: Crate[] = [
  {
    id: 'CR-001234',
    barcode: 'WH001234',
    customer_id: 'CUST001',
    customer_name: 'ABC Manufacturing Corp',
    arrival_date: '2024-01-15T10:30:00Z',
    current_line: 15,
    status: 'available',
    dimensions: { length: 120, width: 80, height: 100 },
    weight: 450,
    contents_description: 'Industrial machinery parts - Motors and components',
    last_updated: '2024-01-15T10:30:00Z',
    created_by: 'operator001'
  },
  {
    id: 'CR-005678',
    barcode: 'WH005678', 
    customer_id: 'CUST002',
    customer_name: 'Global Logistics Ltd',
    arrival_date: '2024-01-14T14:15:00Z',
    departure_date: '2024-01-20T09:00:00Z',
    current_line: 8,
    status: 'scheduled_delivery',
    dimensions: { length: 100, width: 100, height: 150 },
    weight: 320,
    contents_description: 'Electronics - Computer servers and networking equipment',
    last_updated: '2024-01-16T11:20:00Z',
    created_by: 'operator002'
  },
  {
    id: 'CR-009012',
    barcode: 'WH009012',
    customer_id: 'CUST003', 
    customer_name: 'TechFlow Solutions',
    arrival_date: '2024-01-16T16:45:00Z',
    current_line: 22,
    status: 'occupied',
    dimensions: { length: 140, width: 90, height: 120 },
    weight: 680,
    contents_description: 'Automotive parts - Engine components and transmission systems',
    last_updated: '2024-01-16T16:45:00Z',
    created_by: 'operator001'
  },
  {
    id: 'CR-003456',
    barcode: 'WH003456',
    customer_id: 'CUST004',
    customer_name: 'Steel Works Inc',
    arrival_date: '2024-01-13T08:20:00Z',
    current_line: 5,
    status: 'in_transit',
    dimensions: { length: 200, width: 120, height: 80 },
    weight: 890,
    contents_description: 'Raw materials - Steel beams and construction materials',
    last_updated: '2024-01-17T13:10:00Z',
    created_by: 'operator003'
  }
];

const mockLines: WarehouseLine[] = [
  {
    line_number: 1,
    capacity: 50,
    current_occupancy: 42,
    crates: ['CR-001', 'CR-002'],
    location_coordinates: { x: 0, y: 0, zone: 'A' },
    status: 'active',
    last_inspection: '2024-01-15T10:00:00Z'
  },
  {
    line_number: 2,
    capacity: 50,
    current_occupancy: 50,
    crates: ['CR-003', 'CR-004'],
    location_coordinates: { x: 0, y: 1, zone: 'A' },
    status: 'full',
    last_inspection: '2024-01-14T09:30:00Z'
  },
  {
    line_number: 3,
    capacity: 40,
    current_occupancy: 0,
    crates: [],
    location_coordinates: { x: 1, y: 0, zone: 'B' },
    status: 'maintenance',
    last_inspection: '2024-01-10T14:20:00Z'
  },
  // Add more mock lines...
  ...Array.from({ length: 17 }, (_, i) => ({
    line_number: i + 4,
    capacity: 45,
    current_occupancy: Math.floor(Math.random() * 45),
    crates: [],
    location_coordinates: { x: i % 5, y: Math.floor(i / 5), zone: String.fromCharCode(65 + (i % 3)) },
    status: Math.random() > 0.1 ? 'active' : 'maintenance',
    last_inspection: '2024-01-15T10:00:00Z'
  } as WarehouseLine))
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filteredCrates = mockCrates.filter(crate => 
    crate.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crate.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crate.contents_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCrateEdit = (crate: Crate) => {
    console.log('Edit crate:', crate);
  };

  const handleCrateView = (crate: Crate) => {
    console.log('View crate:', crate);
  };

  const handleLineClick = (line: WarehouseLine) => {
    console.log('Line clicked:', line);
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto p-6">
        {/* Main Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Sassy's Warehouse
          </h1>
          <p className="text-white/80 text-lg">Professional Crate Management System</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] glass-card p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="crates" className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              Crates
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <LayoutGrid className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard stats={mockStats} />
          </TabsContent>

          <TabsContent value="crates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Crate Management</h2>
                <p className="text-muted-foreground">Track and manage all warehouse crates</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="glass">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Crates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCrates.map((crate) => (
                <CrateCard
                  key={crate.id}
                  crate={crate}
                  onEdit={handleCrateEdit}
                  onView={handleCrateView}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout">
            <WarehouseLayout lines={mockLines} onLineClick={handleLineClick} />
          </TabsContent>

          <TabsContent value="scanner">
            <ScannerInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
