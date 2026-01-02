
import React, { useMemo } from 'react';
import { DatabaseState } from '../types';
import { 
  Package, ArrowDownCircle, ArrowUpCircle, AlertTriangle, TrendingUp, Box, History
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface DashboardProps {
  db: DatabaseState;
}

const Dashboard: React.FC<DashboardProps> = ({ db }) => {
  const stats = useMemo(() => ({
    totalItems: db.items.length,
    lowStockItems: db.items.filter(i => i.currentStock <= i.minStock).length,
    totalReceipts: db.transactions.filter(t => t.type === 'RECEIPT').length,
    totalIssuances: db.transactions.filter(t => t.type === 'ISSUANCE').length,
  }), [db]);

  const chartData = db.categories.map(cat => ({
    name: cat.name,
    count: db.items.filter(item => item.categoryId === cat.id).length
  }));

  return (
    <div className="space-y-12">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatBox icon={<Box size={40} />} label="إجمالي الأصناف" value={stats.totalItems} color="blue" />
        <StatBox icon={<AlertTriangle size={40} />} label="أصناف ناقصة" value={stats.lowStockItems} color="red" />
        <StatBox icon={<ArrowDownCircle size={40} />} label="حركات استلام" value={stats.totalReceipts} color="emerald" />
        <StatBox icon={<ArrowUpCircle size={40} />} label="حركات صرف" value={stats.totalIssuances} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* الرسم البياني */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border-2 border-white">
          <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4 mb-12">
            <TrendingUp size={40} className="text-emerald-500" />
            توزيع المخزون الفعلي
          </h3>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 16, fontWeight: 900, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 16, fontWeight: 900, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 900, fontSize: '1.2rem'}} 
                />
                <Bar dataKey="count" radius={[15, 15, 0, 0]} barSize={80}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* الحركات الأخيرة */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200 border-2 border-white">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4 mb-10">
            <History size={32} className="text-blue-500" /> الحركات الأخيرة
          </h3>
          <div className="space-y-6">
            {db.transactions.slice(0, 7).length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-bold italic">لا توجد حركات مسجلة</div>
            ) : (
              db.transactions.slice(0, 7).map(tx => {
                const item = db.items.find(i => i.id === tx.itemId);
                return (
                  <div key={tx.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-emerald-200 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl ${tx.type === 'RECEIPT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {tx.type === 'RECEIPT' ? <ArrowDownCircle size={24} /> : <ArrowUpCircle size={24} />}
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-800 leading-none group-hover:text-emerald-700 transition-colors">{item?.name || 'صنف غير مسمى'}</p>
                        <p className="text-xs text-slate-400 font-bold mt-2">{new Date(tx.timestamp).toLocaleTimeString('ar-EG')}</p>
                      </div>
                    </div>
                    <div className={`text-2xl font-black ${tx.type === 'RECEIPT' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'RECEIPT' ? '+' : '-'}{tx.quantity}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => {
  const themes: any = {
    blue: 'bg-blue-600 shadow-blue-200',
    emerald: 'bg-emerald-600 shadow-emerald-200',
    red: 'bg-red-600 shadow-red-200',
    indigo: 'bg-indigo-600 shadow-indigo-200'
  };
  return (
    <div className={`${themes[color]} p-10 rounded-[3rem] text-white shadow-2xl transition-transform hover:-translate-y-3 duration-300`}>
      <div className="flex items-center justify-between mb-8">
        <div className="p-4 bg-white/20 rounded-2xl">{icon}</div>
        <span className="text-6xl font-black tracking-tighter">{value}</span>
      </div>
      <p className="text-xl font-black opacity-90">{label}</p>
    </div>
  );
};

export default Dashboard;
