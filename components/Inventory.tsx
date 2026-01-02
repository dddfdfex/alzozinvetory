
import React, { useState } from 'react';
import { Item, Category } from '../types';
// Add ShieldCheck to the lucide-react imports
import { Plus, Search, Edit2, Trash2, AlertCircle, Download, Filter, X, Package, ShieldCheck } from 'lucide-react';

interface InventoryProps {
  items: Item[];
  categories: Category[];
  onUpdate: (items: Item[]) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, categories, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [formData, setFormData] = useState<Omit<Item, 'id' | 'currentStock'>>({
    code: '', name: '', categoryId: categories[0]?.id || '', unit: 'وحدة', minStock: 10, notes: ''
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === 'all' || item.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      onUpdate([...items, { ...formData, id: Date.now().toString(), currentStock: 0 }]);
    }
    setIsModalOpen(false);
  };

  const deleteItem = (id: string) => {
    if (window.confirm('هل أنت متأكد من مسح هذا الصنف نهائياً من النظام؟')) {
      onUpdate(items.filter(i => i.id !== id));
    }
  };

  const openModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({ code: item.code, name: item.name, categoryId: item.categoryId, unit: item.unit, minStock: item.minStock, notes: item.notes });
    } else {
      setEditingItem(null);
      setFormData({ code: '', name: '', categoryId: categories[0]?.id || '', unit: 'وحدة', minStock: 10, notes: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tight">إدارة المخزون الطبي</h2>
          <p className="text-emerald-600 font-black text-xl mt-2">جرد ومراقبة الأصناف في مستودع الرازي</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-4 px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-2xl"
          >
            <Download size={28} /> تصدير التقرير
          </button>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-4 px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100"
          >
            <Plus size={28} /> إضافة صنف جديد
          </button>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border-2 border-white">
        <div className="md:col-span-3 relative">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={32} />
          <input 
            type="text" placeholder="ابحث باسم الدواء، المستلزم، أو رقم الكود المرجعي..."
            className="w-full pr-16 pl-8 py-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-2xl font-black"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={32} />
          <select 
            className="w-full pr-16 pl-8 py-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 focus:bg-white outline-none appearance-none transition-all text-2xl font-black"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="all">كل الفئات</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* جدول البيانات الرئيسي */}
      <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200 border-2 border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right medical-table">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-10 py-8 text-2xl font-black">الكود</th>
                <th className="px-10 py-8 text-2xl font-black">اسم المنتج</th>
                <th className="px-10 py-8 text-2xl font-black text-center">الرصيد الفعلي</th>
                <th className="px-10 py-8 text-2xl font-black text-center">الحد الحرج</th>
                <th className="px-10 py-8 text-2xl font-black text-center">الحالة</th>
                <th className="px-10 py-8 text-2xl font-black text-left">إدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-slate-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center text-slate-400 text-3xl font-black italic">
                    <Package size={80} className="mx-auto mb-6 opacity-10" />
                    لا توجد أصناف تطابق معايير البحث
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isCritical = item.currentStock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-emerald-50/50 transition-all duration-300">
                      <td className="px-10 py-8 font-black text-slate-400 text-xl tracking-widest">{item.code}</td>
                      <td className="px-10 py-8">
                        <p className="text-3xl font-black text-slate-800 mb-1">{item.name}</p>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-sm font-black">
                          {categories.find(c => c.id === item.categoryId)?.name}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <span className={`text-5xl font-black ${isCritical ? 'text-red-600' : 'text-emerald-600'}`}>
                          {item.currentStock}
                        </span>
                        <p className="text-xs font-black text-slate-400 mt-2 uppercase">{item.unit}</p>
                      </td>
                      <td className="px-10 py-8 text-center text-2xl font-black text-slate-400">
                        {item.minStock}
                      </td>
                      <td className="px-10 py-8 text-center">
                        {isCritical ? (
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-2xl text-lg font-black animate-pulse">
                            <AlertCircle size={24} /> نقص حاد
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl text-lg font-black">
                            <ShieldCheck size={24} /> متوفر
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-8 text-left">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => openModal(item)}
                            className="p-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-lg"
                          >
                            <Edit2 size={28} />
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-lg"
                          >
                            <Trash2 size={28} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - إضافة وتعديل صنف */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-3xl overflow-hidden border-t-[16px] border-emerald-600 animate-in zoom-in-90 duration-300">
            <div className="p-12 border-b-2 border-slate-50 flex items-center justify-between">
              <h3 className="text-4xl font-black text-slate-800">بيانات الصنف الطبي</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500 transition-all"><X size={48} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xl font-black text-slate-700">رقم الكود المرجعي *</label>
                  <input type="text" required className="w-full p-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 outline-none text-2xl font-bold" value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-xl font-black text-slate-700">اسم الصنف الطبي *</label>
                  <input type="text" required className="w-full p-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 outline-none text-2xl font-bold" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xl font-black text-slate-700">الفئة / التصنيف</label>
                  <select className="w-full p-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 outline-none text-2xl font-bold appearance-none" value={formData.categoryId} onChange={e=>setFormData({...formData, categoryId: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xl font-black text-slate-700">الحد الأدنى (للتنبيه)</label>
                  <input type="number" required className="w-full p-6 rounded-3xl bg-slate-50 border-4 border-transparent focus:border-emerald-500 outline-none text-2xl font-bold" value={formData.minStock} onChange={e=>setFormData({...formData, minStock: parseInt(e.target.value)||0})} />
                </div>
              </div>

              <button type="submit" className="w-full py-8 bg-emerald-600 text-white text-3xl font-black rounded-[2.5rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200">
                حفظ التغييرات وتحديث النظام
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
