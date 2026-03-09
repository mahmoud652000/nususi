import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAPI } from '@/utils/api';
import { Upload as UploadIcon, FileText, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'islamic', name: 'الكتب الإسلامية' },
  { id: 'literature', name: 'الأدب والروايات' },
  { id: 'science', name: 'العلوم والتكنولوجيا' },
  { id: 'history', name: 'التاريخ والجغرافيا' },
  { id: 'philosophy', name: 'الفلسفة والمنطق' },
  { id: 'law', name: 'القانون والسياسة' },
  { id: 'medicine', name: 'الطب والصحة' },
  { id: 'economy', name: 'الاقتصاد والإدارة' },
  { id: 'other', name: 'أخرى' },
];

export default function Upload() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    year: '',
    description: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('يرجى اختيار ملف PDF فقط');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('حجم الملف كبير جداً. الحد الأقصى 50 ميجابايت');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.category) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!selectedFile) {
      toast.error('يرجى اختيار ملف PDF');
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append('pdf', selectedFile);
      data.append('title', formData.title);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('year', formData.year);
      data.append('description', formData.description);

      await uploadAPI.uploadBook(data);
      toast.success('تم رفع الكتاب بنجاح!');
      navigate('/books');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء رفع الكتاب');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">رفع كتاب جديد</h1>
          <p className="text-gray-600">شارك معرفتك مع العالم - ارفع كتابك الآن</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-3">ملف PDF *</label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                  selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedFile(null);
                        }}
                        className="p-2 hover:bg-red-100 rounded-full transition"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="font-bold text-gray-700 mb-2">انقر لاختيار ملف PDF</p>
                      <p className="text-gray-500 text-sm">أو اسحب الملف هنا</p>
                      <p className="text-gray-400 text-xs mt-2">الحد الأقصى: 50 ميجابايت</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">عنوان الكتاب *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                  placeholder="أدخل عنوان الكتاب"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">المؤلف *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                  placeholder="اسم المؤلف"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">التصنيف *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">سنة النشر</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-bold mb-2">وصف الكتاب</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:border-purple-600 focus:outline-none"
                rows={4}
                placeholder="اكتب وصفاً مختصراً للكتاب..."
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-purple-700 to-amber-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري رفع الكتاب...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  رفع الكتاب
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
