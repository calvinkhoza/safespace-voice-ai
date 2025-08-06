import { useState, useEffect } from "react";
import { Upload, FileText, Image, Video, Music, Download, Eye, Trash2, Lock, Share, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVoice } from "@/contexts/VoiceContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EvidenceFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  uploadDate: Date;
  reportId?: string;
  encrypted: boolean;
  shared: boolean;
  tags: string[];
  description: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  metadata: {
    location?: string;
    timestamp?: Date;
    deviceInfo?: string;
  };
}

export const EvidenceVault = () => {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [selectedFile, setSelectedFile] = useState<EvidenceFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const { t } = useLanguage();
  const { speak, isVoiceEnabled } = useVoice();
  const { toast } = useToast();

  useEffect(() => {
    // Load evidence files from localStorage
    const savedFiles = localStorage.getItem('safevoice_evidence');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      // Initialize with mock data
      initializeMockData();
    }
  }, []);

  const initializeMockData = () => {
    const mockFiles: EvidenceFile[] = [
      {
        id: '1',
        name: 'Screenshot_Evidence_001.png',
        type: 'image',
        size: 1024 * 1024 * 2.5, // 2.5MB
        uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        reportId: 'report-1',
        encrypted: true,
        shared: false,
        tags: ['harassment', 'text-messages'],
        description: 'Screenshots of threatening text messages',
        metadata: {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          deviceInfo: 'iPhone 12 Pro'
        }
      },
      {
        id: '2',
        name: 'Voice_Recording_20231201.mp3',
        type: 'audio',
        size: 1024 * 1024 * 8.2, // 8.2MB
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        reportId: 'report-2',
        encrypted: true,
        shared: true,
        tags: ['verbal-abuse', 'phone-call'],
        description: 'Recorded threatening phone call',
        metadata: {
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          deviceInfo: 'Android Samsung'
        }
      },
      {
        id: '3',
        name: 'Security_Camera_Footage.mp4',
        type: 'video',
        size: 1024 * 1024 * 45.6, // 45.6MB
        uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        encrypted: true,
        shared: false,
        tags: ['physical-assault', 'security-footage'],
        description: 'Security camera footage from incident location',
        metadata: {
          location: 'Main Street, Cape Town',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: '4',
        name: 'Medical_Report_Dr_Smith.pdf',
        type: 'document',
        size: 1024 * 512, // 512KB
        uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        reportId: 'report-1',
        encrypted: true,
        shared: true,
        tags: ['medical-evidence', 'injuries'],
        description: 'Medical examination report documenting injuries',
        metadata: {
          timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    setFiles(mockFiles);
    localStorage.setItem('safevoice_evidence', JSON.stringify(mockFiles));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    for (const file of selectedFiles) {
      // Validate file
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 100MB limit`,
          variant: "destructive"
        });
        continue;
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 200);

      // Create evidence file object
      const evidenceFile: EvidenceFile = {
        id: fileId,
        name: file.name,
        type: getFileType(file.type),
        size: file.size,
        uploadDate: new Date(),
        encrypted: true,
        shared: false,
        tags: [],
        description: '',
        metadata: {
          timestamp: new Date(),
          deviceInfo: navigator.userAgent
        }
      };

      // Add to files after "upload" completes
      setTimeout(() => {
        setFiles(prev => {
          const updated = [...prev, evidenceFile];
          localStorage.setItem('safevoice_evidence', JSON.stringify(updated));
          return updated;
        });
        
        setUploadProgress(prev => {
          const { [fileId]: removed, ...rest } = prev;
          return rest;
        });

        toast({
          title: "File uploaded",
          description: `${file.name} has been securely stored`,
          variant: "default"
        });
      }, 2000);
    }

    setIsUploading(false);
    
    if (isVoiceEnabled) {
      speak(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} uploaded successfully`);
    }
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'audio' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      case 'audio': return <Music className="h-8 w-8 text-green-500" />;
      case 'document': return <FileText className="h-8 w-8 text-orange-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      setFiles(prev => {
        const updated = prev.filter(f => f.id !== fileId);
        localStorage.setItem('safevoice_evidence', JSON.stringify(updated));
        return updated;
      });
      
      toast({
        title: "File deleted",
        description: "The file has been permanently removed",
        variant: "default"
      });
    }
  };

  const shareFile = (fileId: string) => {
    setFiles(prev => {
      const updated = prev.map(f => 
        f.id === fileId ? { ...f, shared: !f.shared } : f
      );
      localStorage.setItem('safevoice_evidence', JSON.stringify(updated));
      return updated;
    });

    const file = files.find(f => f.id === fileId);
    toast({
      title: file?.shared ? "File unshared" : "File shared",
      description: file?.shared ? 
        "File is no longer shared with authorities" : 
        "File has been shared with relevant authorities",
      variant: "default"
    });
  };

  const downloadFile = (file: EvidenceFile) => {
    // Simulate file download
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
      variant: "default"
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const encryptedFiles = files.filter(f => f.encrypted).length;
  const sharedFiles = files.filter(f => f.shared).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lock className="h-8 w-8 text-primary" />
          {t('evidence_vault')}
        </h1>
        <p className="text-muted-foreground">
          Securely store and manage evidence related to incidents
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encrypted</p>
                <p className="text-2xl font-bold">{encryptedFiles}</p>
              </div>
              <Lock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared</p>
                <p className="text-2xl font-bold">{sharedFiles}</p>
              </div>
              <Share className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Evidence
          </CardTitle>
          <CardDescription>
            Drag & drop files or click to browse. All files are automatically encrypted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop files here</h3>
            <p className="text-muted-foreground mb-4">
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
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* File Grid */}
      <Card>
        <CardHeader>
          <CardTitle>My Evidence Files</CardTitle>
          <CardDescription>
            {filteredFiles.length} of {files.length} files shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {files.length === 0 ? 'Upload your first evidence file to get started' : 'Try adjusting your search or filter'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      {getFileIcon(file.type)}
                      <div className="flex gap-1">
                        {file.encrypted && (
                          <Lock className="h-4 w-4 text-green-500" />
                        )}
                        {file.shared && (
                          <Share className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                    </p>
                    
                    {file.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {file.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{file.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{file.name}</DialogTitle>
                            <DialogDescription>
                              File details and metadata
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Type</p>
                                <p className="text-muted-foreground">{file.type}</p>
                              </div>
                              <div>
                                <p className="font-medium">Size</p>
                                <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                              <div>
                                <p className="font-medium">Uploaded</p>
                                <p className="text-muted-foreground">{file.uploadDate.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="font-medium">Status</p>
                                <div className="flex gap-1">
                                  {file.encrypted && <Badge variant="outline">Encrypted</Badge>}
                                  {file.shared && <Badge variant="outline">Shared</Badge>}
                                </div>
                              </div>
                            </div>
                            
                            {file.description && (
                              <div>
                                <p className="font-medium text-sm mb-1">Description</p>
                                <p className="text-sm text-muted-foreground">{file.description}</p>
                              </div>
                            )}
                            
                            {file.tags.length > 0 && (
                              <div>
                                <p className="font-medium text-sm mb-1">Tags</p>
                                <div className="flex flex-wrap gap-1">
                                  {file.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button onClick={() => downloadFile(file)} variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button onClick={() => shareFile(file.id)} variant="outline">
                                <Share className="h-4 w-4 mr-2" />
                                {file.shared ? 'Unshare' : 'Share'}
                              </Button>
                              <Button onClick={() => deleteFile(file.id)} variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => shareFile(file.id)}
                        className={cn(file.shared && "bg-blue-50 text-blue-600")}
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};