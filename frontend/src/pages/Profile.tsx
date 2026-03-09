import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/utils/api';
import { User, Mail, BookOpen, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = async () => {
    try {
      const response = await authAPI.updateProfile(name);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('تم تحديث الملف الشخصي');
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلومات حسابك</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-amber-500 p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-purple-700" />
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-white/80">{user?.role === 'admin' ? 'مدير' : 'مستخدم'}</p>
          </div>

          {/* Info */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">الاسم</label>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                      />
                      <button
                        onClick={handleSave}
                        className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                        }}
                        className="p-3 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 px-4 py-3 bg-gray-50 rounded-xl flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{user?.name}</span>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <BookOpen className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">{user?.booksCount || 0}</p>
                  <p className="text-gray-600">كتب منشورة</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <User className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-600">
                    {user?.role === 'admin' ? 'مدير' : 'مستخدم'}
                  </p>
                  <p className="text-gray-600">الصلاحية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
