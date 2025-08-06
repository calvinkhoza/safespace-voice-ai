import { useState, useEffect } from "react";
import { MapPin, Navigation, Shield, AlertTriangle, Phone, Plus, Route, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SafeLocation {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'safe_house' | 'counseling' | 'legal_aid' | 'community_center';
  address: string;
  coordinates: { lat: number; lng: number };
  distance: number;
  rating: number;
  isOpen: boolean;
  phone?: string;
  description: string;
  amenities: string[];
  reportedIncidents: number;
  safetyScore: number;
}

interface RiskArea {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentCount: number;
  lastIncident: Date;
  description: string;
}

export const SafetyMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([]);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const { t } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with mock data
    initializeMockData();
    getCurrentLocation();
  }, []);

  const initializeMockData = () => {
    const mockSafeLocations: SafeLocation[] = [
      {
        id: '1',
        name: 'Cape Town Central Hospital',
        type: 'hospital',
        address: '2 Groote Schuur Ave, Observatory, Cape Town',
        coordinates: { lat: -33.9249, lng: 18.4241 },
        distance: 0.5,
        rating: 4.8,
        isOpen: true,
        phone: '+27215041911',
        description: 'Major public hospital with 24/7 emergency services',
        amenities: ['Emergency Room', 'Trauma Unit', 'Mental Health Support'],
        reportedIncidents: 2,
        safetyScore: 95
      },
      {
        id: '2',
        name: 'Cape Town Central Police Station',
        type: 'police',
        address: '5 Caledon Square, Cape Town',
        coordinates: { lat: -33.9212, lng: 18.4193 },
        distance: 1.2,
        rating: 4.2,
        isOpen: true,
        phone: '+27214007000',
        description: 'Main police station with specialized units',
        amenities: ['24/7 Service', 'Family Violence Unit', 'Victim Support'],
        reportedIncidents: 0,
        safetyScore: 92
      },
      {
        id: '3',
        name: 'Women\'s Shelter Cape Town',
        type: 'safe_house',
        address: 'Confidential Location',
        coordinates: { lat: -33.9304, lng: 18.4298 },
        distance: 2.0,
        rating: 4.9,
        isOpen: true,
        phone: '+27214485080',
        description: 'Safe accommodation for women and children',
        amenities: ['24/7 Access', 'Counseling', 'Legal Support', 'Childcare'],
        reportedIncidents: 0,
        safetyScore: 98
      },
      {
        id: '4',
        name: 'Rape Crisis Centre',
        type: 'counseling',
        address: '17 Trill Rd, Observatory, Cape Town',
        coordinates: { lat: -33.9356, lng: 18.4734 },
        distance: 3.5,
        rating: 4.7,
        isOpen: true,
        phone: '+27214479762',
        description: 'Specialized support for survivors of sexual violence',
        amenities: ['Crisis Counseling', 'Court Support', 'Support Groups'],
        reportedIncidents: 0,
        safetyScore: 96
      },
      {
        id: '5',
        name: 'Legal Aid South Africa',
        type: 'legal_aid',
        address: '1st Floor, 32 Spin St, Cape Town',
        coordinates: { lat: -33.9258, lng: 18.4232 },
        distance: 1.8,
        rating: 4.1,
        isOpen: false,
        phone: '+27214268282',
        description: 'Free legal assistance for qualifying individuals',
        amenities: ['Legal Consultation', 'Court Representation', 'Document Assistance'],
        reportedIncidents: 1,
        safetyScore: 88
      }
    ];

    const mockRiskAreas: RiskArea[] = [
      {
        id: '1',
        name: 'Central Station Area',
        coordinates: { lat: -33.9175, lng: 18.4291 },
        riskLevel: 'high',
        incidentCount: 45,
        lastIncident: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description: 'High pedestrian traffic area with increased crime reports'
      },
      {
        id: '2',
        name: 'District Six',
        coordinates: { lat: -33.9321, lng: 18.4532 },
        riskLevel: 'medium',
        incidentCount: 23,
        lastIncident: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'Some isolated incidents reported in evening hours'
      },
      {
        id: '3',
        name: 'Foreshore Business District',
        coordinates: { lat: -33.9154, lng: 18.4198 },
        riskLevel: 'low',
        incidentCount: 8,
        lastIncident: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        description: 'Generally safe during business hours'
      }
    ];

    setSafeLocations(mockSafeLocations);
    setRiskAreas(mockRiskAreas);
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
          
          toast({
            title: "Location found",
            description: "Your current location has been updated",
            variant: "default"
          });
        },
        (error) => {
          setIsLoadingLocation(false);
          // Use Cape Town City Center as default
          setCurrentLocation({ lat: -33.9249, lng: 18.4241 });
          
          toast({
            title: "Using default location",
            description: "Unable to access your location. Using Cape Town City Center.",
            variant: "default"
          });
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findSafeRoute = () => {
    if (!currentLocation) {
      toast({
        title: "Location required",
        description: "Please enable location access to find safe routes",
        variant: "destructive"
      });
      return;
    }

    // Simulate route finding
    toast({
      title: "Safe route calculated",
      description: "Avoiding 2 high-risk areas. Route uses well-lit streets with security cameras.",
      variant: "default"
    });

    if (isVoiceEnabled) {
      speak("Safe route found. Avoiding high-risk areas and using well-lit paths.");
    }
  };

  const reportLocation = () => {
    toast({
      title: "Location report",
      description: "Thank you for reporting this location. Our team will review it.",
      variant: "default"
    });
  };

  const callEmergencyServices = () => {
    if (confirm("Call emergency services?")) {
      window.location.href = "tel:10111"; // South African police emergency number
    }
  };

  const filteredLocations = safeLocations.filter(location => {
    const matchesFilter = selectedFilter === 'all' || location.type === selectedFilter;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'police': return '🚔';
      case 'safe_house': return '🏠';
      case 'counseling': return '🧠';
      case 'legal_aid': return '⚖️';
      case 'community_center': return '🏢';
      default: return '📍';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          {t('safety_map')}
        </h1>
        <p className="text-muted-foreground">
          View safety information for your area and plan safe routes
        </p>
      </div>

      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Map Controls</CardTitle>
          <CardDescription>Find safe locations and plan your route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={findSafeRoute} className="flex-col h-16 gap-2">
              <Route className="h-5 w-5" />
              <span className="text-xs">Find Safe Route</span>
            </Button>
            <Button 
              onClick={getCurrentLocation} 
              variant="outline" 
              className="flex-col h-16 gap-2"
              disabled={isLoadingLocation}
            >
              <Navigation className="h-5 w-5" />
              <span className="text-xs">
                {isLoadingLocation ? 'Locating...' : 'Current Location'}
              </span>
            </Button>
            <Button onClick={reportLocation} variant="outline" className="flex-col h-16 gap-2">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Report Location</span>
            </Button>
            <Button onClick={callEmergencyServices} variant="destructive" className="flex-col h-16 gap-2">
              <Phone className="h-5 w-5" />
              <span className="text-xs">Emergency</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="h-16 w-16 mx-auto text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Interactive Safety Map</h3>
                  <p className="text-muted-foreground">
                    Real-time safety data for Cape Town
                  </p>
                </div>
                
                {/* Mock map elements */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Safe Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mock location markers */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            
            {currentLocation && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Find Safe Locations</CardTitle>
          <CardDescription>Search for nearby safety resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="hospital">Hospitals</SelectItem>
                <SelectItem value="police">Police Stations</SelectItem>
                <SelectItem value="safe_house">Safe Houses</SelectItem>
                <SelectItem value="counseling">Counseling Centers</SelectItem>
                <SelectItem value="legal_aid">Legal Aid</SelectItem>
                <SelectItem value="community_center">Community Centers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Safety Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Nearby Safety Resources
          </CardTitle>
          <CardDescription>
            {filteredLocations.length} locations found within 5km
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLocationIcon(location.type)}</span>
                      <h3 className="font-semibold">{location.name}</h3>
                      <Badge variant={location.isOpen ? "success" : "secondary"}>
                        {location.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                    <p className="text-sm">{location.description}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{location.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{location.distance}km away</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {location.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Safety: {location.safetyScore}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>{location.reportedIncidents} incidents</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {location.phone && (
                      <Button size="sm" variant="outline" onClick={() => window.location.href = `tel:${location.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button size="sm" onClick={() => {
                      toast({
                        title: "Directions",
                        description: `Getting directions to ${location.name}`,
                        variant: "default"
                      });
                    }}>
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Risk Areas
          </CardTitle>
          <CardDescription>
            Areas with reported safety concerns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskAreas.map((area) => (
              <div key={area.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getRiskLevelColor(area.riskLevel))}></div>
                    <h4 className="font-medium">{area.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {area.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {area.incidentCount} incidents • Last: {area.lastIncident.toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Route className="h-4 w-4 mr-1" />
                  Avoid
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Safe Locations</p>
                <p className="text-2xl font-bold text-green-600">{safeLocations.length}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Areas</p>
                <p className="text-2xl font-bold text-orange-600">{riskAreas.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Community Reports</p>
                <p className="text-2xl font-bold text-blue-600">156</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};