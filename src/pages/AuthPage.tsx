import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setErrorMessage('');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrorMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            if (isLogin) {
                const result = await login({
                    email: formData.email,
                    password: formData.password,
                });
                if (result.success) {
                    navigate('/');
                } else {
                    setErrorMessage(result.message);
                }
            } else {
                const result = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password,
                });
                if (result.success) {
                    navigate('/');
                } else {
                    setErrorMessage(result.message);
                }
            }
        } catch {
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: "url('/assets/auth-bg.png')" }}
            />
            <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-[2px]" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80" />

            {/* Auth Card */}
            <div className="relative z-20 w-full max-w-md px-2 animate-in fade-in duration-700">
                <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EAB308] mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-transform hover:scale-110 duration-500">
                            <span className="text-3xl font-black text-black">4S</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-gray-400 font-medium">
                            {isLogin ? 'Enter your details to access your account' : 'Join 4Sides Play for the ultimate experience'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                            <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#EAB308] transition-colors" />
                                    <Input
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#EAB308]/50 focus:ring-[#EAB308]/20 transition-all placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#EAB308] transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#EAB308]/50 focus:ring-[#EAB308]/20 transition-all placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                {isLogin && (
                                    <button type="button" className="text-xs font-semibold text-[#EAB308] hover:text-[#FACC15] transition-colors">
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#EAB308] transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="pl-12 pr-12 bg-white/5 border-white/10 h-12 rounded-xl focus:border-[#EAB308]/50 focus:ring-[#EAB308]/20 transition-all placeholder:text-gray-600"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center space-x-2 ml-1">
                                <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-[#EAB308] data-[state=checked]:border-[#EAB308]" />
                                <label htmlFor="remember" className="text-sm text-gray-400 font-medium cursor-pointer select-none">
                                    Remember me for 30 days
                                </label>
                            </div>
                        )}

                        <Button className="w-full h-12 rounded-xl bg-[#EAB308] hover:bg-[#FACC15] text-black font-bold text-lg shadow-lg shadow-[#EAB308]/20 transition-all hover:scale-[1.02] active:scale-95">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#111111] px-4 text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid gap-4">
                        <button className="flex items-center justify-center h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium">
                            <Chrome className="w-5 h-5 mr-2" />
                            Google
                        </button>
                    </div>

                    {/* Footer Link */}
                    <p className="text-center mt-10 text-gray-400 font-medium">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={toggleAuthMode}
                            className="font-bold text-[#EAB308] hover:text-[#FACC15] transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
