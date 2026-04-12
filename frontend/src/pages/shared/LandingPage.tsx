import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { MapPin, Bell, BarChart3, Camera, Users, TrendingUp, Eye, Menu, X } from "lucide-react";
import { useState } from "react";
import { ParticleBackground } from "../../components/ParticleBackground";
import { Navbar, NavItem } from "../../components/ui/Navbar";
import { Info, HelpCircle, Activity, Globe, LayoutDashboard } from "lucide-react";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navItems: NavItem[] = [
    { label: t("Features"), href: "#features", icon: Info, type: 'hash' },
    { label: t("How It Works"), href: "#how-it-works", icon: HelpCircle, type: 'hash' },
    { label: t("Impact"), href: "#impact", icon: Activity, type: 'hash' },
    { 
      label: i18n.language === 'en' ? 'English' : i18n.language === 'hi' ? 'हिंदी' : 'मराठी', 
      href: "#", 
      icon: Globe, 
      isButton: true,
      onClick: () => {
        const langs = ['en', 'hi', 'mr'];
        const nextLang = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
        i18n.changeLanguage(nextLang);
      }
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Dream Vivid Bloom Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
            radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
            radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
            radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
            linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}
      />
      <Navbar items={navItems} />
      <ParticleBackground />
      {/* Minimalistic Header for Logo */}
      <header className="absolute top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-8 w-8 text-[#FF6B35]" />
            <span className="text-xl font-semibold bg-gradient-to-r from-[#FF9933] to-[#138808] bg-clip-text text-transparent">
              {t("SpotFix")}
            </span>
          </div>
        </div>
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
          {t("Building Better Cities Together")}
        </h1>
        <p className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
          {t("स्वच्छ भारत, सुंदर भारत")}
        </p>
        <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-12 max-w-3xl mx-auto">
          {t("hero_desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12">
          <Link to="/login/citizen">
            <div className="package">
              <div className="package2">
                <Users className="h-12 w-12 text-[#FF9933]" />
                <span className="uiverse-text font-bold">{t("Citizen Portal")}</span>
                <p className="text-gray-400 text-xs px-4">Report issues and track resolutions</p>
              </div>
            </div>
          </Link>
          <Link to="/login/authority">
            <div className="package">
              <div className="package2">
                <BarChart3 className="h-12 w-12 text-[#3b82f6]" />
                <span className="uiverse-text font-bold">{t("Authority Portal")}</span>
                <p className="text-gray-400 text-xs px-4">Manage and resolve city issues</p>
              </div>
            </div>
          </Link>
          <Link to="/login/admin">
            <div className="package">
              <div className="package2">
                <TrendingUp className="h-12 w-12 text-[#138808]" />
                <span className="uiverse-text font-bold">{t("Admin Portal")}</span>
                <p className="text-gray-400 text-xs px-4">System-wide analytics & management</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white/30 backdrop-blur-sm py-16 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-white/60 border-orange-200/50 text-gray-900 shadow-xl shadow-orange-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-[#FF9933]">Manual & Inefficient</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Citizens must visit offices or find helpline numbers. Time-consuming and inconvenient.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 border-blue-200/50 text-gray-900 shadow-xl shadow-blue-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Zero Visibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  No way to track complaint status. Citizens left wondering if anyone saw their report.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 border-green-200/50 text-gray-900 shadow-xl shadow-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg text-[#138808]">Disconnected Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Paper-based workflows lead to lost complaints and slow routing between departments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Powerful Features</h2>
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
      <section id="how-it-works" className="bg-white/40 backdrop-blur-md py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
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
      <section id="impact" className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Impact</h2>
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
    <Card className="bg-white/50 border-white/20 hover:border-[#FF6B35]/50 transition-all text-gray-900 backdrop-blur-sm shadow-xl shadow-black/5">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF9933] to-[#FF6B35] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/20">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
}

function ImpactCard({ title, description, stat, statLabel }: { title: string; description: string; stat: string; statLabel: string }) {
  return (
    <Card className="bg-white/50 border-white/20 text-gray-900 backdrop-blur-sm shadow-xl shadow-black/5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-700">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#FF9933] mb-1">{stat}</div>
        <div className="text-sm text-gray-700">{statLabel}</div>
      </CardContent>
    </Card>
  );
}