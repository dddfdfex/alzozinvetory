
import React, { useState } from 'react';
import { Transaction, Item } from '../types';
import { Search, Filter, Download, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface AuditLogProps {
  transactions: Transaction[];
  items: Item[];
}

const AuditLog: React.FC<AuditLogProps> = ({ transactions, items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'RECEIPT' | 'ISSUANCE'>('ALL');

  const filtered = transactions.filter(tx => {
    const item = items.find(i => i.id === tx.itemId);
    const itemName = item?.name.toLowerCase() || '';
    const matchesSearch = itemName.includes(searchTerm.toLowerCase()) || 
                          tx.orderNumber?.includes(searchTerm) ||
                          tx.user.includes(searchTerm);
    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">سجل الحركات (Audit Log)</h2>
          <p className="text-gray-500 text-sm">تتبع كامل لجميع عمليات الصرف والاستلام</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 bg-white">
          <Download size={18} /> تصدير PDF/Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث بالصنف، المستخدم، أو رقم الطلب..."
            className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setTypeFilter('ALL')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setTypeFilter('RECEIPT')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'RECEIPT' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}
          >
            استلام
          </button>
          <button 
            onClick={() => setTypeFilter('ISSUANCE')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${typeFilter === 'ISSUANCE' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}
          >
            صرف
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
              <th className="px-6 py-4">النوع</th>
              <th className="px-6 py-4">الصنف</th>
              <th className="px-6 py-4">الكمية</th>
              <th className="px-6 py-4">الجهة / المورد</th>
              <th className="px-6 py-4">المستخدم</th>
              <th className="px-6 py-4">التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-gray-400 italic">لا توجد حركات مطابقة للبحث</td></tr>
            ) : (
              filtered.map(tx => {
                const item = items.find(i => i.id === tx.itemId);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${tx.type === 'RECEIPT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {tx.type === 'RECEIPT' ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                        {tx.type === 'RECEIPT' ? 'استلام' : 'صرف'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item?.name || 'صنف محذوف'}</div>
                      <div className="text-[10px] text-gray-400">{item?.code || '---'}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-700">{tx.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.type === 'RECEIPT' ? tx.supplier : tx.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.user}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString('ar-EG')}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;
