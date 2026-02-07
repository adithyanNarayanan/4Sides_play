import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDetail, usePlanList, useContinueWatchList } from '@/hooks/useApi';
import { updateProfile } from '@/lib/api';
import { User, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, Edit2, Check, X, ChevronRight, Star, Clock, Eye, Heart, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: userDetail, isLoading: isLoadingUser } = useUserDetail();
  const { data: planData } = usePlanList();
  const { data: continueWatchData } = useContinueWatchList();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSavingName, setIsSavingName] = useState(false);

  const profileTabs = [
    { id: 'overview', label: t('overview'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'privacy', label: t('privacy'), icon: Shield },
    { id: 'billing', label: t('billing'), icon: CreditCard },
  ];
  const [isEditing, setIsEditing] = useState(false);

  // Use API user data or auth context user data
  const userData = userDetail?.data || user;
  const displayName = userData?.name || 'User';
  const userEmail = userData?.email || '';
  const profileImage = userDetail?.data?.profile_image || (user as { profileImage?: string })?.profileImage;

  const [tempName, setTempName] = useState(displayName);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Watch stats from continue watch data
  const watchStats = {
    totalWatched: continueWatchData?.data?.length || 0,
    hoursWatched: 0,
    favoriteGenre: '--',
    streak: 0,
  };

  // Plans from API
  const plans = planData?.data || [];

  const handleSaveName = async () => {
    setIsSavingName(true);
    try {
      await updateProfile({ name: tempName });
      setIsEditing(false);
    } catch {
      // Silently fail, keep editing
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(displayName);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoadingUser && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#EAB308]/20 border-t-[#EAB308] rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    const cardBaseClass = "group relative overflow-hidden bg-[#1A1A1A]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#EAB308]/30 transition-all duration-300 shadow-lg shadow-black/20";

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className={cardBaseClass}>
                <div className="absolute top-0 right-0 p-32 bg-[#EAB308]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#EAB308]/10" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAB308]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-6 h-6 text-[#EAB308]" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{watchStats.totalWatched}</p>
                  <p className="text-white/50 text-sm font-medium">{t('totalWatched')}</p>
                </div>
              </div>
              <div className={cardBaseClass}>
                <div className="absolute top-0 right-0 p-32 bg-[#FACC15]/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#FACC15]/10" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-[#FACC15]" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{watchStats.hoursWatched}</p>
                  <p className="text-white/50 text-sm font-medium">{t('hoursWatched')}</p>
                </div>
              </div>
              <div className={cardBaseClass}>
                <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-yellow-500/10" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{watchStats.favoriteGenre}</p>
                  <p className="text-white/50 text-sm font-medium">{t('favoriteGenre')}</p>
                </div>
              </div>
              <div className={cardBaseClass}>
                <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-green-500/10" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-green-500 font-bold text-xl">{watchStats.streak}</div>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{watchStats.streak} Days</p>
                  <p className="text-white/50 text-sm font-medium">{t('dayStreak')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className={`lg:col-span-2 ${cardBaseClass}`}>
                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#EAB308]" />
                  {t('recentActivity')}
                </h3>
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="group/item flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 rounded-full bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#EAB308] transition-colors duration-300">
                          <Icon className="w-5 h-5 text-[#EAB308] group-hover/item:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            <span className="capitalize text-white/60">{activity.type}</span>{' '}
                            <span className="text-white group-hover/item:text-[#EAB308] transition-colors">{activity.title}</span>
                          </p>
                          <p className="text-white/40 text-xs mt-0.5">{activity.time}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20 group-hover/item:text-white/60 transition-colors" />
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className={cardBaseClass}>
              <h3 className="text-white font-bold text-xl mb-6">Account Settings</h3>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/setting">
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-white/50 text-sm">{userEmail || 'Not set'}</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#EAB308] hover:text-white transition-all opacity-0 group-hover/setting:opacity-100">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/setting">
                  <div>
                    <p className="text-white font-medium">Password</p>
                    <p className="text-white/50 text-sm">Last changed 3 months ago</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#EAB308] hover:text-white transition-all opacity-0 group-hover/setting:opacity-100">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/setting">
                  <div>
                    <p className="text-white font-medium">Language</p>
                    <p className="text-white/50 text-sm">English (US)</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#EAB308] hover:text-white transition-all opacity-0 group-hover/setting:opacity-100">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">Autoplay</p>
                    <p className="text-white/50 text-sm">Automatically play next episode</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB308]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className={cardBaseClass}>
              <h3 className="text-white font-bold text-xl mb-6">Playback Settings</h3>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/setting">
                  <div>
                    <p className="text-white font-medium">Video Quality</p>
                    <p className="text-white/50 text-sm">Auto (up to 4K)</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#EAB308] hover:text-white transition-all opacity-0 group-hover/setting:opacity-100">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/setting">
                  <div>
                    <p className="text-white font-medium">Subtitles</p>
                    <p className="text-white/50 text-sm">Off by default</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#EAB308] hover:text-white transition-all opacity-0 group-hover/setting:opacity-100">Change</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className={cardBaseClass + " animate-fade-in"}>
            <h3 className="text-white font-bold text-xl mb-6">Notification Preferences</h3>

            <div className="space-y-2">
              {[
                { label: 'New releases', desc: 'Get notified when new movies and shows are added', checked: true },
                { label: 'Recommendations', desc: 'Receive personalized recommendations', checked: true },
                { label: 'Watchlist updates', desc: 'Notifications about items in your watchlist', checked: false },
                { label: 'Account activity', desc: 'Security alerts and account updates', checked: true },
                { label: 'Promotional emails', desc: 'Special offers and promotions', checked: false },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB308]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className={cardBaseClass}>
              <h3 className="text-white font-bold text-xl mb-6">Privacy Settings</h3>

              <div className="space-y-1">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">Profile Visibility</p>
                    <p className="text-white/50 text-sm">Make your profile visible to friends</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB308]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">Watch History</p>
                    <p className="text-white/50 text-sm">Save watch history for recommendations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB308]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-white font-medium">Data Sharing</p>
                    <p className="text-white/50 text-sm">Share data for personalized ads</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB308]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all shadow-lg shadow-black/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <Shield className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-red-400 font-bold text-xl mb-2">Danger Zone</h3>
                  <p className="text-white/60 text-sm mb-6">These actions cannot be undone. Please be certain.</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                      Clear Watch History
                    </button>
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className={cardBaseClass}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-bold text-xl">Current Plan</h3>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#EAB308] to-[#FACC15] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-[#EAB308]/20">
                  Premium
                </span>
              </div>

              {plans.length > 0 ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-[#EAB308] to-[#D97706] rounded-xl p-8 mb-8 text-center shadow-xl shadow-[#EAB308]/20">
                  <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <p className="text-white/80 font-medium mb-1">{plans[0].name}</p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-5xl font-bold text-white">{plans[0].price}</span>
                      {plans[0].duration_type && (
                        <span className="text-white/60 self-end mb-2">/{plans[0].duration_type}</span>
                      )}
                    </div>
                    {plans[0].description && (
                      <p className="text-white/60 text-sm">{plans[0].description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden bg-gradient-to-br from-[#EAB308] to-[#D97706] rounded-xl p-8 mb-8 text-center shadow-xl shadow-[#EAB308]/20">
                  <div className="relative z-10">
                    <p className="text-white/80 font-medium mb-1">No active plan</p>
                    <p className="text-white/60 text-sm">Browse available plans to get started</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  Change Plan
                </button>
                <button className="flex-1 px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                  Cancel Subscription
                </button>
              </div>
            </div>

            <div className={cardBaseClass}>
              <h3 className="text-white font-bold text-xl mb-6">Payment Method</h3>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/card">
                <div className="w-14 h-9 bg-[#1A1A1A] rounded flex items-center justify-center border border-white/10">
                  <span className="text-white text-xs font-bold tracking-wider">VISA</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-mono">•••• •••• •••• 4242</p>
                  <p className="text-white/50 text-xs">Expires 12/27</p>
                </div>
                <button className="text-[#EAB308] text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity">Edit</button>
              </div>
            </div>

            <div className={cardBaseClass}>
              <h3 className="text-white font-bold text-xl mb-6">Billing History</h3>

              <div className="space-y-1">
                {[
                  { date: 'Jan 15, 2026', amount: '$15.99', status: 'Paid' },
                  { date: 'Dec 15, 2025', amount: '$15.99', status: 'Paid' },
                  { date: 'Nov 15, 2025', amount: '$15.99', status: 'Paid' },
                ].map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/history">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover/history:text-[#EAB308] transition-colors">{bill.date}</p>
                        <p className="text-white/50 text-sm">Premium Plan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{bill.amount}</p>
                      <button className="text-xs text-[#EAB308] opacity-0 group-hover/history:opacity-100 transition-opacity">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-yellow-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-16">
        {/* Profile Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A]/40 backdrop-blur-xl border border-white/5 mb-8">
          {/* Banner */}
          <div className="h-48 sm:h-64 bg-gradient-to-r from-[#EAB308]/20 to-[#D97706]/20 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
          </div>

          <div className="px-6 sm:px-10 pb-8 -mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-[#1A1A1A] relative z-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#EAB308] to-[#FACC15] flex items-center justify-center overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                  {profileImage ? (
                    <img src={profileImage} alt={displayName} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <User className="w-16 h-16 text-white relative z-10" />
                  )}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <button className="absolute bottom-2 right-2 z-20 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors shadow-lg">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left mb-2">
              {isEditing ? (
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-3xl font-bold focus:outline-none focus:border-[#EAB308] w-auto text-center sm:text-left"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/30 transition-colors disabled:opacity-50"
                  >
                    {isSavingName ? (
                      <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-4 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{displayName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"
                  >
                    <Edit2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-4 text-white/60 text-sm">
                {plans.length > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {plans[0].name}
                  </span>
                )}
                {userEmail && <span>{userEmail}</span>}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 font-medium rounded-xl hover:bg-red-500/20 transition-all hover:scale-105 border border-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-[#1A1A1A]/60 backdrop-blur-xl rounded-2xl p-4 border border-white/5 sticky top-28">
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                {profileTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl whitespace-nowrap transition-all duration-300 group ${activeTab === tab.id
                        ? 'bg-[#EAB308] text-white shadow-lg shadow-[#EAB308]/20'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Help Card */}
              <div className="hidden lg:block mt-8 pt-8 border-t border-white/5 px-2">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#EAB308]/10 to-[#FACC15]/10 p-5 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#EAB308] flex items-center justify-center shadow-lg text-white">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Need Help?</p>
                      <p className="text-white/50 text-xs">We're here 24/7</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
