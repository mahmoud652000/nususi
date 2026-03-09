import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { booksAPI } from '@/utils/api';
import { 
  BookOpen, 
  Users, 
  Eye, 
  Download, 
  Search, 
  Upload, 
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Share2,
  PlayCircle,
  BookMarked,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import type { Book } from '@/types';

const categories = [
  { id: 'islamic', name: 'الكتب الإسلامية', icon: BookMarked, color: 'from-emerald-500 to-teal-600', count: '1,200+' },
  { id: 'literature', name: 'الأدب والروايات', icon: BookOpen, color: 'from-blue-500 to-indigo-600', count: '2,500+' },
  { id: 'science', name: 'العلوم والتكنولوجيا', icon: Zap, color: 'from-purple-500 to-violet-600', count: '980+' },
  { id: 'history', name: 'التاريخ والجغرافيا', icon: Clock, color: 'from-amber-500 to-orange-600', count: '850+' },
  { id: 'philosophy', name: 'الفلسفة والمنطق', icon: Star, color: 'from-rose-500 to-pink-600', count: '420+' },
  { id: 'law', name: 'القانون والسياسة', icon: Award, color: 'from-cyan-500 to-blue-600', count: '360+' },
  { id: 'medicine', name: 'الطب والصحة', icon: Heart, color: 'from-red-500 to-rose-600', count: '520+' },
  { id: 'economy', name: 'الاقتصاد والإدارة', icon: TrendingUp, color: 'from-green-500 to-emerald-600', count: '680+' },
];

const features = [
  { icon: Download, title: 'تحميل مجاني', desc: 'جميع الكتب متاحة للتحميل بصيغة PDF' },
  { icon: Sparkles, title: 'جودة عالية', desc: 'كتب بجودة عالية ومراجعه احترافية' },
  { icon: Users, title: 'مجتمع نشط', desc: 'انضم لمجتمع من القراء والمؤلفين' },
  { icon: Flame, title: 'تحديث مستمر', desc: 'إضافة كتب جديدة يومياً' },
];

export default function Home() {
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalDownloads: 0,
    totalViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    fetchData();
    setupIntersectionObserver();
  }, []);

  const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
  };

  const fetchData = async () => {
    try {
      const [latestRes, popularRes] = await Promise.all([
        booksAPI.getLatest(),
        booksAPI.getPopular?.() || Promise.resolve({ data: [] }),
      ]);
      
      setLatestBooks(latestRes.data.slice(0, 8));
      setPopularBooks(popularRes.data.slice(0, 8) || latestRes.data.slice(0, 8));
      
      const allBooks = latestRes.data;
      const authors = new Set(allBooks.map((b: Book) => b.author));
      const downloads = allBooks.reduce((sum: number, b: Book) => sum + (b.downloads || 0), 0);
      const views = allBooks.reduce((sum: number, b: Book) => sum + (b.views || 0), 0);
      
      setStats({
        totalBooks: allBooks.length * 15, // تقديري
        totalAuthors: authors.size * 8,
        totalDownloads: downloads * 120,
        totalViews: views * 50,
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const displayedBooks = activeTab === 'latest' ? latestBooks : popularBooks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - محسّن */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">أكبر مكتبة إلكترونية عربية</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              اكتشف عالماً من
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                المعرفة والإلهام
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              أكثر من <span className="font-bold text-amber-300">50,000</span> كتاب في مختلف المجالات، 
              متاحة للقراءة والتحميل المجاني
            </p>
            
            {/* Search Bar in Hero */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full px-6 py-5 pr-14 text-gray-800 rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-amber-500/30 transition-all text-lg"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-purple-700 text-white px-6 py-2.5 rounded-xl hover:bg-purple-800 transition-colors font-medium"
                >
                  بحث
                </button>
              </div>
            </form>
            
            {/* Quick Stats in Hero */}
            <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                50,000+ كتاب
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                10,000+ مؤلف
              </span>
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                مليون تحميل
              </span>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features Section - جديد */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-purple-700" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - متحركة */}
      <section ref={statsRef} className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, value: stats.totalBooks, label: 'كتاب متاح', color: 'purple' },
              { icon: Users, value: stats.totalAuthors, label: 'مؤلف', color: 'amber' },
              { icon: Eye, value: stats.totalViews, label: 'مشاهدة', color: 'blue' },
              { icon: Download, value: stats.totalDownloads, label: 'تحميل', color: 'green' },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className={`text-center p-8 rounded-3xl bg-gradient-to-br from-${stat.color}-50 to-white border border-${stat.color}-100 hover:shadow-2xl transition-all duration-500 transform ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className={`w-20 h-20 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform`}>
                  <stat.icon className={`w-10 h-10 text-${stat.color}-600`} />
                </div>
                <span className="text-4xl font-bold text-gray-900 mb-2 block">
                  {statsVisible ? formatNumber(stat.value) : '0'}
                </span>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - محسّنة */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-purple-700 font-semibold mb-4 text-lg">التصنيفات</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">تصفح حسب القسم</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              اختر من بين مجموعة متنوعة من الأقسام والتصنيفات التي تناسب اهتماماتك
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/books?category=${cat.id}`}
                className="group relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">
                  {cat.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{cat.count} كتاب</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section - محسّنة مع تبويبات */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-right">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">كتب مميزة</h2>
              <p className="text-gray-600 text-lg">اكتشف أحدث الإضافات والأكثر شعبية</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('latest')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'latest' 
                    ? 'bg-white text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                أحدث الكتب
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'popular' 
                    ? 'bg-white text-purple-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Flame className="w-4 h-4" />
                الأكثر شعبية
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin delay-150" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {displayedBooks.map((book, idx) => (
                  <BookCard key={book._id} book={book} index={idx} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-700 to-purple-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  عرض جميع الكتب
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section - جديد */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              هل لديك كتاب تريد مشاركته؟
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              انضم لمجتمعنا من المؤلفين والقراء وشارك معرفتك مع العالم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/upload"
                className="flex items-center justify-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <Upload className="w-6 h-6" />
                رفع كتاب الآن
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/30"
              >
                <PlayCircle className="w-6 h-6" />
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BookCard({ book, index }: { book: Book; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
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

  const categoryColors: Record<string, string> = {
    islamic: 'from-emerald-500 to-teal-600',
    literature: 'from-blue-500 to-indigo-600',
    science: 'from-purple-500 to-violet-600',
    history: 'from-amber-500 to-orange-600',
    philosophy: 'from-rose-500 to-pink-600',
    law: 'from-cyan-500 to-blue-600',
    medicine: 'from-red-500 to-rose-600',
    economy: 'from-green-500 to-emerald-600',
    other: 'from-gray-500 to-gray-600',
  };

  return (
    <div 
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-3"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/books/${book._id}`} className="block relative">
        <div className={`h-56 bg-gradient-to-br ${categoryColors[book.category] || categoryColors.other} flex items-center justify-center relative overflow-hidden`}>
          {/* Animated Background */}
          <div className={`absolute inset-0 bg-white/20 transform transition-transform duration-700 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
          
          <BookOpen className={`w-20 h-20 text-white/30 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-3' : ''}`} />
          
          {/* Category Badge */}
          <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full border border-white/30 font-medium">
            {categoryNames[book.category] || book.category}
          </span>
          
          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-red-500" />
            </button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5 text-purple-700" />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/books/${book._id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors text-lg">
            {book.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <Users className="w-4 h-4" />
          <span className="text-sm">{book.author}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Download className="w-4 h-4" />
              {book.downloads || 0}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Eye className="w-4 h-4" />
              {book.views || 0}
            </span>
          </div>
          
          <span className="text-xs text-gray-400 font-medium">
            {book.year || '2024'}
          </span>
        </div>
      </div>
    </div>
  );
}