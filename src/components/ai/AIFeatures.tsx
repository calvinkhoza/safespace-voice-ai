import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';
import { Brain, Eye, Shield, TrendingUp, Mic, FileText, AlertTriangle, MapPin } from 'lucide-react';

interface RiskAnalysis {
  area: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
  recommendations: string[];
}

interface SentimentAnalysis {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  threatLevel: number;
  keywords: string[];
  requiresAction: boolean;
}

interface VoiceBiometric {
  userId: string;
  confidence: number;
  verified: boolean;
  timestamp: Date;
}

export const AIFeatures: React.FC = () => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [voiceBiometric, setVoiceBiometric] = useState<VoiceBiometric | null>(null);

  // Predictive Risk Analysis
  const analyzePredictiveRisk = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: RiskAnalysis[] = [
        {
          area: "Johannesburg CBD",
          riskLevel: "high",
          confidence: 0.87,
          factors: ["Increased incident reports", "Low lighting", "Isolated areas"],
          recommendations: ["Use buddy system", "Avoid after 8PM", "Stay in well-lit areas"]
        },
        {
          area: "Sandton Business District",
          riskLevel: "medium",
          confidence: 0.73,
          factors: ["Rush hour crowds", "Recent pickpocket incidents"],
          recommendations: ["Secure belongings", "Stay alert in crowds"]
        },
        {
          area: "Campus Area",
          riskLevel: "low",
          confidence: 0.92,
          factors: ["Good security presence", "Well-lit pathways"],
          recommendations: ["Continue current safety practices"]
        }
      ];
      
      setRiskAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      speak(t("riskAnalysisComplete"));
    }, 2000);
  }, [speak, t]);

  // Sentiment Analysis for Community Chat
  const analyzeSentiment = useCallback((text: string) => {
    const urgentKeywords = ['help', 'emergency', 'danger', 'scared', 'threat', 'abuse'];
    const negativeKeywords = ['sad', 'depressed', 'hopeless', 'alone', 'afraid'];
    
    const hasUrgentKeywords = urgentKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    const hasNegativeKeywords = negativeKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    let sentiment: SentimentAnalysis['sentiment'] = 'neutral';
    let threatLevel = 0;
    let requiresAction = false;

    if (hasUrgentKeywords) {
      sentiment = 'urgent';
      threatLevel = 0.8;
      requiresAction = true;
    } else if (hasNegativeKeywords) {
      sentiment = 'negative';
      threatLevel = 0.4;
      requiresAction = true;
    }

    const analysis: SentimentAnalysis = {
      text: text.substring(0, 50) + '...',
      sentiment,
      threatLevel,
      keywords: [...urgentKeywords, ...negativeKeywords].filter(keyword => 
        text.toLowerCase().includes(keyword)
      ),
      requiresAction
    };

    setSentimentData(prev => [analysis, ...prev.slice(0, 4)]);
    
    if (requiresAction) {
      speak(t("urgentMessageDetected"));
    }
  }, [speak, t]);

  // Voice Biometric Verification
  const performVoiceBiometric = useCallback(async () => {
    // Simulate voice biometric analysis
    const mockBiometric: VoiceBiometric = {
      userId: "user_12345",
      confidence: 0.94,
      verified: Math.random() > 0.1, // 90% success rate
      timestamp: new Date()
    };

    setVoiceBiometric(mockBiometric);
    
    if (mockBiometric.verified) {
      speak(t("voiceBiometricVerified"));
    } else {
      speak(t("voiceBiometricFailed"));
    }
  }, [speak, t]);

  // Smart Evidence Processing
  const processEvidence = useCallback((file: File) => {
    const fileType = file.type.split('/')[0];
    
    // Simulate AI processing
    setTimeout(() => {
      let analysis = "";
      
      switch (fileType) {
        case 'image':
          analysis = "Image analyzed: Potential signs of physical distress detected. Metadata extracted: Location, timestamp preserved.";
          break;
        case 'audio':
          analysis = "Audio analyzed: Elevated stress patterns detected. Voice identification completed. Transcript generated.";
          break;
        case 'video':
          analysis = "Video analyzed: Scene context identified. Facial recognition completed. Evidence timeline established.";
          break;
        default:
          analysis = "Document analyzed: Text extraction completed. Sensitive information redacted for privacy.";
      }
      
      speak(t("evidenceProcessingComplete"));
      
      // Create analysis report
      const report = {
        filename: file.name,
        analysis,
        confidence: 0.86,
        tags: ['verified', 'processed', 'secure'],
        timestamp: new Date()
      };
      
      console.log('Evidence Analysis Report:', report);
    }, 3000);
  }, [speak, t]);

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'urgent': return 'destructive';
      case 'negative': return 'warning';
      case 'positive': return 'success';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    // Initialize AI features
    analyzePredictiveRisk();
  }, [analyzePredictiveRisk]);

  return (
    <div className="space-y-6">
      {/* AI Dashboard Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Safety Intelligence
          </CardTitle>
          <CardDescription>
            Advanced AI features for enhanced safety and security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={analyzePredictiveRisk} disabled={isAnalyzing} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Risk Analysis"}
            </Button>
            <Button onClick={performVoiceBiometric} className="w-full">
              <Mic className="h-4 w-4 mr-2" />
              Voice Biometric
            </Button>
            <Button onClick={() => analyzeSentiment("I need help urgently, feeling scared")} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Test Sentiment AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            Predictive Risk Analysis
          </CardTitle>
          <CardDescription>
            AI-powered risk assessment for different areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="space-y-4">
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground">Analyzing incident patterns and community data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {riskAnalysis.map((analysis, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{analysis.area}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRiskBadgeVariant(analysis.riskLevel)}>
                        {analysis.riskLevel.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(analysis.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-sm font-medium">Risk Factors:</h5>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {analysis.factors.map((factor, i) => (
                          <li key={i}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">AI Recommendations:</h5>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentiment & Threat Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            AI Sentiment & Threat Detection
          </CardTitle>
          <CardDescription>
            Real-time analysis of community communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentimentData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent messages analyzed</p>
            ) : (
              sentimentData.map((data, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Message Analysis</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSentimentBadgeVariant(data.sentiment)}>
                        {data.sentiment}
                      </Badge>
                      {data.requiresAction && (
                        <Badge variant="destructive">Action Required</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">"{data.text}"</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Threat Level: {Math.round(data.threatLevel * 100)}%</span>
                    {data.keywords.length > 0 && (
                      <span>Keywords: {data.keywords.join(', ')}</span>
                    )}
                  </div>
                  {data.requiresAction && (
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This message requires immediate attention from moderators or support staff.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Voice Biometric Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Voice Biometric Security
          </CardTitle>
          <CardDescription>
            AI-powered voice verification for secure access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {voiceBiometric ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Verification Status:</span>
                <Badge variant={voiceBiometric.verified ? "success" : "destructive"}>
                  {voiceBiometric.verified ? "VERIFIED" : "FAILED"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">User ID:</span>
                  <p className="font-mono">{voiceBiometric.userId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <p>{Math.round(voiceBiometric.confidence * 100)}%</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last verified: {voiceBiometric.timestamp.toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click "Voice Biometric" above to perform voice verification
            </p>
          )}
        </CardContent>
      </Card>

      {/* Smart Evidence Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Smart Evidence Processing
          </CardTitle>
          <CardDescription>
            AI-powered analysis and categorization of evidence files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="evidenceUpload"
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processEvidence(file);
                  }
                }}
              />
              <label htmlFor="evidenceUpload" className="cursor-pointer">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Upload file for AI analysis (Image, Video, Audio, Document)
                </p>
              </label>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>AI will automatically:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Analyze and categorize content</li>
                <li>Extract metadata and timestamps</li>
                <li>Detect signs of violence or distress</li>
                <li>Generate secure summary reports</li>
                <li>Apply privacy-preserving encryption</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeatures;