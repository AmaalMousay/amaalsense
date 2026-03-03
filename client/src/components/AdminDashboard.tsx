/**
 * ADMIN DASHBOARD COMPONENT
 * 
 * لوحة الإدارة الشاملة
 * - إدارة المستخدمين
 * - مراقبة الأداء
 * - إدارة الأنظمة
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Settings, TrendingUp, AlertTriangle, CheckCircle, BarChart3, PieChart, Clock, Zap } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: Date;
  lastActive: Date;
  apiUsage: number;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: number;
}

interface AdminDashboardProps {
  userId?: string;
  onUserAction?: (userId: string, action: string) => void;
}

export function AdminDashboard({
  userId,
  onUserAction
}: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'user',
      status: 'active',
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      apiUsage: 4500
    },
    {
      id: 'user-2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      apiUsage: 8200
    },
    {
      id: 'user-3',
      name: 'محمود حسن',
      email: 'mahmoud@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      apiUsage: 1200
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'استخدام CPU', value: 45, unit: '%', status: 'healthy', trend: 2 },
    { name: 'استخدام الذاكرة', value: 62, unit: '%', status: 'warning', trend: 5 },
    { name: 'توفر النظام', value: 99.8, unit: '%', status: 'healthy', trend: 0 },
    { name: 'سرعة الاستجابة', value: 125, unit: 'ms', status: 'healthy', trend: -3 },
    { name: 'عدد الطلبات/ثانية', value: 2450, unit: 'req/s', status: 'healthy', trend: 8 },
    { name: 'معدل الخطأ', value: 0.02, unit: '%', status: 'healthy', trend: -1 }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const handleSuspendUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
    onUserAction?.(id, 'suspend');
  };

  const handleActivateUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    onUserAction?.(id, 'activate');
  };

  const handleChangeRole = (id: string, newRole: 'admin' | 'user' | 'moderator') => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    onUserAction?.(id, `change_role_${newRole}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'suspended':
        return 'موقوف';
      default:
        return status;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مسؤول';
      case 'moderator':
        return 'مشرف';
      case 'user':
        return 'مستخدم';
      default:
        return role;
    }
  };

  const getMetricStatus = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getMetricIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const totalApiUsage = users.reduce((sum, u) => sum + u.apiUsage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">لوحة الإدارة</h2>
          <p className="text-sm text-gray-600 mt-1">
            إدارة النظام والمستخدمين والأداء
          </p>
        </div>
        <Button className="gap-2 bg-black text-white hover:bg-gray-800">
          <Settings className="w-4 h-4" />
          إعدادات النظام
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-black mt-1">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المستخدمون النشطون</p>
              <p className="text-2xl font-bold text-black mt-1">{activeUsersCount}</p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي استخدام API</p>
              <p className="text-2xl font-bold text-black mt-1">{(totalApiUsage / 1000).toFixed(1)}K</p>
            </div>
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">صحة النظام</p>
              <p className="text-2xl font-bold text-green-600 mt-1">99.8%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          مقاييس الأداء
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, idx) => (
            <Card
              key={idx}
              className={`p-4 border-2 ${getMetricStatus(metric.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">{metric.name}</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {metric.value}{metric.unit}
                  </p>
                </div>
                {getMetricIcon(metric.status)}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span className={metric.trend > 0 ? 'text-red-600' : 'text-green-600'}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Users Management */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          إدارة المستخدمين
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الاسم</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">البريد الإلكتروني</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الدور</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">آخر نشاط</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as any)}
                      className="px-2 py-1 rounded border border-gray-300 text-sm"
                    >
                      <option value="user">مستخدم</option>
                      <option value="moderator">مشرف</option>
                      <option value="admin">مسؤول</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">
                    {Math.floor((Date.now() - user.lastActive.getTime()) / (1000 * 60))} دقيقة
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                          إيقاف
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 hover:bg-green-200 transition"
                        >
                          تفعيل
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                      >
                        تفاصيل
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Activity Log */}
      <Card className="p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          سجل الأنشطة الأخيرة
        </h3>

        <div className="space-y-3">
          {[
            { time: '2024-03-03 14:30', action: 'تسجيل دخول المستخدم', user: 'أحمد محمد', status: 'success' },
            { time: '2024-03-03 13:15', action: 'تعديل الإعدادات', user: 'فاطمة علي', status: 'success' },
            { time: '2024-03-03 12:00', action: 'محاولة دخول فاشلة', user: 'محمود حسن', status: 'error' },
            { time: '2024-03-03 11:45', action: 'تصدير البيانات', user: 'أحمد محمد', status: 'success' },
            { time: '2024-03-03 10:30', action: 'إعادة تعيين كلمة المرور', user: 'فاطمة علي', status: 'success' }
          ].map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-black">{log.action}</p>
                <p className="text-xs text-gray-600 mt-1">{log.user} • {log.time}</p>
              </div>
              <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {log.status === 'success' ? 'نجح' : 'خطأ'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
