
import React, { useState } from 'react';
import { Item, TransactionType, Transaction } from '../types';
import { DEPARTMENTS } from '../constants';
import { ArrowDownCircle, ArrowUpCircle, AlertCircle, Save, X } from 'lucide-react';

interface TransactionFormProps {
  type: TransactionType;
  items: Item[];
  onRecord: (tx: Omit<Transaction, 'id' | 'timestamp' | 'user'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, items, onRecord }) => {
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 0,
    department: DEPARTMENTS[0],
    supplier: '',
    orderNumber: '',
    notes: ''
  });

  const selectedItem = items.find(i => i.id === formData.itemId);
  const isError = type === 'ISSUANCE' && selectedItem && formData.quantity > selectedItem.currentStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || formData.quantity <= 0 || isError) return;

    onRecord({
      type,
      itemId: formData.itemId,
      quantity: formData.quantity,
      department: type === 'ISSUANCE' ? formData.department : undefined,
      supplier: type === 'RECEIPT' ? formData.supplier : undefined,
      orderNumber: formData.orderNumber,
      notes: formData.notes,
      date: new Date().toISOString().split('T')[0]
    });

    // Reset quantity only, keep others for faster repetitive entry if needed
    setFormData(prev => ({ ...prev, quantity: 0, notes: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className={`p-4 rounded-2xl shadow-lg ${type === 'RECEIPT' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {type === 'RECEIPT' ? <ArrowDownCircle size={32} /> : <ArrowUpCircle size={32} />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{type === 'RECEIPT' ? 'استلام طلبية جديدة' : 'صرف أصناف طبية'}</h2>
          <p className="text-gray-500">أدخل بيانات الحركة بدقة لتحديث المخزون</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اختر الصنف *</label>
                <select 
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  value={formData.itemId}
                  onChange={e => setFormData({...formData, itemId: e.target.value})}
                >
                  <option value="">-- اختر من القائمة --</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.code}) - متوفر: {item.currentStock}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الكمية *</label>
                <div className="relative">
                  <input 
                    type="number" required min="1"
                    className={`w-full p-3 rounded-xl border outline-none transition-all ${isError ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'}`}
                    value={formData.quantity || ''}
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  />
                  {selectedItem && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold uppercase">
                      {selectedItem.unit}
                    </span>
                  )}
                </div>
                {isError && (
                  <p className="mt-1 text-xs text-red-600 font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> الرصيد الحالي غير كافٍ (المتوفر: {selectedItem?.currentStock})
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {type === 'RECEIPT' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم المورد</label>
                    <input 
                      type="text"
                      placeholder="اسم الشركة الموردة..."
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.supplier}
                      onChange={e => setFormData({...formData, supplier: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم الطلبية / الفاتورة</label>
                    <input 
                      type="text"
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={formData.orderNumber}
                      onChange={e => setFormData({...formData, orderNumber: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الجهة المصروف لها (القسم)</label>
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات إضافية</label>
            <textarea 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button 
              type="submit"
              disabled={isError || !formData.itemId}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${type === 'RECEIPT' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={20} /> حفظ الحركة وتحديث المخزون
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
        <div>
          <h4 className="text-blue-800 font-bold text-sm">ملاحظة هامة</h4>
          <p className="text-blue-700 text-xs mt-1 leading-relaxed">
            بمجرد النقر على حفظ، سيتم تعديل الرصيد الحالي للصنف المختار مباشرة في قاعدة البيانات. 
            تأكد من مراجعة الكمية قبل التأكيد.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
