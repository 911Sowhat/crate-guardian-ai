export type CrateStatus = 'available' | 'occupied' | 'scheduled_delivery' | 'in_transit';

export interface Crate {
  id: string;
  barcode: string;
  customer_id: string;
  customer_name: string;
  arrival_date: string;
  departure_date?: string;
  current_line: number;
  status: CrateStatus;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  contents_description: string;
  last_updated: string;
  created_by: string;
}

export interface WarehouseLine {
  line_number: number;
  capacity: number;
  current_occupancy: number;
  crates: string[];
  location_coordinates: {
    x: number;
    y: number;
    zone: string;
  };
  status: 'active' | 'maintenance' | 'full';
  last_inspection: string;
}

export interface WarehouseStats {
  total_crates: number;
  available_capacity: number;
  occupancy_rate: number;
  pending_deliveries: number;
  recent_arrivals: number;
}