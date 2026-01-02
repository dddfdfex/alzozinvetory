
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  FilePlus, 
  History, 
  BarChart3, 
  Settings,
  Tags
} from 'lucide-react';

export const APP_NAME = "مستشفى الرازي التخصصي";
export const DEVELOPER_CREDIT = "Powered by Alzoz OS";

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
  { id: 'categories', label: 'إدارة الفئات', icon: <Tags size={20} /> },
  { id: 'inventory', label: 'المخزون الطبي', icon: <Package size={20} /> },
  { id: 'receipt', label: 'استلام طلبيات', icon: <ArrowDownCircle size={20} /> },
  { id: 'issuance', label: 'صرف منتجات', icon: <ArrowUpCircle size={20} /> },
  { id: 'purchase', label: 'طلبات الشراء', icon: <FilePlus size={20} /> },
  { id: 'log', label: 'سجل الحركات', icon: <History size={20} /> },
  { id: 'reports', label: 'التقارير', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
];

export const INITIAL_CATEGORIES = [
  { id: '1', name: 'أدوية' },
  { id: '2', name: 'مستلزمات طبية' },
  { id: '3', name: 'محاليل' },
  { id: '4', name: 'أجهزة طبية' },
];

export const DEPARTMENTS = [
  'قسم الطوارئ',
  'العمليات الكبرى',
  'العناية المركزة',
  'المختبر',
  'الأشعة',
  'العيادات الخارجية',
  'الصيدلية الداخلية'
];
