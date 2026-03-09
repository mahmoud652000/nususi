import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Search, 
  User, 
  Upload, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  Home,
  Library,
  BookMarked,
  FlaskConical,
  Scroll,
  HelpCircle,
  Phone,
  Bell,
  ChevronDown,
  Settings,
  Heart,
  BookUp,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to close menus
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path) || location.search.includes(path.split('?')[1] || '');
  };

  const navItems: NavItem[] = [
    { to: '/', label: 'الرئيسية', icon: Home },
    { to: '/books', label: 'الكتب', icon: Library, badge: 'جديد' },
    { to: '/books?category=islamic', label: 'إسلامي', icon: BookMarked },
    { to: '/books?category=literature', label: 'أدبي', icon: Scroll },
    { to: '/books?category=science', label: 'علمي', icon: FlaskConical },
    { to: '/books?category=history', label: 'تاريخ', icon: BookOpen },
  ];

  const userMenuItems = [
    { to: '/profile', label: 'الملف الشخصي', icon: User, color: 'text-gray-700' },
    { to: '/favorites', label: 'المفضلة', icon: Heart, color: 'text-red-600' },
    { to: '/my-books', label: 'كتبي', icon: BookUp, color: 'text-purple-600' },
    { to: '/settings', label: 'الإعدادات', icon: Settings, color: 'text-gray-700' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-xl' 
          : 'bg-white shadow-lg'
      }`}
    >
      {/* Top bar - Hidden on scroll */}
      <div 
        className={`bg-gradient-to-r from-purple-900 via-purple-800 to-amber-600 text-white transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="container mx-auto px-4 py-2.5 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مرحباً بك في نصوصي - عالم من المعرفة بين يديك</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/help" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors duration-200 hover:scale-105">
              <HelpCircle className="w-4 h-4" />
              المساعدة
            </Link>
            <Link to="/contact" className="flex items-center gap-1.5 hover:text-amber-300 transition-colors duration-200 hover:scale-105">
              <Phone className="w-4 h-4" />
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Logo - أكبر وأكثر ديناميكية */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className={`relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center ${
              isScrolled ? 'w-12 h-12' : 'w-20 h-20'
            }`}>
              {!imageError ? (
                <img 
                  src="/nususi-logo2.png" 
                  alt="نصوصي" 
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-purple-700">
                  <BookOpen className={`text-white transition-all duration-300 ${isScrolled ? 'w-6 h-6' : 'w-10 h-10'}`} />
                </div>
              )}
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className={`hidden sm:block transition-all duration-300 ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                نصوصي
              </h1>
              <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-500" />
                مكتبة الكتب الإلكترونية
              </span>
            </div>
          </Link>

          {/* Search - محسّنة مع تأثيرات */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث عن كتاب، مؤلف، أو قسم... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full px-5 py-3.5 pr-12 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all duration-300 placeholder:text-gray-400 ${
                  searchFocused 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className={`w-5 h-5 transition-all duration-300 ${searchFocused ? 'text-purple-500 scale-110' : ''}`} />
              </div>
              <button
                type="submit"
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-white p-2.5 rounded-xl transition-all duration-200 ${
                  searchQuery.trim() 
                    ? 'bg-purple-600 hover:bg-purple-700 hover:scale-105 shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!searchQuery.trim()}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions - أكثر ديناميكية */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <button 
                  className="relative p-3 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                  onClick={() => setNotifications(0)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                      {notifications}
                    </span>
                  )}
                </button>

                {/* Upload Button */}
                <Link
                  to="/upload"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 font-medium group"
                >
                  <Upload className="w-4 h-4 group-hover:animate-bounce" />
                  <span>رفع كتاب</span>
                </Link>

                {/* Admin Dashboard */}
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-800 text-white px-5 py-2.5 rounded-xl hover:from-purple-800 hover:to-purple-900 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all duration-200 ${
                      isProfileOpen ? 'bg-purple-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center border-2 border-purple-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-purple-700" />
                      )}
                    </div>
                    <div className="hidden lg:block text-right">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name || 'المستخدم'}</p>
                      <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير' : 'عضو'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-amber-50">
                        <p className="font-bold text-gray-800">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${item.color}`}
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 border-2 border-purple-700 text-purple-700 rounded-xl hover:bg-purple-700 hover:text-white transition-all duration-200 font-medium hover:scale-105 active:scale-95"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-xl hover:from-purple-800 hover:to-purple-900 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 font-medium"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            <div className="relative w-6 h-6">
              <X className={`w-6 h-6 text-purple-700 absolute transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
              <Menu className={`w-6 h-6 text-gray-700 absolute transition-all duration-300 ${isMenuOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Navigation - sticky with scroll effect */}
      <nav 
        className={`bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white hidden md:block transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-4">
          <ul className="flex gap-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`relative flex items-center gap-2 px-5 py-3.5 transition-all duration-200 whitespace-nowrap font-medium text-sm group ${
                      active 
                        ? 'bg-white/20 text-amber-300' 
                        : 'hover:bg-white/10 hover:text-amber-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-amber-500 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile menu - محسّن */}
      <div 
        className={`md:hidden fixed inset-0 top-[${isScrolled ? '60px' : '140px'}] bg-white transition-all duration-300 overflow-auto ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن كتاب، مؤلف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition text-lg"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </form>

          {/* Mobile Nav Items */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                    active 
                      ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                      : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Section */}
          <div className="border-t pt-6 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center">
                    <User className="w-7 h-7 text-purple-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{user.name || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <Link
                  to="/upload"
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Upload className="w-6 h-6" />
                  رفع كتاب
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-800 text-white font-bold text-lg hover:shadow-lg transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-6 h-6" />
                    لوحة التحكم
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-6 h-6" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-purple-700 text-purple-700 font-bold text-lg hover:bg-purple-700 hover:text-white transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-800 text-white font-bold text-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}