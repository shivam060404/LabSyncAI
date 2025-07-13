'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Card } from '@/components/ui';

export default function Home() {
  const [activeTab, setActiveTab] = useState('reports');
  const [showDemo, setShowDemo] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setAnimateHero(true);
    
    // Set up scroll animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('animate-fade-in');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleDemoClick = () => {
    setShowDemo(true);
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-background z-10">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-accent animate-pulse-glow">LABSYNC AI</div>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="/auth/signin" className="inline-block">
            <Button variant="secondary">Sign In</Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Button variant="secondary" size="sm" onClick={() => alert('Menu clicked')}>Menu</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <span className="text-accent">Understand</span> Your<br />
          Medical Reports <span className="text-accent">Instantly</span>
        </h1>
        <p className={`text-xl text-gray-300 max-w-2xl mb-10 transition-all duration-1000 delay-300 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          Upload your medical reports and get AI-powered analysis, insights, and recommendations in seconds.
        </p>
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/auth/signup'}
          >
            Get Started
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleDemoClick}
          >
            See Demo
          </Button>
        </div>
      </section>
      
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-card max-w-4xl w-full rounded-xl p-6 relative">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">See how LabSync AI works</h2>
            <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-6">
              <p className="text-accent">Demo Video Player</p>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => window.location.href = '/auth/signup'}>
                Try It Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Tabs */}
      <section className="py-16 px-4 bg-card-hover animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How LabSync AI <span className="text-accent">Works</span></h2>
          
          <div className="flex justify-center mb-8 border-b border-gray-800">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'reports' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}
              onClick={() => setActiveTab('reports')}
            >
              Medical Reports
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'insights' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}
              onClick={() => setActiveTab('insights')}
            >
              AI Insights
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'tracking' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}
              onClick={() => setActiveTab('tracking')}
            >
              Health Tracking
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {activeTab === 'reports' && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Upload Any Medical Report</h3>
                  <p className="text-gray-300 mb-6">Simply upload your lab reports, ECGs, X-rays, or any other medical document. Our AI can process various formats including PDFs, images, and text files.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Blood Tests</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Imaging Reports</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Specialist Consultations</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Hospital Discharge Summaries</li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl p-6 border border-gray-800">
                  <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                    <p className="text-accent">Report Upload Interface</p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'insights' && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Get AI-Powered Insights</h3>
                  <p className="text-gray-300 mb-6">Our advanced AI analyzes your reports and provides clear explanations of medical terms, highlights abnormal results, and offers personalized health insights.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Plain Language Explanations</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Abnormal Result Detection</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Trend Analysis</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Personalized Recommendations</li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl p-6 border border-gray-800">
                  <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                    <p className="text-accent">AI Analysis Dashboard</p>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'tracking' && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Track Your Health Over Time</h3>
                  <p className="text-gray-300 mb-6">Monitor your health metrics over time, set goals, and receive alerts when values change significantly. Keep all your medical data in one secure place.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Historical Tracking</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Progress Visualization</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Custom Health Goals</li>
                    <li className="flex items-center"><span className="text-accent mr-2">✓</span> Secure Cloud Storage</li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl p-6 border border-gray-800">
                  <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                    <p className="text-accent">Health Tracking Dashboard</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section className="py-16 px-4 animate-on-scroll">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Supported <span className="text-accent">Report Types</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all duration-300 cursor-pointer">
              <div className="text-accent text-4xl">CBC</div>
            </div>
            <p>Complete Blood Count</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all duration-300 cursor-pointer">
              <div className="text-accent text-4xl">ECG</div>
            </div>
            <p>Electrocardiogram</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all duration-300 cursor-pointer">
              <div className="text-accent text-4xl">LP</div>
            </div>
            <p>Lipid Panel</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full border-2 border-accent flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all duration-300 cursor-pointer">
              <div className="text-accent text-4xl">XR</div>
            </div>
            <p>X-Ray Reports</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 px-4 bg-card-hover animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our <span className="text-accent">Users Say</span></h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:border-accent/50 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="text-accent text-2xl mb-4">★★★★★</div>
                <p className="text-gray-300 mb-4 flex-grow">"LabSync AI helped me understand my complex blood work results in simple terms. The historical tracking is incredibly useful for monitoring my cholesterol levels."</p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <span className="text-accent">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-400">Patient</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="hover:border-accent/50 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="text-accent text-2xl mb-4">★★★★★</div>
                <p className="text-gray-300 mb-4 flex-grow">"As a healthcare provider, I recommend LabSync AI to my patients. It helps them better understand their health status and improves our communication during appointments."</p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <span className="text-accent">SS</span>
                  </div>
                  <div>
                    <p className="font-medium">Dr. Sarah Smith</p>
                    <p className="text-sm text-gray-400">Physician</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="hover:border-accent/50 transition-all duration-300">
              <div className="flex flex-col h-full">
                <div className="text-accent text-2xl mb-4">★★★★★</div>
                <p className="text-gray-300 mb-4 flex-grow">"The app has been a game-changer for managing my family's health records. Being able to upload and organize all our medical reports in one place is incredibly convenient."</p>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <span className="text-accent">MJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Maria Johnson</p>
                    <p className="text-sm text-gray-400">Parent</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 text-center animate-on-scroll">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to <span className="text-accent">Understand</span> Your Health?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of users who have taken control of their health with LabSync AI.</p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/auth/signup'}
            className="animate-pulse-glow"
          >
            Get Started for Free
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">LabSync AI</h3>
            <p className="text-gray-400">Making medical reports understandable for everyone.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-accent">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-accent">Pricing</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-accent">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-accent">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-accent">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-accent">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-accent">Terms of Service</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-accent">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} LabSync AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}