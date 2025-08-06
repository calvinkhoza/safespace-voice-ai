import { useState, useEffect } from "react";
import { AlertTriangle, FileText, MapPin, Camera, Upload, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";

interface IncidentReport {
  id: string;
  type: string;
  urgency: string;
  date: string;
  time: string;
  location: string;
  description: string;
  perpetrator?: string;
  witnesses?: string;
  notes?: string;
  anonymous: boolean;
  attachments: File[];
  status: 'draft' | 'submitted' | 'under_review' | 'resolved';
  submittedAt?: Date;
}

export const ReportIncident = () => {
  const [report, setReport] = useState<IncidentReport>({
    id: '',
    type: '',
    urgency: '',
    date: '',
    time: '',
    location: '',
    description: '',
    perpetrator: '',
    witnesses: '',
    notes: '',
    anonymous: false,
    attachments: [],
    status: 'draft'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedReports, setSavedReports] = useState<IncidentReport[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  
  const { t } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    // Load saved reports from localStorage
    const saved = localStorage.getItem('safevoice_reports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        () => {
          setCurrentLocation('Location access denied');
        }
      );
    }
  }, []);

  const incidentTypes = [
    { value: 'harassment', label: 'Harassment' },
    { value: 'assault', label: 'Physical Assault' },
    { value: 'sexual-assault', label: 'Sexual Assault' },
    { value: 'stalking', label: 'Stalking' },
    { value: 'domestic-violence', label: 'Domestic Violence' },
    { value: 'cyberbullying', label: 'Cyberbullying' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'immediate', label: 'Immediate Danger', color: 'destructive' },
    { value: 'high', label: 'High Priority', color: 'warning' },
    { value: 'medium', label: 'Medium Priority', color: 'secondary' },
    { value: 'low', label: 'Low Priority', color: 'default' }
  ];

  const handleInputChange = (field: keyof IncidentReport, value: any) => {
    setReport(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf', '.doc', '.docx'];
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 100MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));

    toast({
      title: "Files uploaded",
      description: `${validFiles.length} file(s) added to report`,
      variant: "default"
    });
  };

  const removeAttachment = (index: number) => {
    setReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const saveAsDraft = () => {
    const draftReport: IncidentReport = {
      ...report,
      id: report.id || `draft-${Date.now()}`,
      status: 'draft'
    };

    const updatedReports = savedReports.filter(r => r.id !== draftReport.id);
    updatedReports.push(draftReport);
    
    setSavedReports(updatedReports);
    localStorage.setItem('safevoice_reports', JSON.stringify(updatedReports));
    
    toast({
      title: "Draft saved",
      description: "Your report has been saved as a draft",
      variant: "default"
    });
  };

  const submitReport = async () => {
    if (!report.type || !report.urgency || !report.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      const submittedReport: IncidentReport = {
        ...report,
        id: `report-${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date()
      };

      const updatedReports = savedReports.filter(r => r.id !== report.id);
      updatedReports.push(submittedReport);
      
      setSavedReports(updatedReports);
      localStorage.setItem('safevoice_reports', JSON.stringify(updatedReports));

      // Reset form
      setReport({
        id: '',
        type: '',
        urgency: '',
        date: '',
        time: '',
        location: '',
        description: '',
        perpetrator: '',
        witnesses: '',
        notes: '',
        anonymous: false,
        attachments: [],
        status: 'draft'
      });

      setIsSubmitting(false);

      toast({
        title: "Report submitted",
        description: `Report #${submittedReport.id} has been submitted successfully`,
        variant: "default"
      });

      if (isVoiceEnabled) {
        speak("Your report has been submitted successfully. You will be contacted if additional information is needed.");
      }
    }, 2000);
  };

  const loadDraft = (draft: IncidentReport) => {
    setReport(draft);
    toast({
      title: "Draft loaded",
      description: "Draft report loaded for editing",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          {t('report_incident')}
        </h1>
        <p className="text-muted-foreground">
          Submit a confidential report about an incident. All information is encrypted and secure.
        </p>
      </div>

      {/* Saved Drafts */}
      {savedReports.filter(r => r.status === 'draft').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saved Drafts</CardTitle>
            <CardDescription>Continue working on a saved draft</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {savedReports.filter(r => r.status === 'draft').map((draft) => (
                <div key={draft.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{draft.type || 'Untitled Draft'}</p>
                    <p className="text-sm text-muted-foreground">
                      {draft.description ? `${draft.description.substring(0, 50)}...` : 'No description'}
                    </p>
                  </div>
                  <Button onClick={() => loadDraft(draft)} variant="outline" size="sm">
                    Load Draft
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Report Form */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>
            Please provide as much detail as you feel comfortable sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="incident-type">Incident Type *</Label>
              <Select value={report.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={report.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Incident</Label>
              <Input
                type="date"
                value={report.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time of Incident</Label>
              <Input
                type="time"
                value={report.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Where did this occur?"
                value={report.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => handleInputChange('location', currentLocation)}
                disabled={!currentLocation}
                title="Use current location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {currentLocation && (
              <p className="text-xs text-muted-foreground">
                Current location: {currentLocation}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Incident Description *</Label>
            <Textarea
              placeholder="Please describe what happened. Include as much detail as you feel comfortable sharing."
              value={report.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perpetrator">Perpetrator Information (if known)</Label>
              <Textarea
                placeholder="Any information about the person(s) involved (name, description, relationship to you, etc.)"
                value={report.perpetrator}
                onChange={(e) => handleInputChange('perpetrator', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                placeholder="Were there any witnesses?"
                value={report.witnesses}
                onChange={(e) => handleInputChange('witnesses', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                placeholder="Any additional information you'd like to share"
                value={report.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-4">
            <Label>Evidence/Attachments</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported: Images, Videos, Audio, Documents (Max 100MB per file)
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                <Camera className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            </div>

            {/* Display attached files */}
            {report.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attached Files:</p>
                <div className="space-y-2">
                  {report.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(file.size / (1024 * 1024)).toFixed(1)}MB
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={report.anonymous}
              onCheckedChange={(checked) => handleInputChange('anonymous', checked)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit this report anonymously
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={saveAsDraft} variant="outline" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={submitReport} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Reports */}
      {savedReports.filter(r => r.status !== 'draft').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Previous Reports</CardTitle>
            <CardDescription>Track the status of your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedReports
                .filter(r => r.status !== 'draft')
                .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Report #{report.id}</p>
                        <Badge variant={
                          report.status === 'submitted' ? 'secondary' :
                          report.status === 'under_review' ? 'warning' :
                          'success'
                        }>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {incidentTypes.find(t => t.value === report.type)?.label} - {report.urgency}
                      </p>
                      {report.submittedAt && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(report.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};