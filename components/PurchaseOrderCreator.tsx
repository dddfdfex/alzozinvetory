
import React, { useState } from 'react';
import { Item } from '../types';
import { Plus, Trash2, Printer, FileText, Package, AlertCircle } from 'lucide-react';

interface PurchaseOrderCreatorProps {
  items: Item[];
}

const PurchaseOrderCreator: React.FC<PurchaseOrderCreatorProps> = ({ items }) => {
  const [orderItems, setOrderItems] = useState<{ itemId: string, quantity: number }[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [qty, setQty] = useState(1);

  const addItem = () => {
    if (!selectedItemId) return;
    if (orderItems.find(i => i.itemId === selectedItemId)) return;
    setOrderItems([...orderItems, { itemId: selectedItemId, quantity: qty }]);
    setSelectedItemId('');
    setQty(1);
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(i => i.itemId !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إنشاء طلبية شراء</h2>
          <p className="text-gray-500 text-sm">توليد مسودة طلب شراء رسمية للموردين</p>
        </div>
        <button 
          onClick={handlePrint}
          disabled={orderItems.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg disabled:opacity-50"
        >
          <Printer size={18} /> طباعة وحفظ PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit no-print">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Plus size={18} className="text-emerald-500" /> إضافة أصناف للطلب
          </h3>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">الصنف</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value)}
            >
              <option value="">-- اختر صنف --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name} (رصيد: {item.currentStock})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">الكمية المطلوبة</label>
            <input 
              type="number" min="1"
              className="w-full p-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
              value={qty}
              onChange={e => setQty(parseInt(e.target.value) || 1)}
            />
          </div>
          <button 
            onClick={addItem}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all"
          >
            إضافة للقائمة
          </button>

          {items.some(i => i.currentStock < i.minStock) && (
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5" /> تذكير: هناك أصناف قاربت على النفاذ يفضل إضافتها.
              </p>
            </div>
          )}
        </div>

        {/* PO Preview Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col print:shadow-none print:border-none">
          {/* Official Header (Visible on print) */}
          <div className="p-10 border-b border-gray-100 bg-gray-50/30 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-gray-800">طلب شراء رسمي</h1>
              <p className="text-emerald-600 font-bold mt-1">مستشفى الرازي التخصصي</p>
              <div className="text-xs text-gray-400 mt-4 space-y-1">
                <p>تاريخ الطلب: {new Date().toLocaleDateString('ar-EG')}</p>
                <p>رقم المرجع: PO-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Package size={32} />
            </div>
          </div>

          <div className="flex-1 p-10">
            {orderItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <FileText size={64} className="opacity-10" />
                <p>لا توجد أصناف في الطلب حالياً</p>
              </div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-slate-800 font-bold">
                    <th className="py-3 px-2">#</th>
                    <th className="py-3 px-2">الكود</th>
                    <th className="py-3 px-2">اسم الصنف</th>
                    <th className="py-3 px-2">الوحدة</th>
                    <th className="py-3 px-2 text-center">الكمية</th>
                    <th className="py-3 px-2 text-left no-print"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orderItems.map((oi, index) => {
                    const item = items.find(i => i.id === oi.itemId);
                    return (
                      <tr key={oi.itemId}>
                        <td className="py-4 px-2 text-gray-400">{index + 1}</td>
                        <td className="py-4 px-2 font-mono text-sm">{item?.code}</td>
                        <td className="py-4 px-2 font-bold">{item?.name}</td>
                        <td className="py-4 px-2 text-sm text-gray-500">{item?.unit}</td>
                        <td className="py-4 px-2 text-center font-bold text-lg">{oi.quantity}</td>
                        <td className="py-4 px-2 text-left no-print">
                          <button onClick={() => removeItem(oi.itemId)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-10 bg-gray-50/30 border-t border-gray-100 flex justify-between items-end">
            <div className="space-y-4">
              <div className="w-48 h-10 border-b border-dashed border-gray-300"></div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">توقيع مدير المخازن</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 italic">تم إنشاء هذا الطلب بواسطة نظام الرازي - Powered by Alzoz OS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderCreator;
