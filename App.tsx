
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Bell, LogOut, User as UserIcon, Search, AlertTriangle,
  Clock, Menu, X, Package, ShieldCheck, Database, LayoutDashboard
} from 'lucide-react';
import { APP_NAME, DEVELOPER_CREDIT, MENU_ITEMS, INITIAL_CATEGORIES } from './constants';
import { User, DatabaseState, Item, Category, Transaction, AppNotification } from './types';

// Components
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import CategoryManager from './components/CategoryManager';
import TransactionForm from './components/TransactionForm';
import AuditLog from './components/AuditLog';
import Reports from './components/Reports';
import PurchaseOrderCreator from './components/PurchaseOrderCreator';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const [db, setDb] = useState<DatabaseState>(() => {
    const saved = localStorage.getItem('alrazi_master_db');
    if (saved) return JSON.parse(saved);
    return {
      users: [{ username: 'user', role: 'ADMIN' }],
      categories: INITIAL_CATEGORIES,
      items: [],
      transactions: [],
      purchaseOrders: [],
      notifications: []
    };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // حفظ تلقائي للبيانات
  useEffect(() => {
    localStorage.setItem('alrazi_master_db', JSON.stringify(db));
  }, [db]);

  // تحديث الساعة
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: 'INFO' | 'WARNING' | 'SUCCESS' = 'INFO') => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title, message, type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setDb(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications] }));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'user' && loginForm.password === '0000') {
      setUser({ username: 'user', role: 'ADMIN', lastLogin: new Date().toISOString() });
      addNotification('دخول آمن', 'مرحباً بك في لوحة تحكم مستشفى الرازي', 'SUCCESS');
    } else {
      setError('كلمة المرور أو اسم المستخدم غير صحيح');
    }
  };

  const handleTransaction = (tx: Omit<Transaction, 'id' | 'timestamp' | 'user'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: user?.username || 'system'
    };
    
    setDb(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === tx.itemId) {
          const change = tx.type === 'RECEIPT' ? tx.quantity : -tx.quantity;
          const newStock = item.currentStock + change;
          if (newStock <= item.minStock) {
            addNotification('تنبيه مخزون', `الصنف ${item.name} وصل للحد الحرج (${newStock})`, 'WARNING');
          }
          return { ...item, currentStock: newStock };
        }
        return item;
      });
      return { ...prev, items: updatedItems, transactions: [newTx, ...prev.transactions] };
    });
  };

  const renderActiveComponent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard db={db} />;
      case 'inventory': return <Inventory items={db.items} categories={db.categories} onUpdate={items => setDb(prev => ({...prev, items}))} />;
      case 'categories': return <CategoryManager categories={db.categories} onUpdate={categories => setDb(prev => ({...prev, categories}))} />;
      case 'receipt': return <TransactionForm type="RECEIPT" items={db.items} onRecord={handleTransaction} />;
      case 'issuance': return <TransactionForm type="ISSUANCE" items={db.items} onRecord={handleTransaction} />;
      case 'purchase': return <PurchaseOrderCreator items={db.items} />;
      case 'log': return <AuditLog transactions={db.transactions} items={db.items} />;
      case 'reports': return <Reports db={db} />;
      case 'settings': return <SettingsView user={user!} />;
      default: return <Dashboard db={db} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] p-6 overflow-hidden">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-lg border-b-[12px] border-emerald-500 animate-in slide-in-from-bottom duration-700">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl rotate-3">
              <Package size={50} />
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">{APP_NAME}</h1>
            <p className="text-emerald-600 font-bold mt-2 text-lg">بوابة إدارة المستودعات المركزية</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black border-2 border-red-100 flex items-center gap-3">
                <AlertTriangle size={24} /> {error}
              </div>
            )}
            <div>
              <label className="block text-lg font-black text-slate-700 mb-2">اسم المستخدم</label>
              <input 
                type="text" required
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-bold"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-lg font-black text-slate-700 mb-2">كلمة المرور</label>
              <input 
                type="password" required
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-bold"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-2xl py-6 rounded-2xl shadow-2xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ShieldCheck size={32} /> دخول النظام
            </button>
          </form>

          <div className="mt-12 text-center text-sm text-slate-400 font-bold border-t pt-8">
            {DEVELOPER_CREDIT} <br/> تم التطوير بواسطة Alzoz OS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 text-white transition-all duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
              <Package size={28} />
            </div>
            <span className="text-2xl font-black tracking-tighter">الرازي تيك</span>
          </div>

          <nav className="flex-1 space-y-2">
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-lg ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/50 scale-105' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-800 pt-6">
            <button 
              onClick={() => setUser(null)}
              className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black text-xl"
            >
              <LogOut size={28} /> تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white border-b-2 border-slate-100 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-slate-50 text-slate-600 rounded-2xl">
              <Menu size={32} />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-black text-slate-800 leading-none">مرحباً، {user.username}</span>
              <div className="flex items-center gap-2 text-emerald-600 font-bold mt-1 text-sm">
                <Clock size={16} />
                <span>{currentTime.toLocaleTimeString('ar-EG')} - {currentTime.toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl border-2 border-slate-100 flex items-center gap-4 px-6">
              <UserIcon size={24} className="text-emerald-500" />
              <span className="font-black text-slate-800">{user.role === 'ADMIN' ? 'مدير النظام' : 'أمين مخزن'}</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500">
            {renderActiveComponent()}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
