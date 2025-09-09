import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Scan, Camera, Type, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCamera } from '@/hooks/useCamera';
import { Capacitor } from '@capacitor/core';

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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { takePicture, isSupported } = useCamera();

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

  const handleCameraScan = async () => {
    try {
      setIsScanning(true);
      
      if (Capacitor.isNativePlatform() || navigator.mediaDevices) {
        // Use real camera
        const imageDataUrl = await takePicture();
        setCapturedImage(imageDataUrl);
        
        // Simulate barcode processing from image
        // In a real app, you'd use a barcode detection library here
        await processImageForBarcode(imageDataUrl);
      } else {
        // Fallback to mock scan
        const mockBarcodes = ['WH001234', 'WH005678', 'WH009999'];
        const randomCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        await mockScan(randomCode);
      }
    } catch (error) {
      console.error('Camera scan failed:', error);
      setIsScanning(false);
    }
  };

  const processImageForBarcode = async (imageDataUrl: string) => {
    // Simulate processing time
    setTimeout(() => {
      // For demo, randomly assign a barcode result
      const mockBarcodes = ['WH001234', 'WH005678', 'WH009999'];
      const randomCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
      
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
          barcode: randomCode, 
          found: false 
        }
      ];
      
      const result = mockResults.find(r => r.barcode === randomCode) || mockResults[2];
      setScanResult(result);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualScan = () => {
    if (manualCode.trim()) {
      mockScan(manualCode.trim());
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setManualCode('');
    setCapturedImage(null);
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
              {/* Camera View */}
              <div className="aspect-video bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured barcode" 
                    className="w-full h-full object-cover"
                  />
                ) : isScanning ? (
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warehouse-primary mx-auto" />
                    <p className="text-white text-sm">
                      {Capacitor.isNativePlatform() ? 'Processing image...' : 'Opening camera...'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 text-neutral-400 mx-auto" />
                    <p className="text-neutral-400 text-sm">
                      {isSupported ? 'Tap to open camera' : 'Tap to select image'}
                    </p>
                  </div>
                )}
                
                {/* Scanner Overlay */}
                {!capturedImage && (
                  <div className="absolute inset-4 border-2 border-warehouse-primary rounded-lg opacity-60">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-warehouse-primary" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-warehouse-primary" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-warehouse-primary" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-warehouse-primary" />
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleCameraScan}
                disabled={isScanning}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isScanning ? 'Processing...' : isSupported ? 'Open Camera' : 'Select Image'}
              </Button>
              
              {capturedImage && !isScanning && (
                <Button 
                  variant="outline"
                  onClick={() => setCapturedImage(null)}
                  className="w-full"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Take Another Photo
                </Button>
              )}
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
                  <Button variant="outline" className="flex-1" onClick={() => console.log('View details for', scanResult.crateId)}>
                    View Details
                  </Button>
                  <Button className="flex-1 bg-warehouse-primary" onClick={() => console.log('Update status for', scanResult.crateId)}>
                    Update Status
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  No crate found with barcode: <span className="font-medium">{scanResult.barcode}</span>
                </p>
                <Button variant="outline" onClick={() => console.log('Register new crate with barcode:', scanResult.barcode)}>
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