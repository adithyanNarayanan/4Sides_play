import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Globe, User, Menu, X, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languagesList } from '@/data/translations';


export default function Navigation() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');

  const filteredLanguages = useMemo(() =>
    languagesList.filter(lang =>
      lang.name.toLowerCase().includes(languageSearch.toLowerCase())
    ), [languageSearch]);


  const navLinks = useMemo(() => [
    { name: t('home'), href: '/' },
    { name: t('movies'), href: '/movies' },
    { name: t('tvShows'), href: '/tv-shows' },
  ], [t]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'glass py-3'
        : 'bg-gradient-to-b from-black/80 to-transparent py-5'
        }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-tight hover:text-[#EAB308] transition-colors"
            >
              4Sides Play
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-base font-semibold tracking-wide transition-colors relative group ${location.pathname === link.href
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                      }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#EAB308] transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-[#EAB308] transition-colors"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Search Input */}
              <div
                className={`absolute right-0 top-full mt-2 transition-all duration-300 ${isSearchOpen
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
              >
                <form
                  onSubmit={handleSearch}
                  className="glass rounded-lg p-2 w-[calc(100vw-4rem)] sm:w-80 max-w-[320px]"
                >
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#EAB308]"
                    autoFocus={isSearchOpen}
                  />
                </form>
              </div>
            </div>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="hidden sm:block p-2 text-white hover:text-[#EAB308] transition-colors"
                aria-label="Change Language"
              >
                <Globe className="w-6 h-6" />
              </button>

              {/* Language Dropdown */}
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass rounded-lg overflow-hidden border border-white/10 animate-fade-in flex flex-col max-h-[60vh]">
                  <div className="p-2 border-b border-white/10 sticky top-0 bg-[#1A1A1A]/95 backdrop-blur-xl z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-8 pr-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#EAB308]/50 transition-colors"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar p-1">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                            setLanguageSearch('');
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/10 transition-colors rounded-md ${language === lang.code ? 'text-[#EAB308] bg-white/5' : 'text-white/90'
                            }`}
                        >
                          {lang.name}
                          {language === lang.code && <Check className="w-4 h-4" />}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/40 text-xs">
                        No languages found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <Link
              to="/auth"
              className="hidden sm:block px-5 py-2 rounded-full border border-white/20 text-white font-semibold hover:bg-white hover:text-black transition-all duration-300"
            >
              Sign In
            </Link>

            {/* User Avatar */}
            <Link
              to="/profile"
              className={`flex items-center gap-2 p-1 rounded-full transition-colors ${location.pathname === '/profile' ? 'bg-[#EAB308]/30' : 'hover:bg-white/10'
                }`}
              aria-label="User menu"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EAB308] to-[#FACC15] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-[#EAB308] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-64 mt-4' : 'max-h-0'
            }`}
        >
          <ul className="flex flex-col gap-2 py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`block py-2 transition-colors ${location.pathname === link.href
                    ? 'text-[#EAB308]'
                    : 'text-white/80 hover:text-white'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/auth"
                className={`block py-2 transition-colors ${location.pathname === '/auth'
                  ? 'text-[#EAB308]'
                  : 'text-white/80 hover:text-white'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </li>
            {/* Mobile Language Selector */}
            <li className="pt-4 mt-2 border-t border-white/10">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-white/50 text-xs uppercase">Language</p>
              </div>

              <div className="relative mb-3 mx-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#EAB308]/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMobileMenuOpen(false);
                        setLanguageSearch('');
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${language === lang.code
                        ? 'bg-[#EAB308] border-[#EAB308] text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))
                ) : (
                  <div className="w-full py-2 text-center text-white/40 text-sm">
                    No languages found
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
