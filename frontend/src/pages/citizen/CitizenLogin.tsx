import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, ArrowLeft, Smartphone, Mail, KeyRound, ShieldCheck, Zap, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export function CitizenLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<"mobile" | "email">("mobile");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }

    try {
      await api.login({ email: formData.identifier, password: formData.password, userType: "citizen" });
      toast.success(t("Welcome back!"));
      navigate("/citizen");
    } catch (error: any) {
      toast.error(error.message || t("Login failed"));
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier) {
      toast.error(t("Please enter your email or mobile number first"));
      return;
    }
    toast.success(t(`Password reset link sent to ${formData.identifier}`));
    setIsForgotPassword(false);
  };

  return (
    <div 
      className="w-full min-h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px]" style={{ animationDelay: '2s'}}></div>
      </div>

      <header className="relative z-10 p-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm">
            <ArrowLeft className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-semibold text-sm tracking-tight uppercase">Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm font-black uppercase tracking-widest hidden sm:inline">New here?</span>
            <Link to="/register/citizen" className="text-accent font-black uppercase tracking-widest text-sm hover:underline">Sign Up</Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Branding */}
          <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-xl p-4 rounded-3xl border border-black/5 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9933] to-[#E67E22] rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1D1D1F] tracking-tight">SpotFix</h2>
                <p className="text-[#FF9933] font-bold text-xs uppercase tracking-[0.2em]">Citizen Portal</p>
              </div>
            </div>
            
            <h1 className="text-6xl font-black text-[#1D1D1F] leading-tight">
              Empowering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#E67E22] to-[#138808]">Civic Change</span>
            </h1>
            
            <p className="text-xl text-[#424245] leading-relaxed max-w-md">
              Your voice matters. Report, track, and resolve local issues directly from your smartphone.
            </p>

            <div className="pt-8 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#F5F5F7] bg-gray-200" />
                ))}
              </div>
              <p className="text-[#86868B] text-sm font-medium">Join 50,000+ citizens <br />making a difference.</p>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="w-full max-w-[480px] mx-auto lg:mr-0 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="bg-card-bg backdrop-blur-3xl p-10 rounded-[40px] border border-card-border shadow-card-shadow transition-all duration-500">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-black text-text-primary mb-2 uppercase tracking-tight">
                  {isForgotPassword ? "Reset Password" : "Citizen Login"}
                </h2>
                <p className="text-text-secondary font-medium tracking-wide">
                  {isForgotPassword ? "We'll send you a link to reset your password." : "Please enter your details to login."}
                </p>
              </div>

              {!isForgotPassword && (
                <Tabs defaultValue="mobile" onValueChange={(v) => setLoginType(v as "mobile" | "email")} className="w-full mb-10">
                  <TabsList className="grid w-full grid-cols-2 bg-text-primary/5 p-1.5 rounded-[22px] h-16">
                    <TabsTrigger value="mobile" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-xl transition-all font-black uppercase tracking-widest text-[10px]">
                      <Smartphone className="w-4 h-4 mr-2" /> {t("Mobile")}
                    </TabsTrigger>
                    <TabsTrigger value="email" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-xl transition-all font-black uppercase tracking-widest text-[10px]">
                      <Mail className="w-4 h-4 mr-2" /> {t("Email")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <form onSubmit={isForgotPassword ? handleForgotPasswordSubmit : handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-text-primary font-black uppercase tracking-tight text-xs ml-1">{loginType === "mobile" ? "Mobile Number" : "Email Address"}</Label>
                  <div className="relative group/input">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/input:text-accent transition-colors">
                      {loginType === "mobile" ? <Smartphone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                    </div>
                    <Input
                      type={loginType === "mobile" ? "tel" : "email"}
                      placeholder={loginType === "mobile" ? "10 digit mobile" : "name@example.com"}
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="h-16 pl-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      maxLength={loginType === "mobile" ? 10 : undefined}
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-text-primary font-black uppercase tracking-tight text-xs">{t("Password")}</Label>
                      <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Forgot Password?</button>
                    </div>
                    <div className="relative group/pass">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within/pass:text-accent transition-colors">
                        <KeyRound className="h-5 w-5" />
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-16 pl-14 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 transition-all font-black uppercase tracking-tight text-xs text-text-primary"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-white font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all active:scale-95">
                  {isForgotPassword ? "Send Reset Link" : "Login"}
                </Button>

                {isForgotPassword && (
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">
                    Return to Login
                  </button>
                )}



                {!isForgotPassword && (
                  <div className="text-center pt-8 border-t border-card-border/50">
                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mb-3">New to SpotFix?</p>
                    <Link 
                      to="/register/citizen" 
                      className="inline-flex items-center gap-2 text-accent font-black uppercase tracking-widest text-xs hover:text-accent-secondary transition-colors group/join"
                    >
                      <UserPlus className="w-4 h-4 transition-transform group-hover/join:scale-110" />
                      Create An Account
                    </Link>
                  </div>
                )}
              </form>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}