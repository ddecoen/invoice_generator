'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Download } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  fromName: z.string().min(1, 'Business name is required'),
  fromEmail: z.string().email('Valid email is required'),
  fromAddress: z.string().min(1, 'Address is required'),
  fromCity: z.string().min(1, 'City is required'),
  fromState: z.string().min(1, 'State is required'),
  fromZip: z.string().min(1, 'ZIP code is required'),
  toName: z.string().min(1, 'Client name is required'),
  toEmail: z.string().email('Valid email is required'),
  toAddress: z.string().min(1, 'Address is required'),
  toCity: z.string().min(1, 'City is required'),
  toState: z.string().min(1, 'State is required'),
  toZip: z.string().min(1, 'ZIP code is required'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    rate: z.number().min(0, 'Rate must be positive'),
    amount: z.number()
  })).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  notes: z.string().optional()
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function InvoiceForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      taxRate: 0,
      paymentTerms: 'Net 30',
      notes: ''
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });
  
  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');
  
  // Calculate totals
  const subtotal = watchedItems.reduce((sum, item) => {
    const amount = (item.quantity || 0) * (item.rate || 0);
    return sum + amount;
  }, 0);
  
  const taxAmount = subtotal * (watchedTaxRate || 0) / 100;
  const total = subtotal + taxAmount;
  
  // Update item amounts when quantity or rate changes
  const updateItemAmount = (index: number) => {
    const item = watchedItems[index];
    if (item) {
      const amount = (item.quantity || 0) * (item.rate || 0);
      setValue(`items.${index}.amount`, amount);
    }
  };
  
  const onSubmit = async (data: InvoiceFormData) => {
    setIsGenerating(true);
    try {
      const invoiceData: InvoiceData = {
        ...data,
        subtotal,
        taxAmount,
        total
      };
      
      await generateInvoicePDF(invoiceData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Invoice Generator</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Invoice Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                {...register('invoiceNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                {...register('invoiceDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-sm mt-1">{errors.invoiceDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* From (Business) Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">From (Your Business)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                {...register('fromName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromName && (
                <p className="text-red-500 text-sm mt-1">{errors.fromName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('fromEmail')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.fromEmail.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                {...register('fromAddress')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.fromAddress.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register('fromCity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromCity && (
                <p className="text-red-500 text-sm mt-1">{errors.fromCity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                {...register('fromState')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromState && (
                <p className="text-red-500 text-sm mt-1">{errors.fromState.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                {...register('fromZip')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fromZip && (
                <p className="text-red-500 text-sm mt-1">{errors.fromZip.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* To (Client) Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">To (Client)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                {...register('toName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toName && (
                <p className="text-red-500 text-sm mt-1">{errors.toName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('toEmail')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.toEmail.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                {...register('toAddress')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.toAddress.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register('toCity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toCity && (
                <p className="text-red-500 text-sm mt-1">{errors.toCity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                {...register('toState')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toState && (
                <p className="text-red-500 text-sm mt-1">{errors.toState.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                {...register('toZip')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.toZip && (
                <p className="text-red-500 text-sm mt-1">{errors.toZip.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Items */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-md">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    {...register(`items.${index}.description`)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.items[index]?.description?.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, { 
                      valueAsNumber: true,
                      onChange: () => updateItemAmount(index)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-red-500 text-sm mt-1">{errors.items[index]?.quantity?.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.rate`, { 
                      valueAsNumber: true,
                      onChange: () => updateItemAmount(index)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.items?.[index]?.rate && (
                    <p className="text-red-500 text-sm mt-1">{errors.items[index]?.rate?.message}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                      ${((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0)).toFixed(2)}
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {errors.items && (
            <p className="text-red-500 text-sm mt-2">{errors.items.message}</p>
          )}
        </div>
        
        {/* Totals and Payment */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('taxRate', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.taxRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.taxRate.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  {...register('paymentTerms')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
                {errors.paymentTerms && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or payment instructions..."
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Invoice Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({watchedTaxRate || 0}%):</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating PDF...' : 'Generate Invoice PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}
