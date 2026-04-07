import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, Camera, MapPin, Mic, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { statusConfig, categoryConfig } from "../../lib/constants";
import { type IssueStatus, type IssueCategory, type Issue } from "../../types";
import { api } from "../../services/api";

export function ReportIssue() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as IssueCategory | "",
    location: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Mock coordinates for now
      const lat = 19.0330 + (Math.random() - 0.5) * 0.01;
      const lng = 73.0297 + (Math.random() - 0.5) * 0.01;

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : { name: "Anonymous" };

      const issueFormData = new FormData();
      issueFormData.append("title", formData.title);
      issueFormData.append("description", formData.description);
      issueFormData.append("category", formData.category);
      issueFormData.append("location", JSON.stringify({
        lat,
        lng,
        address: formData.location || "Kharghar, Navi Mumbai",
      }));
      issueFormData.append("priority", "medium");
      
      if (imageFile) {
        issueFormData.append("image", imageFile);
      }

      await api.reportIssue(issueFormData);

      setSubmitted(true);
      toast.success("Issue reported successfully!");
    } catch (error: any) {
      console.error("Failed to report issue:", error);
      toast.error(error.message || "Failed to report issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle>Issue Reported Successfully!</CardTitle>
            <CardDescription>
              Your report has been submitted and assigned to the appropriate department.
              You'll receive notifications as the status changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Issue ID: <span className="font-mono font-semibold">#CR{Math.floor(Math.random() * 10000)}</span>
            </p>
            <Button onClick={() => navigate("/citizen")} className="w-full">
              View My Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/citizen" className="inline-flex items-center gap-2 text-sm hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Report a Civic Issue</h1>
            <p className="text-sm md:text-base text-gray-600">
              Help us make your city better by reporting issues you encounter
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
              <CardDescription>
                Provide as much information as possible to help us resolve the issue quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label>Photo Evidence *</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors cursor-pointer ${imageFile ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400"}`}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Camera className={`h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 ${imageFile ? "text-green-500" : "text-gray-400"}`} />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {imageFile ? `Selected: ${imageFile.name}` : "Click to capture or upload photo"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    <Input 
                      id="file-input"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as IssueCategory })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Large pothole on Main Street"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of the issue..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Mic className="h-4 w-4 mr-2" />
                    Use Voice Input
                  </Button>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Detecting GPS location..."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    GPS coordinates are automatically captured with your permission
                  </p>
                </div>

                {/* Priority Indicator */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your report will be automatically routed to the appropriate 
                    department based on the category selected. You'll receive real-time updates via notifications.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1 py-6 sm:py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="py-6 sm:py-2" onClick={() => navigate("/citizen")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
