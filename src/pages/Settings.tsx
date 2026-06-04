import React, { useState, useRef } from 'react';
import { useSettingsStore, useCheckInStore, useAuthStore, DEFAULT_AVATARS } from '@/store';
import { Dialog } from '@/components/ui/Dialog';
import { Switch } from '@/components/ui/Switch';
import { CATEGORY_STYLES } from '@/utils/categoryStyles';
import { cn } from '@/utils';
import { Download, Upload, Trash2, AlertTriangle, Flame, LogOut, Camera, Edit2, Settings as SettingsIcon, LayoutGrid, Bell, Database, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const {
    categories,
    settings,
    updateCategoryGoal,
    toggleCategory,
    setReminder,
    exportData,
    importData,
    resetToDefaults,
  } = useSettingsStore();
  const { streak } = useCheckInStore();
  const { profile, logout, updateProfile, setAvatar } = useAuthStore();
  const navigate = useNavigate();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: profile.username,
    bio: profile.bio || '',
    phone: profile.phone || '',
    email: profile.email || '',
  });

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      navigate('/login');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `21days-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setExporting(false);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        await importData(text);
        alert('导入成功！');
        window.location.reload();
      } catch (error) {
        alert('导入失败，请检查文件格式');
      }
      setImporting(false);
    };
    input.click();
  };

  const handleReset = async () => {
    await resetToDefaults();
    setResetDialogOpen(false);
    window.location.reload();
  };

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditProfileOpen(false);
  };

  const handleAvatarSelect = (emoji: string) => {
    setAvatar(emoji);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCustomAvatar = profile.avatar && !DEFAULT_AVATARS.includes(profile.avatar);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-3 bg-orange-500 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="brand-text-gradient">21Days</span>
            </div>
          </h1>
          <p className="text-amber-600/60 dark:text-amber-400/60 mt-1 text-sm">自定义你的打卡体验</p>
        </div>

        {/* Profile Section */}
        <div className="card-warm p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl overflow-hidden">
                  {isCustomAvatar ? (
                    <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile.avatar ? profile.avatar : <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              {/* Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.username || '未设置用户名'}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.bio || '点击编辑完善个人资料'}</p>
              </div>
            </div>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Streak */}
        <div className="card-warm p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-orange-500 mb-2">
                <Flame className="w-8 h-8" />
                <span className="text-5xl font-bold">{streak}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">连续打卡天数</p>
            </div>
          </div>
        </div>

        <div className="card-warm p-5 sm:p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-orange-500" />
            分类管理
          </h2>
          <div className="space-y-3">
            {categories.map((cat) => {
              const styles = CATEGORY_STYLES[cat.id];
              return (
                <div key={cat.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={cn('w-3 h-3 rounded-full', styles.bg)} />
                    <span className="text-gray-900 dark:text-gray-100">{cat.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={cat.dailyGoal || 1}
                      onChange={(e) => updateCategoryGoal(cat.id, Number(e.target.value))}
                      className="text-sm border border-orange-200 dark:border-orange-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>每日 {n} 次</option>
                      ))}
                    </select>
                    <Switch
                      checked={cat.enabled}
                      onChange={() => toggleCategory(cat.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-warm p-5 sm:p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            提醒设置
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">每日提醒</span>
              <Switch
                checked={settings.reminderEnabled}
                onChange={(checked) => setReminder(checked, settings.reminderTime)}
              />
            </div>
            {settings.reminderEnabled && (
              <select
                value={settings.reminderTime}
                onChange={(e) => setReminder(true, e.target.value)}
                className="w-full text-sm border border-orange-200 dark:border-orange-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={`${String(i).padStart(2, '0')}:00`}>
                    {String(i).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="card-warm p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            数据管理
          </h2>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Download className="w-5 h-5 mr-3 text-blue-500" />
              导出数据
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Upload className="w-5 h-5 mr-3 text-green-500" />
              导入数据
            </button>
            <button
              onClick={() => setResetDialogOpen(true)}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              清空所有数据
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-red-200 dark:border-red-800"
          >
            <LogOut className="w-5 h-5 mr-2" />
            退出登录
          </button>
        </div>
      </div>

      {/* Reset Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} title="确认清空">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/20 p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">此操作将清除所有打卡记录，无法恢复！</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setResetDialogOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              取消
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              确认清空
            </button>
          </div>
        </div>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} title="编辑个人资料">
        <div className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">头像</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl overflow-hidden">
                {isCustomAvatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.avatar ? profile.avatar : <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  上传照片
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
            {/* Emoji Options */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">或选择表情</p>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAvatarSelect(emoji)}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all',
                      profile.avatar === emoji
                        ? 'bg-orange-100 dark:bg-orange-500/30 ring-2 ring-orange-500'
                        : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              className="w-full px-4 py-2 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              placeholder="请输入用户名"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label>
            <input
              type="text"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-4 py-2 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              placeholder="介绍一下自己"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">手机号</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-4 py-2 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              placeholder="请输入手机号"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2 border border-orange-200 dark:border-orange-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
              placeholder="请输入邮箱"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setEditProfileOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              取消
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              保存
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
