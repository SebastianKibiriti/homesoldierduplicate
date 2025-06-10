import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Shield, Star, Trophy, Users, ChevronRight, Medal, CheckCircle, ArrowRight, Gift, BarChart2, Send, Facebook, Twitter, Instagram, Linkedin, Upload, X, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: 'Military-Style Ranks',
      description: 'Kids progress through military ranks as they complete tasks, from Recruit to General'
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: 'Point System',
      description: 'Earn points for completed chores to unlock exciting rewards and privileges'
    },
    {
      icon: <Trophy className="w-8 h-8 text-orange-500" />,
      title: 'Achievement System',
      description: 'Special badges and achievements for consistent performance and milestones'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: 'Family Management',
      description: 'Easy-to-use tools for managing multiple children and their responsibilities'
    }
  ];

  const howItWorks = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: 'Create Your Account',
      description: 'Sign up as a parent and add your children to get started'
    },
    {
      icon: <Gift className="w-6 h-6 text-purple-500" />,
      title: 'Set Up Rewards',
      description: 'Create custom rewards that motivate your children'
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
      title: 'Track Progress',
      description: 'Monitor completion rates and celebrate achievements'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent of 3',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Home Soldier has transformed our household. No more arguing about chores!'
    },
    {
      name: 'Michael Chen',
      role: 'Parent of 2',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The military ranks system keeps my kids motivated and excited about helping out.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Parent of 1',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Finally, an app that makes chores fun! My son loves earning his ranks.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      features: [
        'Up to 3 children',
        'Basic chore management',
        'Standard rewards system',
        'Core rank progression'
      ]
    },
    {
      name: 'Premium',
      price: '$4.99/mo',
      features: [
        'Unlimited children',
        'Advanced chore scheduling',
        'Custom rewards creation',
        'Detailed analytics',
        'Priority support'
      ]
    }
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            email: feedbackEmail,
            message: feedbackMessage,
            submitted_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setFeedbackSubmitted(true);
      setFeedbackEmail('');
      setFeedbackMessage('');
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeroBackgroundImage(e.target?.result as string);
        setShowImageUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoLogin = (role: 'parent' | 'child') => {
    // Store demo mode in localStorage
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Pattern Overlay with Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0ME0gMCAzMCBMIDQwIDMwIE0gMzAgMCBMIDMwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNFNUU3RUIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-5" style={{ mask: 'radial-gradient(circle at center, transparent 30%, black 70%)' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              <Medal className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">Home Soldier</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</button>
              <button
                onClick={() => navigate('/login')}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="p-6">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left text-gray-700 hover:text-orange-500 transition-colors py-2"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left text-gray-700 hover:text-orange-500 transition-colors py-2"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left text-gray-700 hover:text-orange-500 transition-colors py-2"
                >
                  Pricing
                </button>
              </li>
              <li className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        style={{
          backgroundImage: heroBackgroundImage ? `url(${heroBackgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {heroBackgroundImage && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
        )}
        
        <div className="relative text-center">
          {/* Image Upload Button */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              title="Upload background image"
            >
              <Upload className="h-5 w-5 text-gray-600" />
            </button>
            
            {showImageUpload && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">Upload Background</h3>
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {heroBackgroundImage && (
                  <button
                    onClick={() => setHeroBackgroundImage('')}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Background
                  </button>
                )}
              </div>
            )}
          </div>

          <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${heroBackgroundImage ? 'text-white' : 'text-gray-900'}`}>
            <span className="block">Transform Chores into</span>
            <span className="block text-orange-500">Military Missions</span>
          </h1>
          <p className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl ${heroBackgroundImage ? 'text-gray-100' : 'text-gray-500'}`}>
            Motivate your children with a military-style reward system. Turn everyday tasks into exciting missions with ranks, achievements, and rewards.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:text-lg"
            >
              Join & Recruit your Kids
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            
            {/* Demo Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDemoLogin('parent')}
                className="inline-flex items-center px-4 py-3 border border-orange-500 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
              >
                Demo as Parent
              </button>
              <button
                onClick={() => handleDemoLogin('child')}
                className="inline-flex items-center px-4 py-3 border border-orange-500 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
              >
                Demo as Child
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Features designed for modern families
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              Everything you need to manage your household effectively and keep your children motivated.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-6 left-6">{feature.icon}</div>
                  <div className="pt-16">
                    <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              Get started with Home Soldier in three simple steps
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Parents Are Saying
            </h2>
            <p className="mt-4 text-lg text-gray-600 font-medium">
              Tell us what you think
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-500">
              Choose the plan that best fits your family's needs
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {pricingPlans.map((plan, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-4xl font-bold text-orange-500">{plan.price}</p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-8 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="relative bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">We Value Your Feedback</h2>
            <p className="mt-4 text-gray-500">
              Help us improve Home Soldier by sharing your thoughts and suggestions
            </p>
          </div>

          <div className="mt-12 max-w-xl mx-auto">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  placeholder="Share your thoughts with us..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>

            {feedbackSubmitted && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-green-800 text-center">Thank you for your feedback!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Medal className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-bold">Home Soldier</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Transforming household chores into exciting military missions for children.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <div className="mt-4 flex space-x-4">
                <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold">Contact Us</h4>
                <p className="mt-2 text-gray-400 text-sm">
                  Email: support@homesoldier.com<br />
                  Phone: (555) 123-4567
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Home Soldier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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

export { LandingPage as default };