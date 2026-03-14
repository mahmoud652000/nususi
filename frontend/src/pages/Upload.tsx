import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAPI } from '@/utils/api';
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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    year: '',
    pages: '',
    status: 'approved',
  });

  const userId = '64fa2b1234567890abcdef12'; // ضع هنا ObjectId للمستخدم الحالي

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isCover = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isCover && file.type !== 'application/pdf') {
      toast.error('يرجى اختيار ملف PDF فقط');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('حجم الملف كبير جداً. الحد الأقصى 50 ميجابايت');
      return;
    }

    if (isCover) setCoverFile(file);
    else setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.category || !selectedFile) {
      toast.error('يرجى ملء جميع الحقول المطلوبة ورفع ملف الكتاب');
      return;
    }

    setIsUploading(true);

    try {
      const data = new FormData();
      data.append('file', selectedFile);
      if (coverFile) data.append('cover', coverFile);

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      data.append('userId', userId);
      data.append('downloads', '0');
      data.append('views', '0');

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
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-3">ملف الكتاب (PDF) *</label>
              <input type="file" accept=".pdf" onChange={(e) => handleFileSelect(e)} />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-3">غلاف الكتاب (اختياري)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, true)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="عنوان الكتاب *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="المؤلف *"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">اختر التصنيف *</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="سنة النشر"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="number"
                placeholder="عدد صفحات الكتاب"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="approved">موافق عليه</option>
                <option value="pending">قيد المراجعة</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            <textarea
              placeholder="وصف الكتاب"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <button
              type="submit"
              disabled={isUploading}
              className="mt-6 w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {isUploading ? 'جاري رفع الكتاب...' : 'رفع الكتاب'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}