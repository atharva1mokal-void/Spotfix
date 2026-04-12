import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Crown, ArrowLeft, Lock, Fingerprint } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../services/api";

export function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    adminId: "",
    secretKey: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminId || !formData.secretKey || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }
    
    setLoading(true);
    try {
      await api.login({
        email: formData.adminId,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Indian Pattern Background - Mandala Style */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-[800px] h-[800px]">
            {/* Outer circles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`outer-${i}`}
                className="absolute top-1/2 left-1/2 w-4 h-4"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-300px)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-[#FF9933]"></div>
              </div>
            ))}
            {/* Middle circles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`middle-${i}`}
                className="absolute top-1/2 left-1/2 w-6 h-6"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-200px)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-[#000080]"></div>
              </div>
            ))}
            {/* Inner circles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`inner-${i}`}
                className="absolute top-1/2 left-1/2 w-8 h-8"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-100px)`,
                }}
              >
                <div className="w-full h-full rounded-full bg-[#138808]"></div>
              </div>
            ))}
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-8 border-[#FF9933]"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm hover:text-[#FF6B35]">
            <ArrowLeft className="h-4 w-4" />
            {t("Home")}
          </Link>
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
            
            {/* Decorative Element */}
            <div className="hidden md:block">
              <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border-2 border-[#FFD700]/50 relative overflow-hidden">
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-3 h-3 bg-[#FF9933]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFD700]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#138808]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#000080]"></div>
                
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  👑 {t("System Administrator")}
                </p>
                <p className="text-xs text-gray-600">
                  {t("System Security")}
                </p>
              </div>
              
              {/* Decorative divider */}
              <div className="flex items-center gap-2 mt-6">
                <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#FF9933] to-transparent"></div>
                <Crown className="h-5 w-5 text-[#FFD700]" />
                <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#138808] to-transparent"></div>
              </div>
              
              <p className="mt-4 text-center text-xs text-gray-500 italic">
                "सत्यमेव जयते"
              </p>
              <p className="text-center text-xs text-gray-400">
                Truth Alone Triumphs
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="shadow-2xl border-2 border-[#FFD700]/30 relative overflow-hidden bg-gradient-to-br from-white to-orange-50/30">
            {/* Decorative corner patterns */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#138808] via-white to-[#FF9933]"></div>
            
            <CardHeader className="space-y-1 relative z-10 pt-6">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Crown className="h-6 w-6 text-[#FFD700]" />
                {t("Admin Login")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("High-Level Security")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="adminId" className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-[#FFD700]" />
                    {t("Admin ID or Email")}
                  </Label>
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="ADMIN-XXXXX"
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
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
                    <input type="checkbox" className="rounded border-[#FFD700]" />
                    <span className="text-gray-600">{t("Secure session")}</span>
                  </label>
                  <a href="#" className="text-[#FF6B35] hover:text-[#FF9933] hover:underline">
                    {t("Reset credentials")}
                  </a>
                </div>

                {/* Security Warning */}
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800 flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    {t("Multi-factor auth")}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#800000] via-[#FF9933] to-[#FFD700] hover:from-[#FFD700] hover:to-[#800000] text-white"
                  size="lg"
                  disabled={loading}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {loading ? t("Logging in") : t("Secure Access")}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">{t("or")}</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-[#FFD700]/40 hover:bg-orange-50"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  {t("Biometric Auth")}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-l-4 border-[#FF9933]">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-[#FF9933] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {t("Maximum Security Level")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("Admin activities logged")}
                    </p>
                  </div>
                </div>
              </div>
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