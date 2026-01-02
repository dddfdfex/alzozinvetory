
import React from 'react';
import { User } from '../types';
import { User as UserIcon, Shield, Database, Trash2, Download, Upload } from 'lucide-react';

interface SettingsViewProps {
  user: User;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">إعدادات النظام</h2>
        <p className="text-gray-500">إدارة حسابك وتفضيلات النظام والبيانات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-50 shadow-inner">
              <UserIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800">{user.username}</h3>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 inline-block">
              {user.role}
            </span>
            <div className="mt-6 pt-6 border-t border-gray-50 space-y-2">
              <button className="w-full py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">تغيير كلمة المرور</button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Shield size={20} className="text-emerald-500" /> الأمان والصلاحيات
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-bold text-sm text-gray-700">وضع المسؤول</p>
                  <p className="text-xs text-gray-400">لديك كامل الصلاحيات لتعديل المخزون والفئات</p>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full translate-x-6"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Database size={20} className="text-blue-500" /> إدارة البيانات (Backup)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-center group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Download size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">تصدير قاعدة البيانات</p>
                  <p className="text-[10px] text-gray-400">حفظ نسخة احتياطية (JSON)</p>
                </div>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-center group">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">استيراد بيانات</p>
                  <p className="text-[10px] text-gray-400">استعادة من نسخة قديمة</p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl">
              <h4 className="text-red-800 font-bold text-sm flex items-center gap-2">
                <Trash2 size={16} /> منطقة الخطر
              </h4>
              <p className="text-red-700 text-xs mt-1">مسح جميع البيانات الموجودة في النظام حالياً والبدء من جديد. لا يمكن التراجع عن هذا الإجراء.</p>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all">مسح كافة البيانات</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
