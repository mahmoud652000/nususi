import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { dashboardAPI, booksAPI } from '@/utils/api';
import { 
  BookOpen, Users, Download, Eye, 
  TrendingUp, Clock, FileText, Trash2,
  LayoutDashboard, BookOpen as BookIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Book, DashboardStats } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'my-books'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, myBooksRes] = await Promise.all([
        dashboardAPI.getStats(),
        booksAPI.getMyBooks(),
      ]);
      setStats(statsRes.data);
      setMyBooks(myBooksRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return;
    
    try {
      await booksAPI.delete(bookId);
      setMyBooks(myBooks.filter(b => b._id !== bookId));
      toast.success('تم حذف الكتاب بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الكتاب');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const categoryNames: Record<string, string> = {
    islamic: 'إسلامي',
    literature: 'أدبي',
    science: 'علمي',
    history: 'تاريخ',
    philosophy: 'فلسفة',
    law: 'قانون',
    medicine: 'طب',
    economy: 'اقتصاد',
    other: 'أخرى',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً، {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'overview'
                ? 'bg-purple-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('my-books')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
              activeTab === 'my-books'
                ? 'bg-purple-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookIcon className="w-5 h-5" />
            كتبي
          </button>
        </div>

        {activeTab === 'overview' && stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-700" />
                  </div>
                  <span className="text-green-500 text-sm font-bold">+12%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.stats.totalBooks}</p>
                <p className="text-gray-600">إجمالي الكتب</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-green-500 text-sm font-bold">+8%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                <p className="text-gray-600">المستخدمين</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-green-500 text-sm font-bold">+24%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.stats.totalDownloads}</p>
                <p className="text-gray-600">التحميلات</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-500 text-sm font-bold">+18%</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.stats.totalViews}</p>
                <p className="text-gray-600">المشاهدات</p>
              </div>
            </div>

            {/* Recent & Top Books */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Books */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-purple-700" />
                  <h2 className="text-xl font-bold">أحدث الكتب</h2>
                </div>
                <div className="space-y-4">
                  {stats.recentBooks.map((book) => (
                    <div key={book._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(book.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Books */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold">الأكثر تحميلاً</h2>
                </div>
                <div className="space-y-4">
                  {stats.topBooks.map((book, index) => (
                    <div key={book._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                      <span className="text-sm text-purple-700 font-bold">
                        {book.downloads} تحميل
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'my-books' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">كتبي المنشورة</h2>
              <Link
                to="/upload"
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
              >
                + رفع كتاب جديد
              </Link>
            </div>

            {myBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لم تقم برفع أي كتب بعد</p>
                <Link
                  to="/upload"
                  className="inline-block mt-4 text-purple-700 font-bold hover:underline"
                >
                  ارفع أول كتاب
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">الكتاب</th>
                      <th className="text-right py-3 px-4">التصنيف</th>
                      <th className="text-right py-3 px-4">التحميلات</th>
                      <th className="text-right py-3 px-4">المشاهدات</th>
                      <th className="text-right py-3 px-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBooks.map((book) => (
                      <tr key={book._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold">{book.title}</p>
                              <p className="text-sm text-gray-500">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {categoryNames[book.category] || book.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">{book.downloads}</td>
                        <td className="py-4 px-4">{book.views}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/books/${book._id}`}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
