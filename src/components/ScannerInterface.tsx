import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Scan, Camera, Type, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanResult {
  barcode: string;
  found: boolean;
  crateId?: string;
  customerName?: string;
  status?: string;
}

export default function ScannerInterface() {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const mockScan = (code: string) => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        { 
          barcode: 'WH001234', 
          found: true, 
          crateId: 'CR-001234',
          customerName: 'ABC Manufacturing Corp',
          status: 'available'
        },
        { 
          barcode: 'WH005678', 
          found: true, 
          crateId: 'CR-005678',
          customerName: 'Global Logistics Ltd',
          status: 'scheduled_delivery'
        },
        { 
          barcode: code, 
          found: false 
        }
      ];
      
      const result = mockResults.find(r => r.barcode === code) || mockResults[2];
      setScanResult(result);
      setIsScanning(false);
    }, 1500);
  };

  const handleCameraScan = () => {
    // Simulate camera scan with random barcode
    const mockBarcodes = ['WH001234', 'WH005678', 'WH009999'];
    const randomCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    mockScan(randomCode);
  };

  const handleManualScan = () => {
    if (manualCode.trim()) {
      mockScan(manualCode.trim());
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setManualCode('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Barcode Scanner</h2>
        <p className="text-muted-foreground">Scan or enter barcode to find crate information</p>
      </div>

      {/* Scan Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-muted p-1">
          <Button
            variant={scanMode === 'camera' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScanMode('camera')}
            className="rounded-md"
          >
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
          <Button
            variant={scanMode === 'manual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setScanMode('manual')}
            className="rounded-md"
          >
            <Type className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>
      </div>

      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-warehouse-primary" />
            {scanMode === 'camera' ? 'Camera Scanner' : 'Manual Entry'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scanMode === 'camera' ? (
            <div className="space-y-4">
              {/* Mock Camera View */}
              <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warehouse-primary mx-auto" />
                    <p className="text-white text-sm">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Scan className="h-12 w-12 text-neutral-400 mx-auto" />
                    <p className="text-neutral-400 text-sm">Position barcode in frame</p>
                  </div>
                )}
                
                {/* Scanner Overlay */}
                <div className="absolute inset-4 border-2 border-warehouse-primary rounded-lg opacity-60">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-warehouse-primary" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-warehouse-primary" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-warehouse-primary" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-warehouse-primary" />
                </div>
              </div>
              
              <Button 
                onClick={handleCameraScan}
                disabled={isScanning}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Barcode</label>
                <Input
                  placeholder="e.g., WH001234"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                />
              </div>
              
              <Button 
                onClick={handleManualScan}
                disabled={!manualCode.trim() || isScanning}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {isScanning ? 'Searching...' : 'Search Crate'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <Card className={cn(
          "border-l-4",
          scanResult.found ? "border-l-status-available" : "border-l-destructive"
        )}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {scanResult.found ? (
                <CheckCircle className="h-5 w-5 text-status-available" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              <CardTitle>
                {scanResult.found ? 'Crate Found' : 'Crate Not Found'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">Barcode: {scanResult.barcode}</p>
            </div>
            
            {scanResult.found ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Crate ID</p>
                  <p className="font-medium">{scanResult.crateId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{scanResult.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={cn(
                    scanResult.status === 'available' ? 'bg-status-available' :
                    scanResult.status === 'scheduled_delivery' ? 'bg-status-scheduled' :
                    'bg-status-occupied',
                    'text-white'
                  )}>
                    {scanResult.status === 'available' ? 'Available' :
                     scanResult.status === 'scheduled_delivery' ? 'Scheduled for Delivery' :
                     'Occupied'}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1 bg-warehouse-primary">
                    Update Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  No crate found with barcode: <span className="font-medium">{scanResult.barcode}</span>
                </p>
                <Button variant="outline">
                  Register New Crate
                </Button>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={resetScan}
              className="w-full mt-4"
            >
              Scan Another
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}