import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { MapPin, Bell, BarChart3, Camera, Users, TrendingUp, Eye, Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-8 w-8 text-[#FF6B35]" />
            <span className="text-xl font-semibold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
              SpotFix
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm hover:text-[#FF6B35]">Features</a>
            <a href="#how-it-works" className="text-sm hover:text-[#FF6B35]">How It Works</a>
            <a href="#impact" className="text-sm hover:text-[#FF6B35]">Impact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <a 
              href="#features" 
              className="text-lg font-medium hover:text-[#FF6B35]"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-lg font-medium hover:text-[#FF6B35]"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#impact" 
              className="text-lg font-medium hover:text-[#FF6B35]"
              onClick={() => setIsMenuOpen(false)}
            >
              Impact
            </a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center relative">
        {/* Indian decorative elements */}
        <div className="absolute top-10 left-10 w-16 h-16 border-4 border-[#FF9933] rounded-full opacity-20 hidden md:block"></div>
        <div className="absolute top-20 right-20 w-12 h-12 border-4 border-[#138808] rounded-full opacity-20 hidden md:block"></div>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#FF9933]"></div>
          <div className="w-2 h-2 rounded-full bg-white border-2 border-[#FF9933]"></div>
          <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#FF9933] via-[#FF6B35] to-[#138808] bg-clip-text text-transparent leading-tight">
          Building Better Cities Together
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-gray-700 mb-2">
          स्वच्छ भारत, सुंदर भारत
        </p>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
          Report civic issues instantly. Track progress in real-time. Create cleaner, safer communities through transparent governance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login/citizen" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-lg px-8 bg-gradient-to-r from-[#FF9933] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF9933]">
              <Users className="mr-2 h-5 w-5" />
              नागरिक पोर्टल / Citizen
            </Button>
          </Link>
          <Link to="/login/authority" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-lg px-8 border-[#000080] text-[#000080] hover:bg-blue-50">
              <BarChart3 className="mr-2 h-5 w-5" />
              प्राधिकरण / Authority
            </Button>
          </Link>
          <Link to="/login/admin" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full text-lg px-8 border-[#FFD700] text-[#800000] hover:bg-yellow-50">
              <TrendingUp className="mr-2 h-5 w-5" />
              व्यवस्थापक / Admin
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual & Inefficient</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Citizens must visit offices or find helpline numbers. Time-consuming and inconvenient.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zero Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  No way to track complaint status. Citizens left wondering if anyone saw their report.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disconnected Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Paper-based workflows lead to lost complaints and slow routing between departments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Camera className="h-8 w-8 text-blue-600" />}
            title="One-Click Reporting"
            description="Capture a photo, add description, and GPS location is automatically tagged. Simple and fast."
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-purple-600" />}
            title="Real-Time Tracking"
            description="Watch your complaint move from Submitted → In Progress → Resolved with push notifications."
          />
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-green-600" />}
            title="GPS Location"
            description="Automatic location tagging ensures authorities can find the exact problem location."
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-orange-600" />}
            title="Analytics Dashboard"
            description="City-wide heatmaps and performance metrics for data-driven decision making."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-red-600" />}
            title="Multi-Role Access"
            description="Separate portals for citizens, authorities, and administrators with role-based features."
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-indigo-600" />}
            title="Performance Monitoring"
            description="Track response times and resolution rates across different departments."
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <StepCard
                number="1"
                title="Report"
                description="Citizens capture the issue with photo and description. GPS location is auto-tagged."
              />
              <StepCard
                number="2"
                title="Route"
                description="System automatically assigns the issue to the correct department based on category."
              />
              <StepCard
                number="3"
                title="Resolve"
                description="Authority updates status, adds resolution notes, and uploads before/after photos."
              />
              <StepCard
                number="4"
                title="Verify"
                description="Citizens receive notifications and can verify the resolution. Issue is marked complete."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <ImpactCard
            title="For Citizens"
            description="Empowers every individual to be an active participant in improving their neighborhood."
            stat="2,500+"
            statLabel="Active Users"
          />
          <ImpactCard
            title="For Authorities"
            description="Drastically reduces administrative overhead and enables data-driven decision-making."
            stat="87%"
            statLabel="Faster Response"
          />
          <ImpactCard
            title="For Society"
            description="Creates cleaner, safer, and more efficient cities through transparent governance."
            stat="1,200+"
            statLabel="Issues Resolved"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#FF9933] via-[#FF6B35] to-[#138808] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-2 opacity-90">
            अपने शहर को बेहतर बनाने में मदद करें
          </p>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of citizens creating better cities
          </p>
          <Link to="/login/citizen">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Report Your First Issue
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-[#FF6B35]" />
            <span className="font-semibold">SpotFix</span>
          </div>
          <p className="text-sm opacity-75">
            © 2026 SpotFix | भारत सरकार की पहल • Government of India Initiative
          </p>
          <p className="text-xs opacity-60 mt-2">
            Building better cities through technology and transparency
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ImpactCard({ title, description, stat, statLabel }: { title: string; description: string; stat: string; statLabel: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-blue-600 mb-1">{stat}</div>
        <div className="text-sm text-gray-600">{statLabel}</div>
      </CardContent>
    </Card>
  );
}