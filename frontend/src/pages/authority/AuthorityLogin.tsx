import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ShieldCheck, ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../services/api";

export function AuthorityLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.department || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }

    setLoading(true);
    try {
      await api.login({
        email: formData.employeeId,
        password: formData.password,
        userType: "authority",
      });
      toast.success(t("Welcome!"));
      navigate("/authority");
    } catch (error: any) {
      toast.error(error.message || t("Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-white relative overflow-hidden">
      {/* Indian Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-6 grid-rows-6 h-full">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="border border-[#000080] flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#FF9933]"></div>
            </div>
          ))}
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
                <ShieldCheck className="h-12 w-12 md:h-20 md:w-20 text-[#000080] mb-2 md:mb-4" />
                <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#FF9933] rounded-full flex items-center justify-center">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#000080] via-[#FF6B35] to-[#FF9933] bg-clip-text text-transparent">
              SpotFix
            </h1>
            <div className="flex flex-col md:block">
              <p className="text-xl md:text-2xl font-semibold text-gray-700">{t("Authority Portal")}</p>
            </div>
            
            {/* Decorative Element */}
            <div className="hidden md:block">
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border-l-4 border-[#000080]">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  🏛️ {t("Authorized Access")}
                </p>
                <p className="text-xs text-gray-600">
                  {t("Auth Personnel Only")}
                </p>
              </div>
              
              <div className="flex justify-center md:justify-start gap-3 mt-6">
                <div className="w-12 h-1 bg-[#FF9933]"></div>
                <div className="w-12 h-1 bg-white border border-[#000080]"></div>
                <div className="w-12 h-1 bg-[#138808]"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="shadow-2xl border-2 border-[#000080]/20 relative overflow-hidden">
            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-32 h-32">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#FF9933]"></div>
              <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#000080]"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#138808]"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#FF9933]"></div>
            </div>
            
            <CardHeader className="space-y-1 relative z-10">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <ShieldCheck className="h-6 w-6 text-[#000080]" />
                {t("Authority Login")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("Authorized Access")}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">{t("Employee ID")}</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="GOV-XXXXX"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="border-[#000080]/30 focus:border-[#000080]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">{t("Department")}</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger id="department" className="border-[#000080]/30 focus:border-[#000080]">
                      <SelectValue placeholder={t("Select Department")} />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="password">{t("Password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("Enter password")}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-[#000080]/30 focus:border-[#000080]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-[#000080]/50" />
                    <span className="text-gray-600">{t("Remember me")}</span>
                  </label>
                  <a href="#" className="text-[#000080] hover:text-[#FF6B35] hover:underline">
                    {t("Forgot password?")}
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#000080] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#000080] text-white"
                  size="lg"
                  disabled={loading}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {loading ? t("Logging in") : t("Secure Login")}
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
                  className="w-full border-[#000080]/30 hover:bg-blue-50"
                >
                  {t("Login with Signature")}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border-l-4 border-[#000080]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#000080] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      {t("Secure Connection")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {t("Communications encrypted")}
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
          <p className="text-sm text-gray-600">
            © 2026 SpotFix | भारत सरकार • Government of India | Authorized Personnel Access
          </p>
        </div>
      </footer>
    </div>
  );
}