import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoice } from '@/contexts/VoiceContext';

interface USSDState {
  currentScreen: string;
  history: string[];
  userInput: string;
}

interface USSDScreen {
  title: string;
  content: string[];
  options: { [key: string]: string };
  actionRequired?: boolean;
}

export const OfflineMode: React.FC = () => {
  const { t } = useLanguage();
  const { speak } = useVoice();
  const [showModal, setShowModal] = useState(false);
  const [ussdState, setUssdState] = useState<USSDState>({
    currentScreen: 'main',
    history: [],
    userInput: ''
  });

  const ussdScreens: { [key: string]: USSDScreen } = {
    main: {
      title: "SafeVoice USSD",
      content: [
        "==================",
        "1. Emergency SOS 🚨",
        "2. Report Incident 📝",
        "3. Safety Resources 📚",
        "4. Legal Assistance ⚖️",
        "5. Trusted Contacts 👥",
        "6. Get Help Location 📍",
        "0. Exit System 🚪",
        "=================="
      ],
      options: {
        "1": "emergency",
        "2": "report",
        "3": "resources",
        "4": "legal",
        "5": "contacts",
        "6": "location",
        "0": "exit"
      }
    },
    emergency: {
      title: "🚨 EMERGENCY SOS 🚨",
      content: [
        "==================",
        "1. Call 911 Now 📞",
        "2. Silent Alarm 🔕",
        "3. Alert Contacts 📱",
        "4. Share Location 📍",
        "5. Police Assistance 👮",
        "6. Medical Emergency 🚑",
        "=================="
      ],
      options: {
        "1": "call911",
        "2": "silentAlarm",
        "3": "alertContacts",
        "4": "shareLocation",
        "5": "police",
        "6": "medical"
      },
      actionRequired: true
    },
    report: {
      title: "📝 REPORT INCIDENT",
      content: [
        "==================",
        "1. Harassment 😠",
        "2. Physical Assault 👊",
        "3. Sexual Assault ⚠️",
        "4. Stalking 👁️",
        "5. Cyber Crime 💻",
        "6. Other Incident 📋",
        "=================="
      ],
      options: {
        "1": "reportHarassment",
        "2": "reportAssault",
        "3": "reportSexualAssault",
        "4": "reportStalking",
        "5": "reportCyber",
        "6": "reportOther"
      }
    },
    resources: {
      title: "📚 SAFETY RESOURCES",
      content: [
        "==================",
        "1. Crisis Hotlines 📞",
        "2. Shelters & Housing 🏠",
        "3. Counseling Services 💭",
        "4. Safety Tips 💡",
        "5. Support Groups 👫",
        "6. Educational Material 📖",
        "=================="
      ],
      options: {
        "1": "hotlines",
        "2": "shelters",
        "3": "counseling",
        "4": "safetyTips",
        "5": "supportGroups",
        "6": "education"
      }
    },
    legal: {
      title: "⚖️ LEGAL ASSISTANCE",
      content: [
        "==================",
        "1. Legal Aid Services 📋",
        "2. Restraining Orders 🚫",
        "3. Court Support 🏛️",
        "4. Rights Information ℹ️",
        "5. Lawyer Referrals 👨‍⚖️",
        "6. Legal Documents 📄",
        "=================="
      ],
      options: {
        "1": "legalAid",
        "2": "restrainingOrder",
        "3": "courtSupport",
        "4": "rightsInfo",
        "5": "lawyerReferral",
        "6": "legalDocs"
      }
    },
    contacts: {
      title: "👥 TRUSTED CONTACTS",
      content: [
        "==================",
        "1. Add New Contact ➕",
        "2. View Contacts 👀",
        "3. Emergency Contacts 🚨",
        "4. Family Members 👨‍👩‍👧‍👦",
        "5. Professional Help 👩‍⚕️",
        "6. Quick Alert All 📢",
        "=================="
      ],
      options: {
        "1": "addContact",
        "2": "viewContacts",
        "3": "emergencyContacts",
        "4": "familyContacts",
        "5": "professionalContacts",
        "6": "alertAll"
      }
    },
    location: {
      title: "📍 GET HELP LOCATION",
      content: [
        "==================",
        "1. Nearest Police 👮",
        "2. Nearest Hospital 🏥",
        "3. Safe Locations 🏠",
        "4. Support Centers 🏢",
        "5. Share My Location 📤",
        "6. Navigation Help 🧭",
        "=================="
      ],
      options: {
        "1": "nearestPolice",
        "2": "nearestHospital",
        "3": "safeLocations",
        "4": "supportCenters",
        "5": "shareMyLocation",
        "6": "navigation"
      }
    }
  };

  const playKeySound = useCallback(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 400;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.05, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    }
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    playKeySound();
    
    if (key === 'back') {
      if (ussdState.history.length > 0) {
        const previousScreen = ussdState.history[ussdState.history.length - 1];
        setUssdState(prev => ({
          ...prev,
          currentScreen: previousScreen,
          history: prev.history.slice(0, -1)
        }));
      } else {
        setUssdState(prev => ({ ...prev, currentScreen: 'main' }));
      }
      return;
    }

    if (key === 'end') {
      setShowModal(false);
      setUssdState({
        currentScreen: 'main',
        history: [],
        userInput: ''
      });
      return;
    }

    if (key === 'call') {
      if (ussdState.currentScreen === 'emergency') {
        handleEmergencyAction('call911');
      }
      return;
    }

    const currentScreen = ussdScreens[ussdState.currentScreen];
    if (currentScreen && currentScreen.options[key]) {
      const nextScreen = currentScreen.options[key];
      
      if (nextScreen === 'exit') {
        setShowModal(false);
        setUssdState({
          currentScreen: 'main',
          history: [],
          userInput: ''
        });
        return;
      }

      // Handle action screens
      if (nextScreen.startsWith('call') || nextScreen.startsWith('report') || nextScreen.includes('Alert') || nextScreen.includes('hotlines')) {
        handleAction(nextScreen);
        return;
      }

      // Navigate to new screen
      if (ussdScreens[nextScreen]) {
        setUssdState(prev => ({
          ...prev,
          currentScreen: nextScreen,
          history: [...prev.history, prev.currentScreen]
        }));
      }
    }
  }, [ussdState, playKeySound]);

  const handleAction = useCallback((action: string) => {
    const actionResponses: { [key: string]: USSDScreen } = {
      call911: {
        title: "🚨 CALLING 911... 🚨",
        content: [
          "==================",
          "📞 Connecting...",
          "🌍 Location: Shared",
          `⏰ Time: ${new Date().toLocaleTimeString()}`,
          "",
          "Emergency services",
          "have been dispatched",
          "==================",
          "✅ HELP IS COMING"
        ],
        options: {}
      },
      silentAlarm: {
        title: "🔕 SILENT ALARM SENT",
        content: [
          "==================",
          "📤 Alert sent to:",
          "• Local Police 👮",
          "• Emergency Contacts 📱",
          "• SafeVoice Network 🌐",
          "• GPS Location Shared 📍",
          "==================",
          "✅ Stay calm. Help",
          "is on the way."
        ],
        options: {}
      },
      reportHarassment: {
        title: "📝 REPORTING: Harassment",
        content: [
          "==================",
          "📤 Submitting report...",
          `🆔 Case ID: SV${Math.floor(Math.random() * 100000)}`,
          "📍 Location: Recorded",
          `⏰ Time: ${new Date().toLocaleString()}`,
          "==================",
          "✅ Report submitted",
          "📧 Confirmation sent",
          "🔒 Information secured"
        ],
        options: {}
      },
      hotlines: {
        title: "📞 CRISIS HOTLINES",
        content: [
          "==================",
          "🆘 National: 116 123",
          "👩 Women's Line: 0800 150 150",
          "👶 Child Line: 116",
          "💊 Substance: 0861 435 787",
          "🏳️‍🌈 LGBTQ+: 021 422 0255",
          "==================",
          "All lines available 24/7"
        ],
        options: {}
      },
      shelters: {
        title: "🏠 SHELTERS & HOUSING",
        content: [
          "==================",
          "🏠 Johannesburg Shelter",
          "📞 011 123 4567",
          "🏠 Women's Safe House",
          "📞 011 987 6543",
          "🏠 Emergency Housing",
          "📞 011 555 0199",
          "==================",
          "Safe spaces available"
        ],
        options: {}
      }
    };

    const response = actionResponses[action];
    if (response) {
      // Show response for 3 seconds, then go back
      const tempScreen = `temp_${action}`;
      
      // Add temp screen to screens
      const newScreens = { ...ussdScreens };
      newScreens[tempScreen] = response;
      
      setUssdState(prev => ({
        ...prev,
        currentScreen: tempScreen,
        history: [...prev.history, prev.currentScreen]
      }));

      // Auto-navigate back after 3 seconds
      setTimeout(() => {
        setUssdState(prev => ({
          ...prev,
          currentScreen: prev.history[prev.history.length - 1] || 'main',
          history: prev.history.slice(0, -1)
        }));
      }, 3000);
    }
  }, []);

  const handleEmergencyAction = useCallback((action: string) => {
    speak(t("emergencyActivated"));
    handleAction(action);
  }, [speak, t, handleAction]);

  const renderUSSDScreen = () => {
    const screen = ussdScreens[ussdState.currentScreen] || ussdScreens.main;
    
    return (
      <div className="font-mono text-sm text-green-400 leading-relaxed">
        <p className="font-bold text-center text-cyan-400 mb-1">{screen.title}</p>
        {screen.content.map((line, index) => (
          <p key={index} className={`my-1 ${line === '==================' ? 'text-center' : ''} ${line.includes('✅') ? 'text-green-300' : ''}`}>
            {line}
          </p>
        ))}
        <p className="text-center mt-2 animate-pulse">
          {Object.keys(screen.options).length > 0 ? "Select option or BACK" : "Press BACK to continue"}
        </p>
      </div>
    );
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (showModal && e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [showModal, handleKeyPress]);

  return (
    <>
      {/* Offline Mode Trigger Button */}
      <Button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-6 py-3 rounded-full shadow-lg border-2 border-gray-600"
      >
        📱 {t("offlineMode")}
      </Button>

      {/* USSD Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 max-w-md w-full rounded-3xl shadow-2xl border-4 border-gray-600 p-8 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl drop-shadow-lg">
                📱 Basic Phone - SafeVoice
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold transition-all duration-200 hover:scale-110"
              >
                ×
              </button>
            </div>

            {/* Phone Body */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-4 shadow-inner border-2 border-gray-500">
              {/* Phone Screen */}
              <div className="bg-gradient-to-br from-green-900 to-black w-full h-48 rounded-lg p-4 mb-4 border-2 border-green-500 shadow-inner overflow-y-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-lg -z-10"></div>
                {renderUSSDScreen()}
              </div>

              {/* Phone Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { key: '1', label: '1' },
                  { key: '2', label: '2\nABC' },
                  { key: '3', label: '3\nDEF' },
                  { key: '4', label: '4\nGHI' },
                  { key: '5', label: '5\nJKL' },
                  { key: '6', label: '6\nMNO' },
                  { key: '7', label: '7\nPQRS' },
                  { key: '8', label: '8\nTUV' },
                  { key: '9', label: '9\nWXYZ' },
                  { key: '*', label: '*' },
                  { key: '0', label: '0\nSPACE' },
                  { key: '#', label: '#' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white h-12 rounded-lg font-bold transition-all duration-150 hover:scale-105 shadow-md border border-gray-500 text-xs whitespace-pre"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleKeyPress('call')}
                  className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  📞 CALL
                </button>
                <button
                  onClick={() => handleKeyPress('end')}
                  className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  📴 END
                </button>
                <button
                  onClick={() => handleKeyPress('back')}
                  className="bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  ⬅️ BACK
                </button>
              </div>
            </div>

            {/* Information Footer */}
            <p className="text-center mt-6 text-gray-300 text-sm">
              To access in real life, dial <strong className="text-green-400">*384*SOS#</strong> from any mobile phone
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineMode;