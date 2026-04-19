import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Crown, ArrowLeft, Lock, Fingerprint, Mail, User, Zap } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

import { api } from "../../services/api";

export function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<"id" | "email">("id");
  const [formData, setFormData] = useState({
    identifier: "",
    secretKey: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.secretKey || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }

    setLoading(true);
    try {
      await api.login({
        email: formData.identifier,
        password: formData.password,
        userType: "admin",
      });
      toast.success(t("Welcome!"));
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || t("Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Navigation Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/80 transition-all shadow-sm">
            <ArrowLeft className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-semibold text-sm">Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">{t("Administrator Portal")}</span>
            <Crown className="h-6 w-6 text-accent" />
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <div className="inline-block">
              <div className="relative">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#FF9933] via-[#FFD700] to-[#FF6B35] flex items-center justify-center mb-2 md:mb-4">
                  <Crown className="h-8 w-8 md:h-12 md:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#138808] rounded-full flex items-center justify-center animate-pulse">
                  <Lock className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#800000] via-[#FF9933] to-[#FFD700] bg-clip-text text-transparent">
              SpotFix
            </h1>
            <div className="flex flex-col md:block">
              <p className="text-xl md:text-2xl font-semibold text-gray-700">{t("Administrator Portal")}</p>
            </div>


          </div>

          {/* Right Side - Login Form */}
          <Card className="shadow-2xl border border-card-border bg-card-bg backdrop-blur-2xl rounded-[40px] relative overflow-hidden transition-all duration-500">
            <CardHeader className="space-y-1 relative z-10 py-10">
              <CardTitle className="text-3xl font-black text-center flex items-center justify-center gap-3 text-text-primary uppercase tracking-tight">
                <Crown className="h-8 w-8 text-accent" />
                {t("Admin Login")}
              </CardTitle>
              <CardDescription className="text-center text-text-secondary font-medium tracking-wide">
                Log in to manage the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Tabs defaultValue="id" onValueChange={(v) => setLoginType(v as "id" | "email")} className="w-full mb-8">
                  <TabsList className="grid w-full grid-cols-2 bg-text-primary/5 p-1.5 rounded-[22px] h-16">
                    <TabsTrigger value="id" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[10px]">
                      <Crown className="w-4 h-4 mr-2" />
                      {t("Admin ID")}
                    </TabsTrigger>
                    <TabsTrigger value="email" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[10px]">
                      <Mail className="w-4 h-4 mr-2" />
                      {t("Email")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="identifier" className="flex items-center gap-2">
                    {loginType === "id" ? <Crown className="h-4 w-4 text-[#FFD700]" /> : <Mail className="h-4 w-4 text-[#FF9933]" />}
                    {loginType === "id" ? t("Admin ID") : t("Email Address")}
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={loginType === "id" ? "ADMIN-XXXXX" : "admin@example.com"}
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="border-[#FFD700]/40 focus:border-[#FF9933] bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-[#FF6B35]" />
                    {t("Secret Key label")}
                  </Label>
                  <Input
                    id="secretKey"
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    className="border-[#FFD700]/40 focus:border-[#FF9933] bg-white font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    {t("Admin unique key")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#138808]" />
                    {t("Password")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-[#FFD700]/40 focus:border-[#FF9933] bg-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-card-border" />
                    <span className="text-gray-600">{t("Stay logged in")}</span>
                  </label>
                  <a href="#" className="text-accent hover:underline">
                    {t("Reset credentials")}
                  </a>
                </div>



                <Button
                  type="submit"
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-white font-black uppercase tracking-widest shadow-lg hover:shadow-accent/40 hover:-translate-y-1 transition-all active:scale-95"
                  size="lg"
                  disabled={loading}
                >
                  <Crown className="h-5 w-5 mr-3" />
                  {loading ? t("Logging in") : t("Login")}
                </Button>


              </form>


            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Crown className="h-4 w-4 text-[#FFD700]" />
            © 2026 SpotFix | भारत सरकार • Government of India | Administrator Access
          </p>
        </div>
      </footer>
    </div>
  );
}