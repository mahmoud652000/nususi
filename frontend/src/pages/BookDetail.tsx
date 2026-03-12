import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksAPI } from '@/utils/api';
import { BookOpen, User, Calendar, Download, Eye, ArrowRight, FileText } from 'lucide-react';
import type { Book } from '@/types';

const categoryNames: Record<string, string> = {
  islamic: 'الكتب الإسلامية',
  literature: 'الأدب والروايات',
  science: 'العلوم والتكنولوجيا',
  history: 'التاريخ والجغرافيا',
  philosophy: 'الفلسفة والمنطق',
  law: 'القانون والسياسة',
  medicine: 'الطب والصحة',
  economy: 'الاقتصاد والإدارة',
  other: 'أخرى',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id!);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (book) {
      booksAPI.incrementDownload(book._id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">الكتاب غير موجود</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <Link to="/" className="hover:text-purple-700">الرئيسية</Link>
          <ArrowRight className="w-4 h-4" />
          <Link to="/books" className="hover:text-purple-700">الكتب</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white/50" />
              </div>
              <div className="p-6">
                <div className="flex gap-3">
                  <Link
                    to={`/read/${book._id}`}
                    className="flex-1 bg-purple-700 text-white text-center py-3 rounded-xl hover:bg-purple-800 transition font-bold"
                  >
                    قراءة الكتاب
                  </Link>
                  <a
                    href={`https://nususi-i5st.vercel.app/${book.fileUrl}`}
                    download
                    onClick={handleDownload}
                    className="flex-1 bg-amber-500 text-white text-center py-3 rounded-xl hover:bg-amber-600 transition font-bold"
                  >
                    تحميل
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm mb-4">
                {categoryNames[book.category] || book.category}
              </span>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{book.year || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Download className="w-5 h-5" />
                  <span>{book.downloads} تحميل</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span>{book.views} مشاهدة</span>
                </div>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">وصف الكتاب</h3>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات إضافية</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">حجم الملف</span>
                      <p className="font-medium">{(book.fileSize / 1024 / 1024).toFixed(2)} ميجابايت</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-500 text-sm">نشر بواسطة</span>
                      <p className="font-medium">
                        {typeof book.userId === 'object' ? book.userId.name : 'مستخدم'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
