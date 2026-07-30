export interface Person {
  id: string;
  name: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;       // per-unit price
  assignedTo: string[]; // Person ids
  isShared: boolean;
}

export interface PersonItemShare {
  itemId: string;
  name: string;
  amount: number;
}

export interface PersonBillResult {
  personId: string;
  name: string;
  items: PersonItemShare[];
  subtotal: number;
  gstAmount: number;
  tipAmount: number;
  total: number;
}

export interface ExtractedReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ExtractedReceipt {
  restaurantName: string | null;
  items: ExtractedReceiptItem[];
  gstPercentage: number | null;
  subtotal: number;
  total: number;
}