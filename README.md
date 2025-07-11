# Invoice Generator

A modern web application built with Next.js that allows users to create professional invoices and export them as PDF files.

## Features

- **Invoice Creation**: Comprehensive form for entering invoice details
- **Business & Client Information**: Separate sections for sender and recipient details
- **Dynamic Item Management**: Add/remove invoice items with automatic calculations
- **Tax Calculations**: Configurable tax rates with automatic computation
- **PDF Export**: Generate professional PDF invoices for download
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Built-in validation to ensure data integrity

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: @react-pdf/renderer
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ddecoen/invoice_generator.git
cd invoice_generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Invoice Details**: Enter invoice number, date, and due date
2. **Business Information**: Fill in your business details (sender)
3. **Client Information**: Enter client details (recipient)
4. **Add Items**: Add invoice line items with descriptions, quantities, and rates
5. **Payment Details**: Set tax rate, payment terms, and additional notes
6. **Generate PDF**: Click "Generate Invoice PDF" to download the invoice

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   └── InvoiceForm.tsx     # Main invoice form component
├── types/
│   └── invoice.ts          # TypeScript interfaces
└── utils/
    └── pdfGenerator.tsx    # PDF generation logic
```

## Features in Detail

### Form Validation
- All required fields are validated
- Email format validation
- Numeric validation for quantities, rates, and tax
- Dynamic error messages

### PDF Generation
- Professional invoice layout
- Automatic calculations
- Company and client information
- Itemized billing
- Tax calculations
- Payment terms and notes

### Responsive Design
- Mobile-first approach
- Optimized for various screen sizes
- Touch-friendly interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
