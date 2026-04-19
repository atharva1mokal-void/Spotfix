import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, Camera, MapPin, Mic, Video, CheckCircle2, Loader2, ShieldCheck, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { statusConfig, categoryConfig } from "../../lib/constants";
import { type IssueStatus, type IssueCategory, type Issue } from "../../types";
import { api } from "../../services/api";
import { LocationPickerMap } from "../../components/common/LocationPickerMap";

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
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Your browser does not support the camera API.");
        return;
      }

      // Most foolproof constraint for laptops & desktops
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setImageFile(null); // Clear previous capture
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError') {
        toast.error("Permission denied. Check your browser's URL bar and allow camera access.");
      } else if (err.name === 'NotFoundError') {
        toast.error("No camera found. Please ensure it's plugged in and not used by another app.");
      } else {
        toast.error(`Camera failed to start: ${err.message || err.name}`);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImageFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  useEffect(() => {
    // Cleanup camera on unmount
    return () => stopCamera();
  }, []);

  // AI Prediction Trigger
  useEffect(() => {
    const handleAIPrediction = async () => {
      if (!imageFile) return;
      
      setIsPredicting(true);
      try {
        const result = await api.predictCategory(imageFile);
        if (result.success && result.prediction) {
          const predictedCategory = result.prediction as IssueCategory;
          setFormData(prev => ({ ...prev, category: predictedCategory }));
          toast.success(`AI detected category: ${categoryConfig[predictedCategory]?.label}`, {
            description: `Confidence: ${Math.round(result.confidence * 100)}%`,
          });
        }
      } catch (error) {
        console.error("AI Prediction failed:", error);
        // Silently fail or show a subtle message - don't block user
      } finally {
        setIsPredicting(false);
      }
    };

    handleAIPrediction();
  }, [imageFile]);

  const fetchLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by your browser";
      setLocationError(msg);
      toast.error(msg);
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setFormData(prev => ({ 
          ...prev, 
          location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}` 
        }));
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to fetch location. Please allow location access.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please allow location access to report an issue.";
        }
        console.error("Error fetching location:", error);
        setLocationError(errorMessage);
        toast.error(errorMessage);
        setLocationLoading(false);
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!coordinates) {
      toast.error("Location is required. Please allow location access.");
      fetchLocation();
      return;
    }

    setLoading(true);
    try {
      const lat = coordinates.lat;
      const lng = coordinates.lng;

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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 transition-colors duration-500">
        <Card className="max-w-md w-full text-center p-8 bg-card-bg border-card-border shadow-2xl rounded-[40px]">
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
    <div 
      className="w-full min-h-screen p-6 relative flex flex-col font-sans overflow-hidden bg-bg-primary transition-colors duration-500 ethnic-pattern"
    >
      {/* Dynamic Background Elements — static, no pulse to avoid GPU overload */}
      <div className="absolute top-[5%] left-[10%] w-64 h-64 bg-[#FF9933]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-[#138808]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 mb-8 max-w-[1200px] w-full mx-auto">
        <div className="flex items-center justify-between px-2">
          <Link 
            to="/citizen" 
            className="group flex items-center gap-3 bg-card-bg backdrop-blur-xl px-5 py-3 rounded-2xl border border-card-border hover:bg-white/10 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-text-secondary group-hover:text-accent transition-colors" />
            <span className="text-text-primary font-semibold text-sm tracking-tight uppercase">Control Hub</span>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase">Report Incident</h1>
            <p className="text-text-secondary text-xs font-black uppercase tracking-widest mt-1">Satellite Intelligence Node</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-[1000px] w-full mx-auto pb-12 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Guiding Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
              <div className="w-12 h-12 bg-[#FF9933]/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
              </div>
              <h3 className="text-text-primary font-black uppercase tracking-tight text-xl mb-3">AI Incident Routing</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Your report is analyzed in real-time. If other residents have reported the same issue nearby, the system will auto-escalate the priority.
              </p>
              <div className="mt-8 pt-6 border-t border-card-border flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-card-bg bg-bg-secondary" />
                  ))}
                </div>
                <span className="text-xs text-text-secondary font-black uppercase tracking-widest">1,200+ Node Links Live</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent to-accent-secondary p-8 rounded-[32px] text-white shadow-lg shadow-accent/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">GPS Precision</h3>
              <p className="text-white/80 text-sm font-medium">Precision coordinate synthesis for rapid response deployment.</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-8">
            <div className="bg-card-bg backdrop-blur-3xl p-10 rounded-[40px] border border-card-border shadow-card-shadow relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                {/* Visual Evidence - Live Camera */}
                <div className="space-y-4">
                  <Label className="text-text-primary font-black uppercase tracking-tight text-sm flex justify-between items-center">
                    Visual Evidence Live 
                    {imageFile && (
                      <button type="button" onClick={() => setImageFile(null)} className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1">
                        <X size={12}/> Remove
                      </button>
                    )}
                  </Label>
                  
                  <div className={`relative border-2 ${isCameraActive ? 'border-accent' : 'border-dashed border-card-border'} rounded-[32px] overflow-hidden bg-bg-primary/50`}>
                    
                    {/* Camera Feed */}
                    <div className={`${isCameraActive ? 'block' : 'hidden'} relative w-full aspect-video bg-black rounded-[32px] overflow-hidden`}>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                         <Button 
                           type="button" 
                           onClick={capturePhoto}
                           className="rounded-full h-14 bg-accent hover:bg-accent-secondary text-white font-black px-8 shadow-xl"
                         >
                           <Camera className="mr-2 h-5 w-5" /> CAPTURE
                         </Button>
                         <Button 
                           type="button" 
                           onClick={stopCamera}
                           variant="outline"
                           className="rounded-full h-14 bg-black/50 text-white border-none hover:bg-black/70 backdrop-blur-md px-6"
                         >
                           CANCEL
                         </Button>
                      </div>
                    </div>

                    {/* Image Preview / Start Button */}
                    {!isCameraActive && (
                      <div 
                        className={`relative p-10 text-center transition-all ${imageFile ? "bg-accent-secondary/5" : "hover:bg-accent/5 cursor-pointer"}`}
                        onClick={() => !imageFile && startCamera()}
                      >
                         {/* AI Scanning Overlay */}
                         {isPredicting && (
                           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-accent/10 backdrop-blur-sm animate-in fade-in duration-500">
                             <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                             <p className="text-accent font-black uppercase tracking-widest text-[10px] animate-pulse">AI Scanning Evidence...</p>
                           </div>
                         )}
                         <div className="relative z-10 flex flex-col items-center">
                           {imageFile ? (
                              <>
                                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-accent-secondary" />
                                <p className="text-text-primary font-black uppercase tracking-tight text-base mb-1">
                                  Image Captured Successfully
                                </p>
                                <Button 
                                  type="button" 
                                  onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                  variant="outline"
                                  className="mt-4 border-accent text-accent hover:bg-accent/10 rounded-2xl h-10 font-bold uppercase text-[10px] tracking-widest"
                                >
                                  Retake Photo
                                </Button>
                              </>
                           ) : (
                              <>
                                <Video className="h-16 w-16 mx-auto mb-4 text-text-secondary group-hover:text-accent transition-colors" />
                                <p className="text-text-primary font-black uppercase tracking-tight text-base mb-1">
                                  Start Live Camera
                                </p>
                                <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em]">Capture issue on-site</p>
                              </>
                           )}
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category Selection */}
                  <div className="space-y-4">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-sm">Inquiry Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as IssueCategory })}>
                      <SelectTrigger className="h-16 rounded-2xl bg-bg-primary border-card-border text-text-primary focus:ring-accent/20 shadow-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card-bg border-card-border rounded-2xl shadow-2xl">
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key} className="focus:bg-accent/10 focus:text-accent rounded-xl m-1 py-4 font-black uppercase tracking-tight text-xs">
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-sm">Short Title</Label>
                    <Input
                      placeholder="Brief headline..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-16 rounded-2xl bg-bg-primary border-card-border shadow-sm focus:ring-accent/20 text-text-primary"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-text-primary font-black uppercase tracking-tight text-sm">Deep Context</Label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-[0.1em] text-accent flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 hover:bg-accent/20 transition-all">
                      <Mic className="h-3 w-3" />
                      Voice Input
                    </button>
                  </div>
                  <Textarea
                    placeholder="Describe the incident details here..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-[32px] bg-bg-primary border-card-border p-6 shadow-sm focus:ring-accent/20 text-text-primary resize-none"
                  />
                </div>

                {/* Location Display */}
                <div className="p-8 bg-bg-primary/50 rounded-[40px] border border-card-border relative overflow-hidden group/loc">
                  <div className="mb-6 relative z-10">
                    <p className="text-text-primary font-black uppercase tracking-tight text-sm">Satellite Intelligence Node</p>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-widest mt-1">
                      Drag the map or click the button to establish coordinate lock
                    </p>
                  </div>
                  <div className="relative z-10">
                    <LocationPickerMap 
                      onLocationSelect={(loc) => {
                        setCoordinates({ lat: loc.lat, lng: loc.lng });
                        setFormData(prev => ({ ...prev, location: loc.address }));
                      }}
                      defaultLocation={coordinates || undefined}
                    />
                  </div>
                  {locationError && <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-2">{locationError}</p>}
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1 h-20 rounded-[30px] bg-gradient-to-r from-accent to-accent-secondary text-white font-black uppercase tracking-[0.2em] text-lg shadow-xl hover:shadow-accent/30 hover:-translate-y-1 transition-all active:scale-95">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <div className="flex items-center gap-3">Dispatch Incident <ArrowRight className="h-6 w-6" /></div>}
                  </Button>
                  <Button type="button" onClick={() => navigate("/citizen")} className="h-20 px-12 rounded-[30px] bg-card-bg border border-card-border text-text-secondary font-black uppercase tracking-widest hover:text-text-primary hover:bg-white/10 transition-all">
                    Dismiss
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      

    </div>
  );
}
