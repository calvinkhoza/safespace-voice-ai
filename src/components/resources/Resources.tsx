import { useState, useEffect } from "react";
import { BookOpen, Phone, Download, ExternalLink, Play, Video, FileText, Heart, Users, Globe, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'video' | 'hotline' | 'app' | 'website' | 'course' | 'support_group';
  category: 'safety' | 'mental_health' | 'legal' | 'emergency' | 'education' | 'support';
  description: string;
  content?: string;
  url?: string;
  downloadUrl?: string;
  phone?: string;
  rating: number;
  language: string[];
  availability?: string;
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  provider: string;
  lastUpdated: Date;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  description: string;
  availability: string;
  type: 'emergency' | 'crisis' | 'support' | 'medical';
  languages: string[];
}

export const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('resources');
  
  const { t, currentLanguage } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Personal Safety Planning Guide',
        type: 'guide',
        category: 'safety',
        description: 'Comprehensive guide for creating personal safety plans, including emergency contacts and escape routes.',
        content: 'This guide helps you create a personalized safety plan that includes emergency contacts, safe locations, important documents, and steps to take in dangerous situations.',
        downloadUrl: '/resources/safety-planning-guide.pdf',
        rating: 4.8,
        language: ['en', 'af', 'zu', 'xh'],
        featured: true,
        difficulty: 'beginner',
        duration: '30 minutes',
        provider: 'SafeVoice AI',
        lastUpdated: new Date('2023-11-01')
      },
      {
        id: '2',
        title: 'Self-Defense Training Videos',
        type: 'video',
        category: 'safety',
        description: 'Professional self-defense training videos covering basic techniques for personal protection.',
        url: 'https://example.com/self-defense-videos',
        rating: 4.6,
        language: ['en', 'af'],
        featured: true,
        difficulty: 'beginner',
        duration: '2 hours',
        provider: 'Defense Academy SA',
        lastUpdated: new Date('2023-10-15')
      },
      {
        id: '3',
        title: 'Mental Health Support Course',
        type: 'course',
        category: 'mental_health',
        description: 'Online course covering trauma recovery, coping strategies, and building resilience.',
        url: 'https://example.com/mental-health-course',
        rating: 4.9,
        language: ['en', 'af', 'zu'],
        featured: false,
        difficulty: 'intermediate',
        duration: '6 weeks',
        provider: 'Mind Matters Institute',
        lastUpdated: new Date('2023-11-15')
      },
      {
        id: '4',
        title: 'Legal Rights Handbook',
        type: 'guide',
        category: 'legal',
        description: 'Complete handbook on legal rights for survivors of gender-based violence in South Africa.',
        downloadUrl: '/resources/legal-rights-handbook.pdf',
        rating: 4.7,
        language: ['en', 'af', 'zu', 'xh', 'st'],
        featured: true,
        difficulty: 'intermediate',
        duration: '1 hour',
        provider: 'Legal Aid SA',
        lastUpdated: new Date('2023-10-30')
      },
      {
        id: '5',
        title: 'Safety Apps Guide',
        type: 'guide',
        category: 'safety',
        description: 'Guide to the best safety apps available in South Africa, including features and setup instructions.',
        downloadUrl: '/resources/safety-apps-guide.pdf',
        rating: 4.5,
        language: ['en', 'af'],
        featured: false,
        difficulty: 'beginner',
        duration: '20 minutes',
        provider: 'Tech Safety Initiative',
        lastUpdated: new Date('2023-11-10')
      },
      {
        id: '6',
        title: 'Healing After Trauma Workshop',
        type: 'course',
        category: 'mental_health',
        description: 'Virtual workshop series focused on healing and recovery after traumatic experiences.',
        url: 'https://example.com/healing-workshop',
        rating: 4.8,
        language: ['en', 'af', 'zu'],
        featured: true,
        difficulty: 'intermediate',
        duration: '4 weeks',
        provider: 'Trauma Recovery Center',
        lastUpdated: new Date('2023-11-20')
      },
      {
        id: '7',
        title: 'Emergency Procedures Checklist',
        type: 'guide',
        category: 'emergency',
        description: 'Quick reference checklist for emergency situations, including what to do and who to contact.',
        downloadUrl: '/resources/emergency-checklist.pdf',
        rating: 4.9,
        language: ['en', 'af', 'zu', 'xh', 'st', 'tn'],
        featured: true,
        difficulty: 'beginner',
        duration: '10 minutes',
        provider: 'Emergency Response SA',
        lastUpdated: new Date('2023-11-25')
      },
      {
        id: '8',
        title: 'Digital Safety and Privacy',
        type: 'video',
        category: 'safety',
        description: 'Video series on protecting your digital privacy and staying safe online.',
        url: 'https://example.com/digital-safety',
        rating: 4.4,
        language: ['en', 'af'],
        featured: false,
        difficulty: 'intermediate',
        duration: '1.5 hours',
        provider: 'Cyber Safety SA',
        lastUpdated: new Date('2023-11-05')
      }
    ];

    const mockEmergencyContacts: EmergencyContact[] = [
      {
        id: '1',
        name: 'South African Police Service',
        phone: '10111',
        description: 'Emergency police services for immediate danger situations',
        availability: '24/7',
        type: 'emergency',
        languages: ['English', 'Afrikaans', 'All SA Languages']
      },
      {
        id: '2',
        name: 'GBV Command Centre',
        phone: '0800428428',
        description: 'National gender-based violence helpline providing crisis support and referrals',
        availability: '24/7',
        type: 'crisis',
        languages: ['English', 'Afrikaans', 'isiZulu', 'isiXhosa', 'Sesotho', 'Setswana']
      },
      {
        id: '3',
        name: 'Lifeline Crisis Support',
        phone: '0861322322',
        description: 'Crisis counseling and suicide prevention support',
        availability: '24/7',
        type: 'crisis',
        languages: ['English', 'Afrikaans']
      },
      {
        id: '4',
        name: 'Rape Crisis Cape Town',
        phone: '+27214479762',
        description: 'Specialized support for survivors of sexual violence',
        availability: '24/7 Crisis Line, Office: Mon-Fri 8:00-16:30',
        type: 'support',
        languages: ['English', 'Afrikaans', 'isiXhosa']
      },
      {
        id: '5',
        name: 'Emergency Medical Services',
        phone: '10177',
        description: 'Medical emergency services and ambulance dispatch',
        availability: '24/7',
        type: 'medical',
        languages: ['English', 'Afrikaans', 'All SA Languages']
      },
      {
        id: '6',
        name: 'SADAG Mental Health Helpline',
        phone: '0112344837',
        description: 'Mental health support and counseling referrals',
        availability: '8:00-20:00 daily',
        type: 'support',
        languages: ['English', 'Afrikaans']
      },
      {
        id: '7',
        name: 'ChildLine South Africa',
        phone: '116',
        description: 'Crisis support for children and teenagers',
        availability: '24/7',
        type: 'crisis',
        languages: ['English', 'Afrikaans', 'All SA Languages']
      },
      {
        id: '8',
        name: 'Stop Gender Violence Helpline',
        phone: '0800150150',
        description: 'Support and information for gender-based violence survivors',
        availability: '24/7',
        type: 'support',
        languages: ['English', 'Afrikaans', 'isiZulu', 'isiXhosa']
      }
    ];

    setResources(mockResources);
    setEmergencyContacts(mockEmergencyContacts);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLanguage = resource.language.includes(currentLanguage);
    
    return matchesSearch && matchesCategory && matchesType && matchesLanguage;
  });

  const featuredResources = resources.filter(r => r.featured && r.language.includes(currentLanguage));

  const downloadResource = (resource: Resource) => {
    toast({
      title: "Download started",
      description: `Downloading ${resource.title}`,
      variant: "default"
    });

    if (isVoiceEnabled) {
      speak(`Downloading ${resource.title}`);
    }
  };

  const openResource = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const callHotline = (contact: EmergencyContact) => {
    if (confirm(`Call ${contact.name} at ${contact.phone}?`)) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'hotline': return <Phone className="h-5 w-5" />;
      case 'app': return <Globe className="h-5 w-5" />;
      case 'website': return <ExternalLink className="h-5 w-5" />;
      case 'course': return <Users className="h-5 w-5" />;
      case 'support_group': return <Heart className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'destructive';
      case 'crisis': return 'warning';
      case 'support': return 'secondary';
      case 'medical': return 'success';
      default: return 'outline';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          {t('resources')}
        </h1>
        <p className="text-muted-foreground">
          Educational materials, support services, and helpful information
        </p>
      </div>

      {/* Emergency Hotlines */}
      <Card className="border-destructive/20 bg-gradient-emergency shadow-emergency">
        <CardHeader>
          <CardTitle className="text-destructive-foreground flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Hotlines
          </CardTitle>
          <CardDescription className="text-destructive-foreground/80">
            Immediate help available 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {emergencyContacts.slice(0, 4).map((contact) => (
              <Button
                key={contact.id}
                variant="secondary"
                className="h-16 flex-col gap-1 bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => callHotline(contact)}
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">{contact.name.split(' ')[0]}</span>
                <span className="text-xs">{contact.phone}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Educational Resources</TabsTrigger>
          <TabsTrigger value="hotlines">Hotlines & Support</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="guide">Guides</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="course">Courses</SelectItem>
                    <SelectItem value="app">Apps</SelectItem>
                    <SelectItem value="website">Websites</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid gap-6">
            {filteredResources.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredResources.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        {getTypeIcon(resource.type)}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{resource.title}</h3>
                            {resource.featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                            <Badge variant={getDifficultyColor(resource.difficulty) as any}>
                              {resource.difficulty}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{resource.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {resource.provider}</span>
                            {resource.duration && <span>Duration: {resource.duration}</span>}
                            <div className="flex items-center gap-1">
                              <span>{resource.rating}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-xs ${i < Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.language.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {resource.downloadUrl && (
                        <Button onClick={() => downloadResource(resource)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {resource.url && (
                        <Button variant="outline" onClick={() => openResource(resource)}>
                          {resource.type === 'video' ? (
                            <Play className="h-4 w-4 mr-2" />
                          ) : (
                            <ExternalLink className="h-4 w-4 mr-2" />
                          )}
                          {resource.type === 'video' ? 'Watch' : 'View'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="hotlines" className="space-y-6">
          <div className="grid gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <Badge variant={getContactTypeColor(contact.type) as any}>
                          {contact.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{contact.description}</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Availability:</strong> {contact.availability}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {contact.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-xl font-bold">{contact.phone}</p>
                      <Button onClick={() => callHotline(contact)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6">
            {featuredResources.map((resource) => (
              <Card key={resource.id} className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xl">{resource.title}</h3>
                        <Badge>Featured</Badge>
                      </div>
                      <p className="text-muted-foreground text-lg">{resource.description}</p>
                      {resource.content && (
                        <p className="text-sm">{resource.content}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>By {resource.provider}</span>
                        {resource.duration && <span>Duration: {resource.duration}</span>}
                        <div className="flex items-center gap-1">
                          <span>{resource.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor(resource.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {resource.downloadUrl && (
                          <Button onClick={() => downloadResource(resource)} size="lg">
                            <Download className="h-4 w-4 mr-2" />
                            Download Now
                          </Button>
                        )}
                        {resource.url && (
                          <Button variant="outline" onClick={() => openResource(resource)} size="lg">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Resource
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};