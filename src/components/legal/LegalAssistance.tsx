import { useState, useEffect } from "react";
import { Scale, Phone, Calendar, FileText, Users, MessageCircle, Download, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";

interface LegalResource {
  id: string;
  title: string;
  type: 'guide' | 'form' | 'contact' | 'process';
  category: 'rights' | 'restraining_order' | 'legal_process' | 'emergency' | 'domestic_violence';
  description: string;
  downloadUrl?: string;
  externalUrl?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

interface LegalContact {
  id: string;
  name: string;
  type: 'attorney' | 'legal_aid' | 'hotline' | 'organization';
  specialization: string[];
  phone: string;
  email?: string;
  address?: string;
  availability: string;
  rating: number;
  freeConsultation: boolean;
  languages: string[];
}

interface ConsultationRequest {
  id: string;
  type: 'phone' | 'video' | 'in_person';
  preferredDate: Date;
  urgency: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const LegalAssistance = () => {
  const [legalResources, setLegalResources] = useState<LegalResource[]>([]);
  const [legalContacts, setLegalContacts] = useState<LegalContact[]>([]);
  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  
  const { t } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    initializeMockData();
    loadConsultationRequests();
  }, []);

  const initializeMockData = () => {
    const mockResources: LegalResource[] = [
      {
        id: '1',
        title: 'Know Your Rights: A Guide for Survivors',
        type: 'guide',
        category: 'rights',
        description: 'Comprehensive guide explaining your legal rights as a survivor of gender-based violence in South Africa.',
        downloadUrl: '/resources/legal-rights-guide.pdf',
        urgency: 'medium'
      },
      {
        id: '2',
        title: 'Protection Order Application Form',
        type: 'form',
        category: 'restraining_order',
        description: 'Official form to apply for a protection order against domestic violence. Includes step-by-step instructions.',
        downloadUrl: '/forms/protection-order-form.pdf',
        urgency: 'high'
      },
      {
        id: '3',
        title: 'Domestic Violence Act Overview',
        type: 'guide',
        category: 'domestic_violence',
        description: 'Overview of the Domestic Violence Act and how it protects survivors.',
        downloadUrl: '/resources/domestic-violence-act.pdf',
        urgency: 'medium'
      },
      {
        id: '4',
        title: 'Criminal Case Process Guide',
        type: 'process',
        category: 'legal_process',
        description: 'Step-by-step guide through the criminal justice process for gender-based violence cases.',
        downloadUrl: '/resources/criminal-process-guide.pdf',
        urgency: 'medium'
      },
      {
        id: '5',
        title: 'Emergency Legal Contacts',
        type: 'contact',
        category: 'emergency',
        description: 'List of emergency legal contacts available 24/7 for urgent situations.',
        urgency: 'urgent'
      }
    ];

    const mockContacts: LegalContact[] = [
      {
        id: '1',
        name: 'Legal Aid South Africa - Cape Town',
        type: 'legal_aid',
        specialization: ['domestic violence', 'sexual assault', 'protection orders'],
        phone: '+27214268282',
        email: 'info@legal-aid.co.za',
        address: '1st Floor, 32 Spin Street, Cape Town',
        availability: 'Mon-Fri 8:00-16:30',
        rating: 4.3,
        freeConsultation: true,
        languages: ['English', 'Afrikaans', 'isiXhosa', 'isiZulu']
      },
      {
        id: '2',
        name: 'Women\'s Legal Centre',
        type: 'organization',
        specialization: ['gender-based violence', 'women\'s rights', 'family law'],
        phone: '+27214242104',
        email: 'info@wlce.co.za',
        address: '7th Floor, Constitution House, 124 Adderley Street, Cape Town',
        availability: 'Mon-Fri 9:00-17:00',
        rating: 4.8,
        freeConsultation: true,
        languages: ['English', 'Afrikaans', 'isiXhosa']
      },
      {
        id: '3',
        name: 'Adv. Sarah Johnson',
        type: 'attorney',
        specialization: ['domestic violence', 'restraining orders', 'criminal law'],
        phone: '+27215551234',
        email: 'sarah@lawfirm.co.za',
        address: '15th Floor, ABSA Centre, 2 Riebeek Street, Cape Town',
        availability: 'Mon-Fri 8:00-17:00, Emergency 24/7',
        rating: 4.9,
        freeConsultation: false,
        languages: ['English', 'Afrikaans']
      },
      {
        id: '4',
        name: 'GBV Command Centre Helpline',
        type: 'hotline',
        specialization: ['crisis intervention', 'immediate support', 'referrals'],
        phone: '0800428428',
        availability: '24/7',
        rating: 4.6,
        freeConsultation: true,
        languages: ['English', 'Afrikaans', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana']
      },
      {
        id: '5',
        name: 'Rape Crisis Cape Town Trust',
        type: 'organization',
        specialization: ['sexual violence', 'counseling', 'court support'],
        phone: '+27214479762',
        email: 'info@rapecrisis.org.za',
        address: '17 Trill Road, Observatory, Cape Town',
        availability: 'Crisis Line: 24/7, Office: Mon-Fri 8:00-16:30',
        rating: 4.7,
        freeConsultation: true,
        languages: ['English', 'Afrikaans', 'isiXhosa']
      }
    ];

    setLegalResources(mockResources);
    setLegalContacts(mockContacts);
  };

  const loadConsultationRequests = () => {
    const saved = localStorage.getItem('safevoice_consultations');
    if (saved) {
      setConsultationRequests(JSON.parse(saved));
    }
  };

  const downloadResource = (resource: LegalResource) => {
    toast({
      title: "Download started",
      description: `Downloading ${resource.title}`,
      variant: "default"
    });

    if (isVoiceEnabled) {
      speak(`Downloading ${resource.title}`);
    }
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const callContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const emailContact = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const scheduleConsultation = (contactId: string) => {
    const contact = legalContacts.find(c => c.id === contactId);
    if (contact) {
      toast({
        title: "Consultation request",
        description: `Preparing consultation request with ${contact.name}`,
        variant: "default"
      });
      setShowConsultationForm(true);
    }
  };

  const submitConsultationRequest = (formData: any) => {
    const newRequest: ConsultationRequest = {
      id: `consultation-${Date.now()}`,
      type: formData.type,
      preferredDate: new Date(formData.date),
      urgency: formData.urgency,
      description: formData.description,
      status: 'pending'
    };

    const updatedRequests = [...consultationRequests, newRequest];
    setConsultationRequests(updatedRequests);
    localStorage.setItem('safevoice_consultations', JSON.stringify(updatedRequests));

    toast({
      title: "Consultation requested",
      description: "Your consultation request has been submitted. You will be contacted within 24 hours.",
      variant: "default"
    });

    setShowConsultationForm(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'attorney': return <Scale className="h-5 w-5" />;
      case 'legal_aid': return <Shield className="h-5 w-5" />;
      case 'hotline': return <Phone className="h-5 w-5" />;
      case 'organization': return <Users className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const filteredResources = legalResources.filter(resource => 
    selectedCategory === 'all' || resource.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          {t('legal_assistance')}
        </h1>
        <p className="text-muted-foreground">
          Access legal resources, guidance, and connect with attorneys
        </p>
      </div>

      {/* Emergency Legal Help */}
      <Card className="border-destructive/20 bg-gradient-emergency shadow-emergency">
        <CardHeader>
          <CardTitle className="text-destructive-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Emergency Legal Help
          </CardTitle>
          <CardDescription className="text-destructive-foreground/80">
            Immediate legal assistance available 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="secondary" 
              className="h-16 flex-col gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20"
              onClick={() => callContact('0800428428')}
            >
              <Phone className="h-5 w-5" />
              <span className="text-sm">GBV Helpline: 0800 428 428</span>
            </Button>
            <Button 
              variant="secondary" 
              className="h-16 flex-col gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20"
              onClick={() => callContact('10111')}
            >
              <Shield className="h-5 w-5" />
              <span className="text-sm">Police Emergency: 10111</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Legal Actions</CardTitle>
          <CardDescription>Common legal procedures and forms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-xs">Protection Order</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Phone className="h-5 w-5" />
              <span className="text-xs">Legal Consultation</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs">Find Attorney</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="h-5 w-5" />
              <span className="text-xs">Legal Forms</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legal Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Resources</CardTitle>
          <CardDescription>
            Educational materials and forms to help you understand your rights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="rights">Legal Rights</SelectItem>
              <SelectItem value="restraining_order">Protection Orders</SelectItem>
              <SelectItem value="legal_process">Legal Process</SelectItem>
              <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <Badge variant={getUrgencyColor(resource.urgency) as "default" | "destructive" | "secondary" | "outline"}>
                        {resource.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <div className="flex gap-2">
                      {resource.downloadUrl && (
                        <Button size="sm" onClick={() => downloadResource(resource)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {resource.externalUrl && (
                        <Button size="sm" variant="outline" onClick={() => openExternalLink(resource.externalUrl!)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Online
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Legal Contacts & Support</CardTitle>
          <CardDescription>
            Connect with legal professionals and support organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {legalContacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getContactTypeIcon(contact.type)}
                        <h3 className="font-semibold">{contact.name}</h3>
                        {contact.freeConsultation && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Free Consultation
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.specialization.join(', ')}
                      </p>
                      {contact.address && (
                        <p className="text-xs text-muted-foreground">{contact.address}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">{contact.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(contact.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.availability}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {contact.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => callContact(contact.phone)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    {contact.email && (
                      <Button size="sm" variant="outline" onClick={() => emailContact(contact.email!)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => scheduleConsultation(contact.id)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Consultation Requests */}
      {consultationRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Consultation Requests</CardTitle>
            <CardDescription>Track your legal consultation requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consultationRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{request.type} consultation</p>
                    <p className="text-sm text-muted-foreground">
                      {request.preferredDate.toLocaleDateString()} - {request.urgency} priority
                    </p>
                  </div>
                  <Badge variant={
                    request.status === 'confirmed' ? 'success' :
                    request.status === 'pending' ? 'secondary' :
                    request.status === 'completed' ? 'outline' : 'destructive'
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Form Dialog */}
      <Dialog open={showConsultationForm} onOpenChange={setShowConsultationForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Legal Consultation</DialogTitle>
            <DialogDescription>
              Please provide details about your consultation needs
            </DialogDescription>
          </DialogHeader>
          <ConsultationForm onSubmit={submitConsultationRequest} onCancel={() => setShowConsultationForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ConsultationForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    urgency: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Consultation Type</label>
        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select consultation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phone">Phone Consultation</SelectItem>
            <SelectItem value="video">Video Consultation</SelectItem>
            <SelectItem value="in_person">In-Person Meeting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Preferred Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Urgency</label>
        <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - General questions</SelectItem>
            <SelectItem value="medium">Medium - Important matter</SelectItem>
            <SelectItem value="high">High - Urgent legal issue</SelectItem>
            <SelectItem value="urgent">Urgent - Immediate danger</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Briefly describe your legal matter or questions"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Submit Request
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};