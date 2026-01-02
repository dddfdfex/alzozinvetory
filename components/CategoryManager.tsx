
import React, { useState } from 'react';
import { Category } from '../types';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onUpdate }) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onUpdate([...categories, { id: Date.now().toString(), name: newCatName.trim() }]);
    setNewCatName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('سيتم حذف الفئة، هل أنت متأكد؟')) {
      onUpdate(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Tags size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">إدارة فئات المخزون</h2>
        <p className="text-gray-500">قم بتنظيم الأصناف في مجموعات منطقية</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input 
            type="text" 
            placeholder="اسم الفئة الجديدة..."
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
          />
          <button 
            type="submit"
            className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={18} /> إضافة
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-all bg-gray-50/30 group">
              <span className="font-bold text-gray-700">{cat.name}</span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
