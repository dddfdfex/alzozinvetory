
import React from 'react';
import { DatabaseState } from '../types';
import { 
  BarChart3, 
  FileDown, 
  Printer, 
  TrendingDown, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Package
} from 'lucide-react';

interface ReportsProps {
  db: DatabaseState;
}

const Reports: React.FC<ReportsProps> = ({ db }) => {
  const lowStockItems = db.items.filter(i => i.currentStock <= i.minStock);
  const receiptsCount = db.transactions.filter(t => t.type === 'RECEIPT').length;
  const issuanceCount = db.transactions.filter(t => t.type === 'ISSUANCE').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h2>
          <p className="text-gray-500">تحليل البيانات والمخزون للفترة الحالية</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all">
            <Printer size={18} /> طباعة الكل
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 bg-white">
            <FileDown size={18} /> تصدير Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          icon={<TrendingDown className="text-red-500" />} 
          label="أصناف حرجة (نقص)" 
          value={lowStockItems.length} 
          color="text-red-600"
          bg="bg-red-50"
        />
        <ReportCard 
          icon={<ArrowDownCircle className="text-emerald-500" />} 
          label="إجمالي الواردات" 
          value={receiptsCount} 
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <ReportCard 
          icon={<ArrowUpCircle className="text-blue-500" />} 
          label="إجمالي المنصرفات" 
          value={issuanceCount} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
      </div>

      {/* Low Stock Detailed Report */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingDown size={20} className="text-red-500" />
            تقرير الأصناف الناقصة (تحتاج توريد)
          </h3>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold">عاجل</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-4">الصنف</th>
                <th className="px-6 py-4 text-center">الرصيد الحالي</th>
                <th className="px-6 py-4 text-center">الحد الأدنى</th>
                <th className="px-6 py-4 text-center">العجز</th>
                <th className="px-6 py-4">الفئة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lowStockItems.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">لا يوجد عجز في أي صنف حالياً</td></tr>
              ) : (
                lowStockItems.map(item => (
                  <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-[10px] text-gray-400">{item.code}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-red-600">{item.currentStock}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-500">{item.minStock}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-red-800">
                      {item.minStock - item.currentStock}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{db.categories.find(c => c.id === item.categoryId)?.name}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package size={20} className="text-blue-500" />
            أكثر الأصناف حركة
          </h3>
          <div className="space-y-4">
            {/* Logic to find top items can be added here */}
            <div className="p-10 text-center text-gray-400 italic">يتطلب بيانات معاملات أكثر للتحليل</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-500" />
            معدل استهلاك الأقسام
          </h3>
          <div className="space-y-4">
            <div className="p-10 text-center text-gray-400 italic">سيظهر هنا رسم بياني لاستهلاك الأقسام</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ icon, label, value, color, bg }: { icon: React.ReactNode, label: string, value: number, color: string, bg: string }) => (
  <div className={`p-6 rounded-2xl border border-gray-100 shadow-sm ${bg} flex items-center gap-4`}>
    <div className="p-4 bg-white rounded-2xl shadow-sm">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

export default Reports;
