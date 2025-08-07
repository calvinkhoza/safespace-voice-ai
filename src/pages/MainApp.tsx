import { useState } from 'react';
import { SafeVoiceLayout } from '@/components/SafeVoiceLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ReportIncident } from '@/components/report/ReportIncident';
import { AIChat } from '@/components/chat/AIChat';
import { SafetyMap } from '@/components/map/SafetyMap';
import { EvidenceVault } from '@/components/evidence/EvidenceVault';
import { LegalAssistance } from '@/components/legal/LegalAssistance';
import { Resources } from '@/components/resources/Resources';
import { Community } from '@/components/community/Community';
import { Settings } from '@/components/settings/Settings';
import AIFeatures from '@/components/ai/AIFeatures';
import OfflineMode from '@/components/offline/OfflineMode';
import { Sidebar } from '@/components/Sidebar';

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'report':
        return <ReportIncident />;
      case 'chat':
        return <AIChat />;
      case 'map':
        return <SafetyMap />;
      case 'evidence':
        return <EvidenceVault />;
      case 'legal':
        return <LegalAssistance />;
      case 'resources':
        return <Resources />;
      case 'community':
        return <Community />;
      case 'ai-features':
        return <AIFeatures />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SafeVoiceLayout>
      <div className="flex h-full">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <OfflineMode />
    </SafeVoiceLayout>
  );
};