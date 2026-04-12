import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Eye, ArrowLeft, UserPlus, Mail, Lock, User, Smartphone } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 border-8 border-[#FF9933] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 border-8 border-[#138808] rounded-full"></div>
      </div>

      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/login/citizen" className="inline-flex items-center gap-2 text-sm hover:text-[#FF6B35]">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl border-2 border-[#FF9933]/20">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <UserPlus className="h-8 w-8 text-[#FF6B35]" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl text-center">नागरिक पंजीकरण</CardTitle>
            <CardDescription className="text-center text-xs sm:text-sm">
              Citizen Registration - Create your account to start reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">नाम / Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ईमेल / Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">मोबाइल नंबर / Mobile Number *</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="pl-10"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">पासवर्ड / Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें / Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#FF9933] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF9933] text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? "पंजीकरण हो रहा है..." : "पंजीकरण करें / Register"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login/citizen" className="text-[#FF6B35] hover:text-[#FF9933] hover:underline font-semibold">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
