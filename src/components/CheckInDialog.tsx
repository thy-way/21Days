import React, { useState } from 'react';
import { X, Check, Camera } from 'lucide-react';
import { cn } from '@/utils';

interface TaskCheckInDialogProps {
  open: boolean;
  onClose: () => void;
  planTaskName?: string;
  onConfirm: (duration?: number, quantity?: number, note?: string, photo?: string) => void;
}

export const TaskCheckInDialog: React.FC<TaskCheckInDialogProps> = ({
  open, onClose, planTaskName, onConfirm,
}) => {
  const [duration, setDuration] = useState(30);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mode, setMode] = useState<'duration' | 'quantity'>('duration');

  if (!open || !planTaskName) return null;

  const handleConfirm = () => {
    if (mode === 'duration') {
      onConfirm(duration, undefined, note || undefined, photo || undefined);
    } else {
      onConfirm(undefined, quantity, note || undefined, photo || undefined);
    }
    setShowSuccess(true);
    setTimeout(() => {
      setNote('');
      setPhoto('');
      setShowPhotoInput(false);
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        {showSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-600 mb-2">记录已保存！</p>
            <p className="text-gray-500 text-sm">继续加油！</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{planTaskName}</h3>
              <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setMode('duration')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'duration' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500')}>
                按时长
              </button>
              <button onClick={() => setMode('quantity')}
                className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all', mode === 'quantity' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500')}>
                按数量
              </button>
            </div>

            {mode === 'duration' ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">时长（分钟）</label>
                <div className="flex items-center space-x-4">
                  <input type="range" min="5" max="180" step="5" value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  <span className="text-2xl font-bold text-orange-600 w-16 text-right">{duration}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5分钟</span><span>180分钟</span></div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">数量（次）</label>
                <div className="flex items-center justify-center space-x-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-2xl font-bold">-</button>
                  <span className="text-4xl font-bold text-gray-900 w-20 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-2xl font-bold">+</button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">备注（可选）</label>
              <input type="text" placeholder="添加备注..." value={note} onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="mb-4">
              <button type="button" onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <Camera className="w-4 h-4 mr-1.5" />
                {photo ? '更换照片' : '添加照片（可选）'}
              </button>
              {showPhotoInput && (
                <div className="mt-3">
                  {photo ? (
                    <div className="relative">
                      <img src={photo} alt="打卡照片" className="w-full h-40 object-cover rounded-xl" />
                      <button onClick={() => setPhoto('')}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <Camera className="w-8 h-8 mb-2 text-orange-400" />
                      <span className="text-sm text-gray-500">点击上传照片</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleConfirm}
              className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold text-base hover:bg-orange-600 transition-colors">
              确认打卡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
