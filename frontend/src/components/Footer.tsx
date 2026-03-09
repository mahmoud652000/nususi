import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft,
  ExternalLink,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  ArrowUp,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';

const categories = [
  { id: 'islamic', name: 'الكتب الإسلامية', count: '1,200+' },
  { id: 'literature', name: 'الأدب والروايات', count: '2,500+' },
  { id: 'science', name: 'العلوم والتكنولوجيا', count: '980+' },
  { id: 'history', name: 'التاريخ والجغرافيا', count: '850+' },
  { id: 'philosophy', name: 'الفلسفة والمنطق', count: '420+' },
  { id: 'law', name: 'القانون والسياسة', count: '360+' },
];

const quickLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/books', label: 'تصفح الكتب' },
  { to: '/upload', label: 'رفع كتاب' },
  { to: '/authors', label: 'المؤلفون' },
  { to: '/about', label: 'عن نصوصي' },
  { to: '/contact', label: 'اتصل بنا' },
  { to: '/privacy', label: 'سياسة الخصوصية' },
  { to: '/terms', label: 'شروط الاستخدام' },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'تويتر', color: 'hover:bg-blue-500' },
  { icon: Instagram, href: '#', label: 'انستغرام', color: 'hover:bg-pink-500' },
  { icon: Linkedin, href: '#', label: 'لينكد إن', color: 'hover:bg-blue-700' },
  { icon: Github, href: '#', label: 'جيت هاب', color: 'hover:bg-gray-700' },
];

export default function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-amber-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">اشترك في نشرتنا البريدية</h3>
            <p className="text-white/80 mb-8 text-lg">
              احصل على آخر الكتب المضافة والأخبار الحصرية مباشرة إلى بريدك
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition"
                  dir="rtl"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
                اشتراك
              </button>
            </form>
            
            {isSubscribed && (
              <div className="mt-4 text-amber-300 font-medium animate-bounce">
                ✅ تم الاشتراك بنجاح!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Column - مع صورة الشعار */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-6 group">
              {/* صورة الشعار */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center">
                {!imageError ? (
                  <img 
                    src="/nususi-logo2.png" 
                    alt="نصوصي" 
                    className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-purple-700">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold">نصوصي</h3>
                <span className="text-xs text-gray-400">مكتبة الكتب الإلكترونية</span>
              </div>
            </Link>
            
            <p className="text-gray-400 leading-relaxed mb-6">
              منصة نصوصي هي أكبر مكتبة إلكترونية عربية، تهدف إلى نشر المعرفة والثقافة في العالم العربي من خلال توفير آلاف الكتب بجودة عالية.
            </p>
            
            {/* المطور */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">تطوير وتصميم</p>
                  <p className="font-bold text-white">Mahmoud Elbana</p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded-full"></span>
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to}
                    className={`group flex items-center gap-2 transition-all duration-200 ${
                      isActive(link.to) 
                        ? 'text-amber-400 font-medium' 
                        : 'text-gray-400 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <ChevronLeft className={`w-4 h-4 transition-transform ${isActive(link.to) ? 'text-amber-400' : 'group-hover:text-amber-400'}`} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
              التصنيفات
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    to={`/books?category=${cat.id}`}
                    className="group flex items-center justify-between text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
                      {cat.name}
                    </span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded-full group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/books"
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium mt-4"
                >
                  عرض جميع التصنيفات
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - المعدل */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
              تواصل معنا
            </h4>
            
            <ul className="space-y-4">
              {/* البريد الإلكتروني الجديد */}
              <li className="group">
                <a 
                  href="mailto:mahemoudgamal6@gmail.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm text-gray-500 mb-1">البريد الإلكتروني</span>
                    <span className="font-medium text-sm break-all">mahemoudgamal6@gmail.com</span>
                  </div>
                </a>
              </li>
              
              {/* رقم الهاتف الجديد */}
              <li className="group">
                <a 
                  href="tel:01558016258"
                  className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">رقم الهاتف</span>
                    <span className="font-medium" dir="ltr">01558016258</span>
                  </div>
                </a>
              </li>
              
              {/* الموقع الجديد */}
              <li className="group">
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">الموقع</span>
                    <span className="font-medium">جمهورية مصر العربية</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1 flex-wrap justify-center">
              جميع الحقوق محفوظة © {new Date().getFullYear()} نصوصي - مكتبة الكتب الإلكترونية
              <Heart className="w-4 h-4 text-red-500 inline mx-1 fill-current" />
              <span className="text-gray-600">| صنع بإتقان بواسطة</span>
              <span className="text-amber-400 font-medium">Mahmoud Elbana</span>
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <Link to="/terms" className="hover:text-white transition-colors">شروط الاستخدام</Link>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <Link to="/sitemap" className="hover:text-white transition-colors">خريطة الموقع</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed left-8 bottom-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-amber-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl z-50 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
        aria-label="العودة للأعلى"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}