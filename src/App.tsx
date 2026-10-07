import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { IntroView } from './components/IntroView';
import { RhombusView } from './components/RhombusView';
import { SquareView } from './components/SquareView';
import { PracticeView } from './components/PracticeView';
import { LabView } from './components/LabView';
import { SummaryView } from './components/SummaryView';
import { AiVerificationModal, VoiceSettingsModal, CustomModal } from './components/Modals';
import { soundService } from './services/soundService';

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiClaimKey, setAiClaimKey] = useState<string>('chung');
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState<boolean>(false);
  const [customModal, setCustomModal] = useState<{ isOpen: boolean; title: string; msg: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sectionOrder = ['home', 'intro', 'rhombus', 'square', 'practice', 'lab', 'summary'];
  const currentIndex = sectionOrder.indexOf(currentSection);
  const progressPercent = Math.round((Math.max(0, currentIndex) / (sectionOrder.length - 1)) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiVerification = (claimKey: string) => {
    setAiClaimKey(claimKey);
    setAiModalOpen(true);
  };

  const handleOpenCustomModal = (title: string, msg: string) => {
    setCustomModal({ isOpen: true, title, msg });
  };

  const handleTestVoice = () => {
    soundService.playTeacherSection('teacher_test');
    showToast('Đang phát giọng thầy giáo Nam (Hà Nội, rõ ràng) 🎙️');
  };

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        showToast(`Không thể bật toàn màn hình: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation & Audio Control Bar */}
      <Header
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenVoiceSettings={() => setVoiceSettingsOpen(true)}
        onTestVoice={handleTestVoice}
        onOpenAiVerification={handleOpenAiVerification}
        onToggleFullScreen={handleToggleFullScreen}
        progressPercent={progressPercent}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-7 relative">
        {currentSection === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAiVerification={handleOpenAiVerification}
          />
        )}
        {currentSection === 'intro' && (
          <IntroView onNavigate={handleNavigate} />
        )}
        {currentSection === 'rhombus' && (
          <RhombusView
            onOpenAiVerification={handleOpenAiVerification}
            onOpenModal={handleOpenCustomModal}
          />
        )}
        {currentSection === 'square' && (
          <SquareView onOpenModal={handleOpenCustomModal} />
        )}
        {currentSection === 'practice' && (
          <PracticeView onOpenAiVerification={handleOpenAiVerification} />
        )}
        {currentSection === 'lab' && (
          <LabView />
        )}
        {currentSection === 'summary' && (
          <SummaryView onOpenModal={handleOpenCustomModal} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-800/80 bg-[#070c18] py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>📚 Toán 8 Kết nối tri thức với cuộc sống • Bài 14: Hình Thoi & Hình Vuông</span>
          <span className="text-amber-300 font-bold">🎙️ Thuyết minh: Thầy giáo Nam (Hà Nội, rõ ràng & dứt khoát)</span>
        </div>
      </footer>

      {/* Global Modals */}
      <AiVerificationModal
        isOpen={aiModalOpen}
        claimKey={aiClaimKey}
        onClose={() => setAiModalOpen(false)}
      />

      <VoiceSettingsModal
        isOpen={voiceSettingsOpen}
        onClose={() => setVoiceSettingsOpen(false)}
        onTestVoice={handleTestVoice}
      />

      {customModal && (
        <CustomModal
          isOpen={customModal.isOpen}
          title={customModal.title}
          msg={customModal.msg}
          onClose={() => setCustomModal(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0c1427] border-2 border-amber-500 text-amber-300 text-sm font-black px-6 py-3 rounded-2xl shadow-2xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
