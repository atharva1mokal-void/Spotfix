import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, MapPin, Calendar, User, Building2, Clock, CheckCircle2, FileText, Loader2 } from "lucide-react";
import { statusConfig, categoryConfig } from "../../lib/constants";
import { type Issue } from "../../types";
import { api } from "../../services/api";
import { format } from "date-fns";
import { ImageWithFallback } from "../../components/common/ImageWithFallback";
import { toast } from "sonner";

export function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchIssue = async () => {
      if (!id) return;
      try {
        const data = await api.getIssueById(id);
        setIssue(data);
      } catch (error) {
        console.error("Failed to fetch issue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    try {
      await api.updateIssue(id, { status: newStatus as any });
      toast.success("Status updated");
      // Refresh issue data
      const data = await api.getIssueById(id);
      setIssue(data);
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#FF9933] animate-spin mb-4" />
        <p className="text-gray-600">Loading issue details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Issue Not Found</h2>
            <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist.</p>
            <Link to="/citizen">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryInfo = (categoryConfig as any)[issue.category];
  const statusInfo = (statusConfig as any)[issue.status];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to={user?.userType === "authority" ? "/authority" : "/citizen"} className="inline-flex items-center gap-2 text-sm hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{issue.title}</h1>
                <p className="text-sm md:text-base text-gray-600">Issue ID: #{issue.id.slice(-6).toUpperCase()}</p>
              </div>
              <Badge
                style={{ backgroundColor: statusInfo.color }}
                className="text-white text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 whitespace-nowrap"
              >
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Photo Evidence */}
              <Card>
                <CardHeader>
                  <CardTitle>Photo Evidence</CardTitle>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                  <ImageWithFallback
                    src={issue.imageUrl ? `http://localhost:5000${issue.imageUrl}` : getIssueImage(issue.category)}
                    alt={issue.title}
                    className="w-full h-48 sm:h-64 object-cover sm:rounded-lg"
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                </CardContent>
              </Card>

              {user?.userType === "authority" && issue.status !== "resolved" && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800 text-lg">Authority Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-3">
                    {issue.status === "submitted" && (
                      <Button className="w-full sm:w-auto" onClick={() => handleStatusUpdate("in_progress")}>
                        Mark In Progress
                      </Button>
                    )}
                    {issue.status === "in_progress" && (
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusUpdate("resolved")}>
                        Mark Resolved
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <TimelineItem
                      status="submitted"
                      date={issue.reportedAt}
                      description="Issue reported and submitted to the system"
                      isCompleted={true}
                    />
                    {issue.status !== "submitted" && (
                      <TimelineItem
                        status="in_progress"
                        date={issue.updatedAt}
                        description={`Assigned to ${issue.assignedTo} at ${issue.department}`}
                        isCompleted={true}
                      />
                    )}
                    {issue.status === "resolved" && (
                      <TimelineItem
                        status="resolved"
                        date={issue.updatedAt}
                        description="Issue has been successfully resolved"
                        isCompleted={true}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resolution Notes */}
              {issue.resolutionNotes && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="h-5 w-5" />
                      Resolution Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">{issue.resolutionNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem
                    icon={<Building2 className="h-5 w-5 text-gray-500" />}
                    label="Category"
                  >
                    <Badge
                      variant="outline"
                      style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}
                    >
                      {categoryInfo.label}
                    </Badge>
                  </InfoItem>

                  <Separator />

                  <InfoItem
                    icon={<User className="h-5 w-5 text-gray-500" />}
                    label="Reported By"
                  >
                    {issue.reportedBy}
                  </InfoItem>

                  <Separator />

                  <InfoItem
                    icon={<Calendar className="h-5 w-5 text-gray-500" />}
                    label="Reported On"
                  >
                    {format(new Date(issue.reportedAt), "MMM dd, yyyy 'at' h:mm a")}
                  </InfoItem>

                  <Separator />

                  <InfoItem
                    icon={<Clock className="h-5 w-5 text-gray-500" />}
                    label="Last Updated"
                  >
                    {format(new Date(issue.updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                  </InfoItem>

                  <Separator />

                  <InfoItem
                    icon={<MapPin className="h-5 w-5 text-gray-500" />}
                    label="Location"
                  >
                    <div className="text-sm">
                      {issue.location.address}
                    </div>
                  </InfoItem>
                </CardContent>
              </Card>

              {/* Assignment Info */}
              {issue.assignedTo && (
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Department</p>
                      <p className="font-medium">{issue.department}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                      <p className="font-medium">{issue.assignedTo}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Map View</p>
                      <p className="text-xs text-gray-500">
                        {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  status,
  date,
  description,
  isCompleted,
}: {
  status: string;
  date: Date;
  description: string;
  isCompleted: boolean;
}) {
  const statusColors = {
    submitted: "bg-gray-500",
    in_progress: "bg-orange-500",
    resolved: "bg-green-500",
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted ? statusColors[status as keyof typeof statusColors] : "bg-gray-300"
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-white" />
          ) : (
            <Clock className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
      </div>
      <div className="flex-1 pb-6">
        <p className="font-medium mb-1 capitalize">{status.replace("_", " ")}</p>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        <p className="text-xs text-gray-500">{format(new Date(date), "MMM dd, yyyy 'at' h:mm a")}</p>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}

function getIssueImage(category: string): string {
  const images: Record<string, string> = {
    roads: "https://images.unsplash.com/photo-1694804304298-c79443f5e2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcG90aG9sZSUyMHJvYWQlMjBkYW1hZ2V8ZW58MXx8fHwxNzczMjEzOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    streetlights: "https://images.unsplash.com/photo-1770447323553-5cd1b6711134?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXRsaWdodCUyMG5pZ2h0fGVufDF8fHx8MTc3MzIwODA3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    garbage: "https://images.unsplash.com/photo-1762805543739-861a9901a304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwYmlucyUyMG92ZXJmbG93JTIwdHJhc2h8ZW58MXx8fHwxNzczMjEzOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    water: "https://images.unsplash.com/photo-1639335875048-a14e75abc083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHBpcGUlMjBsZWFrJTIwc3RyZWV0fGVufDF8fHx8MTc3MzIxMzkwOHww&ixlib=rb-4.1.0&q=80&w=1080",
    sanitation: "https://images.unsplash.com/photo-1762805543739-861a9901a304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJiYWdlJTIwYmlucyUyMG92ZXJmbG93JTIwdHJhc2h8ZW58MXx8fHwxNzczMjEzOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    other: "https://images.unsplash.com/photo-1766101366109-a7fd9c01990a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGdvdmVybm1lbnQlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzMyMTM5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  };
  return images[category] || images.other;
}
