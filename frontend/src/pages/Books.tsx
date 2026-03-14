import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { booksAPI } from '@/utils/api';
import { BookOpen, Download, Search, Filter, Loader2 } from 'lucide-react';
import type { Book } from '@/types';

const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'islamic', name: 'إسلامي' },
  { id: 'literature', name: 'أدبي' },
  { id: 'science', name: 'علمي' },
  { id: 'history', name: 'تاريخ' },
  { id: 'philosophy', name: 'فلسفة' },
  { id: 'law', name: 'قانون' },
  { id: 'medicine', name: 'طب' },
  { id: 'economy', name: 'اقتصاد' },
  { id: 'other', name: 'أخرى' },
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      
      const response = await booksAPI.getAll({
        category: category || undefined,
        search: search || undefined,
      });
      
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category !== 'all') params.set('category', category);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جميع الكتب</h1>
          <p className="text-gray-600">استكشف مكتبتنا المتنوعة من الكتب</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border rounded-xl focus:border-purple-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-3 rounded-xl hover:bg-purple-800 transition"
            >
              بحث
            </button>
          </form>

          {/* Categories */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">التصنيف:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategory === cat.id
                      ? 'bg-purple-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد كتب</h3>
            <p className="text-gray-500">لم يتم العثور على كتب مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group">
      <Link to={`/books/${book._id}`}>
        <div className="h-56 bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center relative">
          <BookOpen className="w-16 h-16 text-white/50" />
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full">
            {categoryNames[book.category] || book.category}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/books/${book._id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-700 transition">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3">
          <span className="inline-block ml-1">✍️</span>
          {book.author}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {book.downloads}
          </span>
          <span>{book.year || 'غير محدد'}</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/read/${book._id}`}
            className="flex-1 bg-purple-700 text-white text-center py-2 rounded-lg hover:bg-purple-800 transition text-sm"
          >
            قراءة
          </Link>
          <a
            href={`http://localhost:5000/${book.fileUrl}`}
            download
            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-200 transition text-sm"
            onClick={() => booksAPI.incrementDownload(book._id)}
          >
            تحميل
          </a>
        </div>
      </div>
    </div>
  );
}
