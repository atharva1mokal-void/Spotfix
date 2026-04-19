import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, ArrowLeft, UserPlus, Mail, Lock, User, Smartphone, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function CitizenRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        userType: "citizen",
      });
      toast.success("Account created successfully!");
      navigate("/citizen");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full min-h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px]" style={{ animationDelay: '2s'}}></div>
      </div>

      <header className="relative z-10 p-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/login/citizen" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm">
            <ArrowLeft className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-semibold text-sm tracking-tight uppercase">Login</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-xs font-black uppercase tracking-widest hidden sm:inline">Secure Form</span>
            <ShieldCheck className="h-5 w-5 text-accent-secondary" />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Onboarding Quote */}
          <div className="hidden lg:block space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-card-bg backdrop-blur-xl rounded-2xl border border-card-border shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-secondary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">System Status: Active</span>
            </div>

            <h1 className="text-7xl font-black text-text-primary leading-[0.9] tracking-tighter uppercase">
              Join the <br />
              <span className="text-accent">Community</span>
            </h1>

            <div className="space-y-8">
              {[
                { title: "Real-time Updates", desc: "Get instant notifications as your reports are resolved." },
                { title: "Smart Routing", desc: "Automated department assignment for quick response." },
                { title: "Community Impact", desc: "See how your reports help improve the city." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-text-primary text-lg">{item.title}</h4>
                    <p className="text-sm font-medium text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="w-full max-w-[520px] mx-auto lg:mr-0 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="bg-card-bg backdrop-blur-3xl p-10 rounded-[40px] border border-card-border shadow-card-shadow min-h-[600px] flex flex-col justify-center transition-all duration-500">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-4xl font-black text-text-primary mb-2 uppercase tracking-tight">Create Account</h2>
                <p className="text-text-secondary font-medium tracking-wide">Join thousands of citizens improving our city.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-[10px] ml-1">नाम / Name</Label>
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-[10px] ml-1">ईमेल / Email</Label>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-text-primary font-black uppercase tracking-tight text-[10px] ml-1">मोबाइल नंबर / Mobile Number</Label>
                  <div className="relative group/input">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-accent transition-colors">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="10 digit mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="h-14 pl-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-[10px] ml-1">पासवर्ड / Password</Label>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-[10px] ml-1">पुष्टि करें / Confirm</Label>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-white font-black uppercase tracking-[0.2em] text-lg shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all active:scale-95 mt-4"
                >
                  {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : <div className="flex items-center gap-3">Sign Up Now <ArrowRight className="h-6 w-6" /></div>}
                </Button>

                <div className="text-center pt-6">
                  <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Already a member? </span>
                  <Link to="/login/citizen" className="text-accent font-black uppercase tracking-widest text-[10px] hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
