'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

export default function Features() {
  const [animateFeatures, setAnimateFeatures] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setAnimateFeatures(true);
    
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
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-background z-10">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-bold text-accent">LABSYNC AI</Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/features" className="text-accent transition-colors">Features</Link>
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
      <section className="py-20 px-4 text-center">
        <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${animateFeatures ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <span className="text-accent">Powerful</span> Features for<br />
          Your Health <span className="text-accent">Journey</span>
        </h1>
        <p className={`text-xl text-gray-300 max-w-3xl mx-auto mb-10 transition-all duration-1000 delay-300 ${animateFeatures ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          Discover how LabSync AI transforms complex medical data into actionable insights
        </p>
      </section>
      
      {/* Main Features */}
      <section className="py-16 px-4 bg-card-hover animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Core <span className="text-accent">Features</span></h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Smart Report Analysis</h3>
                <p className="text-gray-300 text-center">
                  Upload any medical report and our AI will extract key information, highlight abnormal results, and provide plain-language explanations.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Multi-format support (PDF, JPG, PNG)</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Automatic data extraction</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Abnormal result detection</li>
                </ul>
              </div>
            </Card>
            
            <Card className="hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Health Tracking Dashboard</h3>
                <p className="text-gray-300 text-center">
                  Monitor your health metrics over time with interactive charts and visualizations that make trends easy to understand.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Historical data tracking</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Interactive trend charts</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Custom health goals</li>
                </ul>
              </div>
            </Card>
            
            <Card className="hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">AI Health Insights</h3>
                <p className="text-gray-300 text-center">
                  Receive personalized health insights and recommendations based on your medical data and health profile.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Personalized recommendations</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Risk factor analysis</li>
                  <li className="flex items-center"><span className="text-accent mr-2">✓</span> Health improvement suggestions</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-4 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Advanced <span className="text-accent">Capabilities</span></h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-card rounded-xl p-6 border border-gray-800 order-2 md:order-1">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-accent">Medical Term Dictionary</div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4">Medical Terminology Dictionary</h3>
              <p className="text-gray-300 mb-6">
                Never be confused by medical jargon again. Our comprehensive medical dictionary explains complex terms in simple language, with visual aids where helpful.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> 10,000+ medical terms explained</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Context-aware definitions</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Visual explanations for complex concepts</li>
              </ul>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">Secure Health Record Storage</h3>
              <p className="text-gray-300 mb-6">
                Keep all your medical records in one secure place. Our platform uses bank-level encryption to ensure your sensitive health data remains private and protected.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> End-to-end encryption</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> HIPAA-compliant storage</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Secure sharing options</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-6 border border-gray-800">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-accent">Secure Storage Vault</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-card rounded-xl p-6 border border-gray-800 order-2 md:order-1">
              <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-accent">Health Alert System</div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4">Smart Health Alerts</h3>
              <p className="text-gray-300 mb-6">
                Receive timely notifications about significant changes in your health metrics, upcoming appointments, or when new research relevant to your condition becomes available.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Customizable alert thresholds</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Multi-channel notifications</li>
                <li className="flex items-center"><span className="text-accent mr-2">✓</span> Research and news updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Supported Report Types */}
      <section className="py-16 px-4 bg-card-hover animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Supported <span className="text-accent">Report Types</span></h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">CBC</span>
              </div>
              <h3 className="font-bold mb-2">Complete Blood Count</h3>
              <p className="text-gray-400 text-sm">Red cells, white cells, platelets, hemoglobin, and more</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">CMP</span>
              </div>
              <h3 className="font-bold mb-2">Comprehensive Metabolic Panel</h3>
              <p className="text-gray-400 text-sm">Kidney function, liver function, electrolyte and fluid balance</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">LP</span>
              </div>
              <h3 className="font-bold mb-2">Lipid Panel</h3>
              <p className="text-gray-400 text-sm">Cholesterol levels, triglycerides, and heart disease risk factors</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">TFT</span>
              </div>
              <h3 className="font-bold mb-2">Thyroid Function Tests</h3>
              <p className="text-gray-400 text-sm">TSH, T3, T4, and thyroid antibodies</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">ECG</span>
              </div>
              <h3 className="font-bold mb-2">Electrocardiogram</h3>
              <p className="text-gray-400 text-sm">Heart rhythm, rate, and electrical activity</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">XR</span>
              </div>
              <h3 className="font-bold mb-2">X-Ray Reports</h3>
              <p className="text-gray-400 text-sm">Bone, chest, abdominal, and dental X-rays</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">US</span>
              </div>
              <h3 className="font-bold mb-2">Ultrasound Reports</h3>
              <p className="text-gray-400 text-sm">Abdominal, pelvic, cardiac, and pregnancy ultrasounds</p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-gray-800 hover:border-accent/50 transition-all duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-accent text-xl font-bold">MRI</span>
              </div>
              <h3 className="font-bold mb-2">MRI Reports</h3>
              <p className="text-gray-400 text-sm">Brain, spine, joint, and organ MRI scans</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing CTA */}
      <section className="py-20 px-4 text-center animate-on-scroll">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to <span className="text-accent">Transform</span> Your Health Experience?</h2>
          <p className="text-xl text-gray-300 mb-10">Choose a plan that fits your needs and start your health journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/pricing'}
            >
              View Pricing Plans
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/auth/signup'}
            >
              Start Free Trial
            </Button>
          </div>
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