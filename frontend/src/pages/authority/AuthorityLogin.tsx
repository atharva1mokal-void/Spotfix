import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ShieldCheck, ArrowLeft, Building2, Mail, Smartphone, Zap } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

import { api } from "../../services/api";

export function AuthorityLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<"id" | "email">("id");
  const [formData, setFormData] = useState({
    identifier: "",
    department: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.department || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }

    setLoading(true);

    try {
      await api.login({
        email: formData.identifier,
        password: formData.password,
        userType: "authority",
      });
      toast.success("Login Successful");
      navigate("/authority");
    } catch (error: any) {
      toast.error(error.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full min-h-screen relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" style={{ animationDelay: '2s'}}></div>

      {/* Navigation Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/80 transition-all shadow-sm">
            <ArrowLeft className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-semibold text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Authority Portal</span>
            <ShieldCheck className="h-6 w-6 text-accent-secondary" />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center shadow-lg transform rotate-3">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter uppercase leading-none">
                Spot<span className="text-accent">Fix</span>
              </h1>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold text-text-primary uppercase tracking-tight">{t("Authority Portal")}</p>
              <p className="text-text-secondary font-medium mt-2 max-w-sm">Manage city reports, assign tasks, and track resolution progress.</p>
            </div>
            
            </div>

          {/* Right Side - Login Form */}
          <Card className="shadow-2xl border border-card-border bg-card-bg backdrop-blur-2xl rounded-[40px] relative overflow-hidden transition-all duration-500">
            <CardHeader className="space-y-1 relative z-10 py-10">
              <CardTitle className="text-3xl font-black text-center flex items-center justify-center gap-3 text-text-primary uppercase tracking-tight">
                <ShieldCheck className="h-8 w-8 text-accent" />
                {t("Authority Login")}
              </CardTitle>
              <CardDescription className="text-center text-text-secondary font-medium tracking-wide">
                Please login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Tabs defaultValue="id" onValueChange={(v) => setLoginType(v as "id" | "email")} className="w-full mb-8">
                  <TabsList className="grid w-full grid-cols-2 bg-text-primary/5 p-1.5 rounded-[22px] h-16">
                    <TabsTrigger value="id" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[10px]">
                      <Building2 className="w-4 h-4 mr-2" />
                      {t("Employee ID")}
                    </TabsTrigger>
                    <TabsTrigger value="email" className="rounded-2xl data-[state=active]:bg-bg-primary data-[state=active]:text-text-primary data-[state=active]:shadow-lg font-black uppercase tracking-widest text-[10px]">
                      <Mail className="w-4 h-4 mr-2" />
                      {t("Email")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-text-primary font-bold">
                    {loginType === "id" ? t("Employee ID") : t("Email Address")}
                  </Label>
                  <div className="relative">
                    {loginType === "id" ? (
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    ) : (
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    )}
                    <Input
                      id="identifier"
                      placeholder={loginType === "id" ? t("Enter employee ID") : t("Enter your email")}
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="pl-12 h-14 rounded-2xl bg-bg-primary border-card-border focus:ring-accent/20 text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-text-primary font-bold">{t("Department")}</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department" className="h-14 rounded-2xl bg-bg-primary border-card-border text-text-primary">
                      <SelectValue placeholder={t("Select Department")} />
                    </SelectTrigger>
                    <SelectContent className="bg-card-bg border-card-border rounded-2xl shadow-2xl">
                      <SelectItem value="roads">Roads & Public Works | सड़क विभाग</SelectItem>
                      <SelectItem value="water">Water & Sewage | जल विभाग</SelectItem>
                      <SelectItem value="sanitation">Sanitation Department | स्वच्छता विभाग</SelectItem>
                      <SelectItem value="electrical">Electrical & Lighting | बिजली विभाग</SelectItem>
                      <SelectItem value="health">Health Department | स्वास्थ्य विभाग</SelectItem>
                      <SelectItem value="admin">Administration | प्रशासन</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" title="password" className="text-text-primary font-bold">{t("Password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("Enter password")}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-14 rounded-2xl bg-bg-primary border-card-border focus:ring-accent/20 text-text-primary"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-black uppercase tracking-widest gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-card-border bg-bg-primary" />
                    <span className="text-text-secondary group-hover:text-text-primary transition-colors">Remember Me</span>
                  </label>
                  <button type="button" className="text-accent hover:underline text-right">
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-white font-black uppercase tracking-widest shadow-lg hover:shadow-accent/40 hover:-translate-y-1 transition-all active:scale-95"
                  size="lg"
                  disabled={loading}
                >
                  <ShieldCheck className="h-5 w-5 mr-3" />
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>


            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-card-border py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">
             SPOTFIX AUTHORITY DASHBOARD
          </p>
        </div>
      </footer>
    </div>
  );
}