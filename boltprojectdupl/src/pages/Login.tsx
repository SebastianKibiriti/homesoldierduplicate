import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Medal, ArrowRight, ArrowLeft, Eye, EyeOff, Users, User, MapPin, Star, Facebook, Apple, Chrome, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-100' };
    if (strength <= 3) return { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    if (strength <= 4) return { label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-100' };
    return { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-100' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        if (role === 'parent') {
          await signUp({ email, password, fullName, role });
        } else {
          await signUp({ email, password, fullName, age: parseInt(age), role });
        }
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || (isSignUp ? 'Error creating account' : 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: 'parent' | 'child') => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', demoRole);
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login implementation
    console.log(`Login with ${provider}`);
    setError(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Topographic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 20c20 0 20 20 40 20s20-20 40-20 20 20 40 20" fill="none" stroke="#000" strokeWidth="1"/>
              <path d="M0 40c20 0 20 20 40 20s20-20 40-20 20 20 40 20 20-20 40-20" fill="none" stroke="#000" strokeWidth="1"/>
              <path d="M20 60c20 0 20 20 40 20s20-20 40-20 20 20 40 20" fill="none" stroke="#000" strokeWidth="1"/>
              <path d="M0 80c20 0 20 20 40 20s20-20 40-20 20 20 40 20 20-20 40-20" fill="none" stroke="#000" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Left Panel - Authentication Form */}
          <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
                aria-label="Go back to home page"
              >
                <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Menu</span>
              </button>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">Canada</span>
                <span className="ml-1 text-lg">🇨🇦</span>
              </div>
            </div>

            {/* Logo and Branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 transform rotate-45">
                <Star className="h-8 w-8 text-white transform -rotate-45" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Explore</h1>
              <p className="text-gray-600">This is the start of something good.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
                  isSignUp
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                Register
              </button>
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-all ${
                  !isSignUp
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                Login
              </button>
            </div>

            {/* Social Login */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  aria-label="Login with Facebook"
                  disabled={isLoading}
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSocialLogin('Apple')}
                  className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  aria-label="Login with Apple"
                  disabled={isLoading}
                >
                  <Apple className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:border-gray-300 transition-colors"
                  aria-label="Login with Google"
                  disabled={isLoading}
                >
                  <Chrome className="h-5 w-5" />
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Role Selection for Sign Up */}
            {isSignUp && (
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    role === 'parent'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                  disabled={isLoading}
                >
                  <Users className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Parent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('child')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    role === 'child'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-200'
                  }`}
                  disabled={isLoading}
                >
                  <User className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Child</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName\" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Robert Fox"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              {isSignUp && role === 'child' && (
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="17"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required={role === 'child'}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="robert.fox@gmail.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {password && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${passwordStrength.color} ${passwordStrength.bgColor}`}>
                        <CheckCircle className="h-3 w-3" />
                        {passwordStrength.label}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    Start your adventure
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Try the demo:</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDemoLogin('parent')}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Demo as Parent
                </button>
                <button
                  onClick={() => handleDemoLogin('child')}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <User className="h-4 w-4 mr-2" />
                  Demo as Child
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Adventure Theme */}
          <div className="hidden lg:block lg:w-3/5 relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=1200)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/40 to-yellow-900/60"></div>
              
              {/* Content Overlay */}
              <div className="relative h-full flex flex-col p-8 text-white">
                {/* Top Section - Location */}
                <div className="flex justify-end mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center text-white mb-1">
                      <MapPin className="h-4 w-4 mr-1 text-blue-300" />
                      <span className="text-sm font-medium">Pacific Rim National Park Reserve</span>
                    </div>
                    <p className="text-xs text-gray-200">Vancouver Island, British Columbia</p>
                  </div>
                </div>

                {/* Vehicle Showcase */}
                <div className="mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-sm">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <img 
                        src="https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=200" 
                        alt="RV in snowy landscape"
                        className="w-full h-16 object-cover rounded"
                      />
                      <img 
                        src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=200" 
                        alt="RV in mountains"
                        className="w-full h-16 object-cover rounded"
                      />
                      <img 
                        src="https://images.pexels.com/photos/1687678/pexels-photo-1687678.jpeg?auto=compress&cs=tinysrgb&w=200" 
                        alt="RV interior"
                        className="w-full h-16 object-cover rounded"
                      />
                    </div>
                    <div className="flex items-center text-white">
                      <Medal className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-sm">2001 Ford Econoline 150</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-5xl font-bold mb-4 leading-tight">
                    Your next adventure<br />
                    starts <span className="text-green-400 bg-green-400/20 px-2 rounded">here</span>
                  </h2>
                  <p className="text-xl text-gray-200 mb-8 max-w-md">
                    Discover the best RV, camper van or travel trailer rental for your next vacation.
                  </p>
                </div>

                {/* Bottom Section - Destinations */}
                <div>
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-blue-300" />
                    <span className="font-medium">Destinations</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Banff', color: 'bg-red-500' },
                      { name: 'Jasper', color: 'bg-yellow-500' },
                      { name: 'Pacific Rim', color: 'bg-blue-500' },
                      { name: 'Gwaii Haanas', color: 'bg-green-500' }
                    ].map((destination) => (
                      <button
                        key={destination.name}
                        className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/20 transition-colors"
                      >
                        <div className={`w-3 h-3 rounded-full ${destination.color} mr-2`}></div>
                        <span className="text-sm font-medium">{destination.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bolt.new Badge */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
      >
        <span>Built with</span>
        <span className="font-semibold">Bolt.new</span>
      </a>
    </div>
  );
};

export default Login;