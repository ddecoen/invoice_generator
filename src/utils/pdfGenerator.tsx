import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  addressBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addressSection: {
    width: '45%',
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    color: '#374151',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottom: '1 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  descriptionCell: {
    width: '50%',
  },
  quantityCell: {
    width: '15%',
    textAlign: 'center',
  },
  rateCell: {
    width: '15%',
    textAlign: 'right',
  },
  amountCell: {
    width: '20%',
    textAlign: 'right',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: '#374151',
  },
  totalValue: {
    fontSize: 10,
    color: '#374151',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    paddingTop: 5,
    borderTop: '1 solid #374151',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1 solid #e5e7eb',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
});

const InvoicePDF = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.text}>Invoice #: {data.invoiceNumber}</Text>
          <Text style={styles.text}>Date: {new Date(data.invoiceDate).toLocaleDateString()}</Text>
          <Text style={styles.text}>Due Date: {new Date(data.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* From/To Addresses */}
      <View style={styles.addressBlock}>
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>From:</Text>
          <Text style={styles.text}>{data.fromName}</Text>
          <Text style={styles.text}>{data.fromEmail}</Text>
          <Text style={styles.text}>{data.fromAddress}</Text>
          <Text style={styles.text}>{data.fromCity}, {data.fromState} {data.fromZip}</Text>
        </View>
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>To:</Text>
          <Text style={styles.text}>{data.toName}</Text>
          <Text style={styles.text}>{data.toEmail}</Text>
          <Text style={styles.text}>{data.toAddress}</Text>
          <Text style={styles.text}>{data.toCity}, {data.toState} {data.toZip}</Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCellHeader, styles.descriptionCell]}>Description</Text>
          <Text style={[styles.tableCellHeader, styles.quantityCell]}>Qty</Text>
          <Text style={[styles.tableCellHeader, styles.rateCell]}>Rate</Text>
          <Text style={[styles.tableCellHeader, styles.amountCell]}>Amount</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>{item.description}</Text>
            <Text style={[styles.tableCell, styles.quantityCell]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.rateCell]}>${item.rate.toFixed(2)}</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>${data.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax ({data.taxRate}%):</Text>
          <Text style={styles.totalValue}>${data.taxAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.grandTotalRow}>
          <Text style={styles.grandTotalLabel}>Total:</Text>
          <Text style={styles.grandTotalValue}>${data.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Payment Terms: {data.paymentTerms}</Text>
        {data.notes && (
          <View>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={styles.footerText}>{data.notes}</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export const generateInvoicePDF = async (data: InvoiceData) => {
  const blob = await pdf(<InvoicePDF data={data} />).toBlob();
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${data.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
