export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  // From (Business) Details
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZip: string;
  
  // To (Client) Details
  toName: string;
  toEmail: string;
  toAddress: string;
  toCity: string;
  toState: string;
  toZip: string;
  
  // Items
  items: InvoiceItem[];
  
  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  // Payment Details
  paymentTerms: string;
  notes?: string;
}
