import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksAPI } from '@/utils/api';
import { ArrowRight, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import type { Book } from '@/types';

export default function ReadBook() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">الكتاب غير موجود</h2>
        </div>
      </div>
    );
  }

  const pdfUrl = `http://localhost:5000${book.fileUrl}`;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/books/${book._id}`} className="flex items-center gap-2 hover:text-amber-400 transition">
              <ArrowRight className="w-5 h-5" />
              <span className="hidden md:inline">رجوع</span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <h1 className="font-bold truncate max-w-xs md:max-w-md">{book.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm w-16 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600"></div>

            <a
              href={pdfUrl}
              download
              onClick={handleDownload}
              className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline">تحميل</span>
            </a>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="container mx-auto px-4 py-8">
        <div 
          className="bg-white rounded-lg shadow-2xl overflow-hidden mx-auto"
          style={{ 
            width: `${zoom}%`, 
            maxWidth: '100%',
            transform: 'translateX(0)',
          }}
        >
          <iframe
            src={`${pdfUrl}#page=${currentPage}`}
            className="w-full"
            style={{ height: 'calc(100vh - 200px)' }}
            title={book.title}
          />
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </button>
          <span className="text-white">
            الصفحة {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            التالي
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
