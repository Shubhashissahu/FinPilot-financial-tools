export interface Person {
  id: string;
  name: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[];
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