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

## Deployment

### Recommended: Vercel (Easiest)

Since this is a Next.js application, **Vercel** is the recommended deployment platform as it's built by the same team that created Next.js.

#### Quick Deployment Steps:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   cd invoice_generator
   vercel
   ```

3. **Follow the prompts** - Vercel will automatically:
   - Detect it's a Next.js app
   - Configure build settings
   - Connect to your GitHub repository
   - Set up automatic deployments

Your app will be available at a URL like `https://invoice-generator-xyz.vercel.app`

#### Why Vercel?
- ✅ **Zero configuration** - works with existing code as-is
- ✅ **Next.js native support** - built specifically for Next.js apps
- ✅ **Automatic deployments** from GitHub
- ✅ **Free tier** with generous limits
- ✅ **Global CDN** and HTTPS by default
- ✅ **Perfect compatibility** with App Router and React Server Components

### Alternative Deployment Options

#### Netlify
```bash
npm run build
# Deploy the build folder via Netlify's web interface
```
*Note: May require additional configuration for full Next.js feature support*

#### Quick Testing with ngrok
For temporary sharing during development:
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000
```
This provides a temporary public URL for testing.

#### Local Network Sharing
If your team is on the same network:
```bash
npm run dev -- --hostname 0.0.0.0
```
Then share your local IP address (e.g., `http://192.168.1.100:3000`).

### Environment Variables

If you add any environment variables in the future, remember to configure them in your deployment platform:

**Vercel**: Add them in the Vercel dashboard under Project Settings → Environment Variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
