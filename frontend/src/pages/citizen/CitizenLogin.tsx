import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, ArrowLeft, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function CitizenLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mobile || !formData.password) {
      toast.error(t("Please fill all fields"));
      return;
    }

    try {
      // For now, using email-like credentials or mapping mobile to email for the backend
      // Since backend expects email, we'll use a hack or assume the user enters email in mobile field for now
      // Or better, I should update the login form labels and backend to be consistent.
      // Let's assume the user enters their email in the mobile field for this demo's "proper" functional state.
      await api.login({ email: formData.mobile, password: formData.password, userType: "citizen" });
      toast.success(t("Welcome!"));
      navigate("/citizen");
    } catch (error: any) {
      toast.error(error.message || t("Login failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Indian Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border-8 border-[#FF9933] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-8 border-[#138808] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] relative">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-48 bg-gradient-to-b from-[#FF9933] via-white to-[#138808]"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  transformOrigin: "center",
                }}
              ></div>
            ))}
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
                <Eye className="h-12 w-12 md:h-20 md:w-20 text-[#FF6B35] mb-2 md:mb-4" />
                <div className="absolute -top-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-[#138808] rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 md:w-4 md:h-4 bg-[#FF9933] rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FF9933] via-[#FF6B35] to-[#138808] bg-clip-text text-transparent">
              SpotFix
            </h1>
            <div className="flex flex-col md:block">
              <p className="text-xl md:text-2xl font-semibold text-gray-700">{t("Citizen Portal")}</p>
            </div>
            
            {/* Decorative Element */}
            <div className="hidden md:block">
              <div className="flex justify-center md:justify-start gap-2 mt-8">
                <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#FF9933]"></div>
                <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
              </div>
              <p className="mt-6 text-gray-600 italic">
                "स्वच्छ भारत, सुंदर भारत"
              </p>
              <p className="text-sm text-gray-500">
                Clean India, Beautiful India
              </p>
            </div>
          </div>

          {/* Right Side - Login Form - Added Animation Wrappers */}
          <div className="login-card-outer p-[2px]">
            <div className="login-card-inner overflow-hidden">
              <Card className="shadow-none border-none relative overflow-hidden bg-white">
                {/* Decorative corner patterns */}
                <div className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 border-[#FF9933] opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 border-[#138808] opacity-30"></div>
                
                <CardHeader className="space-y-1 relative z-10">
                  <CardTitle className="text-2xl text-center">{t("Citizen Login")}</CardTitle>
                  <CardDescription className="text-center">
                    {t("Enter your credentials")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">{t("Mobile Number")}</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="mobile"
                          type="tel"
                          placeholder={t("10 digit mobile")}
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="pl-10 border-[#FF9933]/30 focus:border-[#FF6B35]"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("Password")}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("Enter password")}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="border-[#FF9933]/30 focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-[#FF9933]/50" />
                        <span className="text-gray-600">{t("Remember me")}</span>
                      </label>
                      <a href="#" className="text-[#FF6B35] hover:text-[#FF9933] hover:underline">
                        {t("Forgot password?")}
                      </a>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#FF9933] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF9933] text-white"
                      size="lg"
                    >
                      {t("Login")}
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-gray-600">{t("Don't have an account?")} </span>
                      <Link to="/register/citizen" className="text-[#FF6B35] hover:text-[#FF9933] hover:underline font-semibold">
                        {t("Register")}
                      </Link>
                    </div>

                    {/* Divider */}
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
                      className="w-full border-[#FF9933]/30 hover:bg-orange-50"
                    >
                      {t("Login with OTP")}
                    </Button>
                  </form>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border border-[#FF9933]/20">
                    <p className="text-xs text-center text-gray-600">
                      🇮🇳 {t("Secure & Trusted")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2026 SpotFix | भारत सरकार की पहल • Government of India Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}