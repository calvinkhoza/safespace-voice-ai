import { useState, useEffect } from "react";
import { Users, MessageCircle, Calendar, MapPin, Heart, Share2, Plus, Star, Clock, Eye, MessageSquare, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  type: 'online' | 'in_person' | 'hybrid';
  category: 'general' | 'survivors' | 'families' | 'teens' | 'support_workers';
  schedule: string;
  maxMembers: number;
  currentMembers: number;
  facilitator: string;
  isPrivate: boolean;
  languages: string[];
  nextMeeting?: Date;
  location?: string;
  joinCode?: string;
}

interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'story' | 'question' | 'resource' | 'announcement';
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  isAnonymous: boolean;
  supportOffered?: string;
  supportNeeded?: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'support_meeting' | 'awareness' | 'training';
  date: Date;
  duration: string;
  location: string;
  organizer: string;
  maxAttendees: number;
  currentAttendees: number;
  isVirtual: boolean;
  tags: string[];
  cost: number;
}

export const Community = () => {
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>([]);
  const [activeTab, setActiveTab] = useState('groups');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<string>('story');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { t } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockSupportGroups: SupportGroup[] = [
      {
        id: '1',
        name: 'Survivors Support Circle',
        description: 'Safe space for survivors to share experiences and support each other through healing',
        type: 'online',
        category: 'survivors',
        schedule: 'Every Thursday, 7:00 PM - 8:30 PM',
        maxMembers: 20,
        currentMembers: 14,
        facilitator: 'Dr. Sarah Miller, Licensed Therapist',
        isPrivate: true,
        languages: ['English', 'Afrikaans'],
        nextMeeting: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        joinCode: 'SUPPORT2023'
      },
      {
        id: '2',
        name: 'Family & Friends Support',
        description: 'Support group for family members and friends of survivors',
        type: 'hybrid',
        category: 'families',
        schedule: 'Bi-weekly Saturdays, 2:00 PM - 3:30 PM',
        maxMembers: 25,
        currentMembers: 18,
        facilitator: 'James Thompson, Social Worker',
        isPrivate: false,
        languages: ['English', 'Afrikaans', 'isiXhosa'],
        nextMeeting: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'Community Center, Woodstock'
      },
      {
        id: '3',
        name: 'Teen Support Network',
        description: 'Peer support group for teenage survivors and those affected by violence',
        type: 'online',
        category: 'teens',
        schedule: 'Wednesdays, 4:00 PM - 5:00 PM',
        maxMembers: 15,
        currentMembers: 12,
        facilitator: 'Alex Johnson, Youth Counselor',
        isPrivate: true,
        languages: ['English', 'isiZulu'],
        nextMeeting: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        joinCode: 'YOUTH2023'
      },
      {
        id: '4',
        name: 'Healing Through Art',
        description: 'Creative expression and art therapy group for emotional healing',
        type: 'in_person',
        category: 'general',
        schedule: 'Sundays, 10:00 AM - 12:00 PM',
        maxMembers: 12,
        currentMembers: 8,
        facilitator: 'Maria Santos, Art Therapist',
        isPrivate: false,
        languages: ['English', 'Afrikaans'],
        nextMeeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: 'Art Studio, Observatory'
      }
    ];

    const mockCommunityPosts: CommunityPost[] = [
      {
        id: '1',
        authorId: 'user1',
        authorName: 'Anonymous',
        content: 'Today marks 6 months since I started my healing journey. To anyone struggling right now - it does get easier. Take it one day at a time. You are stronger than you know. 💪❤️',
        type: 'story',
        tags: ['healing', 'hope', 'strength'],
        likes: 34,
        comments: 12,
        shares: 8,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isAnonymous: true,
        supportOffered: 'Emotional support, someone to talk to'
      },
      {
        id: '2',
        authorId: 'user2',
        authorName: 'Community Helper',
        content: 'Does anyone know of good therapists in the Cape Town area who specialize in trauma? Looking for recommendations for a friend. Please DM me if you have suggestions.',
        type: 'question',
        tags: ['therapy', 'cape-town', 'trauma'],
        likes: 15,
        comments: 23,
        shares: 5,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isAnonymous: false,
        supportNeeded: 'Therapist recommendations'
      },
      {
        id: '3',
        authorId: 'user3',
        authorName: 'Resource Sharer',
        content: 'Found this amazing self-care app that has really helped me with anxiety and sleep. It\'s called Calm and they have a free version. Thought others might benefit too! 🌙',
        type: 'resource',
        tags: ['self-care', 'mental-health', 'apps'],
        likes: 28,
        comments: 7,
        shares: 15,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isAnonymous: false
      },
      {
        id: '4',
        authorId: 'admin',
        authorName: 'Community Admin',
        content: 'Reminder: Our monthly community workshop on "Building Resilience" is this Saturday at 2 PM. We still have a few spots available. Register using the link in our events section.',
        type: 'announcement',
        tags: ['workshop', 'resilience', 'community'],
        likes: 42,
        comments: 18,
        shares: 20,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isAnonymous: false
      }
    ];

    const mockCommunityEvents: CommunityEvent[] = [
      {
        id: '1',
        title: 'Building Resilience Workshop',
        description: 'Interactive workshop focused on developing emotional resilience and coping strategies',
        type: 'workshop',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        duration: '3 hours',
        location: 'Community Center, Salt River',
        organizer: 'Resilience Foundation',
        maxAttendees: 30,
        currentAttendees: 22,
        isVirtual: false,
        tags: ['resilience', 'workshop', 'coping'],
        cost: 0
      },
      {
        id: '2',
        title: 'Virtual Healing Circle',
        description: 'Monthly virtual gathering for sharing experiences and mutual support',
        type: 'support_meeting',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        duration: '2 hours',
        location: 'Online (Zoom)',
        organizer: 'Healing Together Group',
        maxAttendees: 25,
        currentAttendees: 18,
        isVirtual: true,
        tags: ['healing', 'support', 'virtual'],
        cost: 0
      },
      {
        id: '3',
        title: 'Self-Defense Training',
        description: 'Basic self-defense techniques and personal safety training for women',
        type: 'training',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: '4 hours',
        location: 'Martial Arts Studio, Rondebosch',
        organizer: 'Women\'s Safety Initiative',
        maxAttendees: 20,
        currentAttendees: 15,
        isVirtual: false,
        tags: ['self-defense', 'safety', 'training'],
        cost: 50
      },
      {
        id: '4',
        title: '16 Days of Activism Campaign',
        description: 'Community awareness event to support the global campaign against gender-based violence',
        type: 'awareness',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        duration: '6 hours',
        location: 'Green Point Park',
        organizer: 'United Against Violence',
        maxAttendees: 200,
        currentAttendees: 145,
        isVirtual: false,
        tags: ['awareness', 'activism', 'community'],
        cost: 0
      }
    ];

    setSupportGroups(mockSupportGroups);
    setCommunityPosts(mockCommunityPosts);
    setCommunityEvents(mockCommunityEvents);
  };

  const joinGroup = (groupId: string) => {
    const group = supportGroups.find(g => g.id === groupId);
    if (group) {
      if (group.currentMembers >= group.maxMembers) {
        toast({
          title: "Group full",
          description: "This support group is currently at capacity",
          variant: "destructive"
        });
        return;
      }

      setSupportGroups(prev => prev.map(g => 
        g.id === groupId ? { ...g, currentMembers: g.currentMembers + 1 } : g
      ));

      toast({
        title: "Joined group",
        description: `You've successfully joined ${group.name}`,
        variant: "default"
      });

      if (isVoiceEnabled) {
        speak(`You have joined the ${group.name} support group`);
      }
    }
  };

  const attendEvent = (eventId: string) => {
    const event = communityEvents.find(e => e.id === eventId);
    if (event) {
      if (event.currentAttendees >= event.maxAttendees) {
        toast({
          title: "Event full",
          description: "This event is currently at capacity",
          variant: "destructive"
        });
        return;
      }

      setCommunityEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, currentAttendees: e.currentAttendees + 1 } : e
      ));

      toast({
        title: "Event registered",
        description: `You've registered for ${event.title}`,
        variant: "default"
      });
    }
  };

  const createPost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "Empty post",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: user?.id || 'current-user',
      authorName: isAnonymous ? 'Anonymous' : user?.name || 'Community Member',
      content: newPostContent,
      type: newPostType as any,
      tags: [],
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      isAnonymous: isAnonymous
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    
    toast({
      title: "Post created",
      description: "Your post has been shared with the community",
      variant: "default"
    });
  };

  const likePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <Heart className="h-4 w-4" />;
      case 'question': return <MessageCircle className="h-4 w-4" />;
      case 'resource': return <Share2 className="h-4 w-4" />;
      case 'announcement': return <Bookmark className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'secondary';
      case 'support_meeting': return 'success';
      case 'awareness': return 'warning';
      case 'training': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          {t('community')}
        </h1>
        <p className="text-muted-foreground">
          Connect with support groups and community resources
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Support Groups</p>
                <p className="text-2xl font-bold">{supportGroups.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{supportGroups.reduce((sum, group) => sum + group.currentMembers, 0)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">{communityEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Community Posts</p>
                <p className="text-2xl font-bold">{communityPosts.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="community">Community Feed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid gap-4">
            {supportGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <Badge variant={group.type === 'online' ? 'default' : group.type === 'in_person' ? 'secondary' : 'outline'}>
                            {group.type.replace('_', ' ')}
                          </Badge>
                          {group.isPrivate && (
                            <Badge variant="outline">Private</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{group.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>👥 {group.currentMembers}/{group.maxMembers} members</span>
                          <span>🕒 {group.schedule}</span>
                          <span>👨‍⚕️ {group.facilitator}</span>
                        </div>
                        {group.nextMeeting && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>Next meeting: {group.nextMeeting.toLocaleDateString()} at {group.nextMeeting.toLocaleTimeString()}</span>
                          </div>
                        )}
                        {group.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{group.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => joinGroup(group.id)} disabled={group.currentMembers >= group.maxMembers}>
                        <Users className="h-4 w-4 mr-2" />
                        {group.currentMembers >= group.maxMembers ? 'Full' : 'Join Group'}
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {post.isAnonymous ? 'A' : post.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.authorName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getPostTypeIcon(post.type)}
                            <span>{post.type}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{post.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm">{post.content}</p>

                    {post.supportOffered && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Support Offered:</p>
                        <p className="text-sm text-green-700">{post.supportOffered}</p>
                      </div>
                    )}

                    {post.supportNeeded && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Support Needed:</p>
                        <p className="text-sm text-blue-700">{post.supportNeeded}</p>
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                      <Button variant="ghost" size="sm" onClick={() => likePost(post.id)}>
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-4">
            {communityEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge variant={getEventTypeColor(event.type) as any}>
                            {event.type.replace('_', ' ')}
                          </Badge>
                          {event.isVirtual && (
                            <Badge variant="outline">Virtual</Badge>
                          )}
                          {event.cost === 0 && (
                            <Badge variant="secondary">Free</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{event.currentAttendees}/{event.maxAttendees} attending</span>
                          </div>
                        </div>
                        <p className="text-sm">Organized by: {event.organizer}</p>
                      </div>
                      <div className="text-right">
                        {event.cost > 0 && (
                          <p className="text-lg font-bold">R{event.cost}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => attendEvent(event.id)} disabled={event.currentAttendees >= event.maxAttendees}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.currentAttendees >= event.maxAttendees ? 'Event Full' : 'Register'}
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <CardDescription>
                Share your story, ask questions, or offer support to fellow community members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Type</label>
                <Select value={newPostType} onValueChange={setNewPostType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="story">Share Story</SelectItem>
                    <SelectItem value="question">Ask Question</SelectItem>
                    <SelectItem value="resource">Share Resource</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or questions with the community..."
                  className="min-h-32"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label htmlFor="anonymous" className="text-sm">
                  Post anonymously
                </label>
              </div>

              <Button onClick={createPost} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Share Post
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};