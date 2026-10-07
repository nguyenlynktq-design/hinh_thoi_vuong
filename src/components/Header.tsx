import React from 'react';
import { soundService, SpeechState } from '../services/soundService';

interface HeaderProps {
  currentSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenVoiceSettings: () => void;
  onTestVoice: () => void;
  onOpenAiVerification: (key: string) => void;
  onToggleFullScreen: () => void;
  progressPercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  onOpenVoiceSettings,
  onTestVoice,
  onOpenAiVerification,
  onToggleFullScreen,
  progressPercent,
}) => {
  const [speechState, setSpeechState] = React.useState<SpeechState>(soundService.state);
  const [sfxOn, setSfxOn] = React.useState<boolean>(soundService.isSfxEnabled());

  React.useEffect(() => {
    const unsub = soundService.subscribe(setSpeechState);
    return unsub;
  }, []);

  const handleToggleSpeech = () => {
    if (speechState.isPlaying) {
      soundService.stopSpeaking();
    } else {
      soundService.playTeacherSection(currentSection === 'home' ? 'home' : currentSection);
    }
  };

  const handleToggleSfx = () => {
    const next = !sfxOn;
    soundService.setSfxEnabled(next);
    setSfxOn(next);
    if (next) soundService.playPop();
  };

  const navItems = [
    { id: 'intro', label: '1. Gấp giấy' },
    { id: 'rhombus', label: '2. Hình thoi' },
    { id: 'square', label: '3. Hình vuông' },
    { id: 'practice', label: '4. Luyện tập (3 Mức độ)' },
    { id: 'lab', label: '5. Phòng Lab' },
    { id: 'summary', label: '6. Tổng kết' },
  ];

  return (
    <header className="bg-[#070c18]/95 backdrop-blur border-b border-slate-700/80 sticky top-0 z-50 px-4 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Title & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform border-2 border-amber-300">
              <svg className="w-7 h-7 text-amber-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" strokeLinejoin="round" />
                <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" />
                <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" />
              </svg>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-2 drop-shadow">
                <span>TOÁN 8 • KẾT NỐI TRI THỨC</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight">
                Bài 14: Hình Thoi & Hình Vuông
              </h1>
            </div>
          </button>
        </div>

        {/* Quick Section Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#111c38] p-1.5 rounded-xl text-sm font-bold text-slate-200 border border-slate-700">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-[#030712] font-black shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Badge Indicator */}
          <button
            onClick={onOpenVoiceSettings}
            title="Cài đặt và thử giọng đọc thầy giáo Orus"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070c18] hover:bg-slate-800 border border-amber-500/50 text-xs font-black text-amber-300 shadow transition cursor-pointer"
          >
            <span>🎙️</span>
            <span>Thầy giáo: Nam Orus (Rõ ràng & dứt khoát)</span>
            <span className="text-slate-400 text-[10px]">⚙️</span>
          </button>

          {/* Main TTS / Voice Button */}
          <button
            onClick={handleToggleSpeech}
            title="Nghe thuyết minh giáo viên (Giọng Nam Orus tải sẵn)"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold border-2 transition cursor-pointer shadow-md ${
              speechState.isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-sky-950/90 hover:bg-sky-900 text-sky-200 border-sky-500/60'
            }`}
          >
            <span className="text-base">{speechState.isPlaying ? '⏹' : '🔊'}</span>
            <span className="hidden sm:inline">
              {speechState.isPlaying ? 'Dừng đọc' : 'Giảng bài (Nam Orus)'}
            </span>
            {speechState.isPlaying && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Test Voice Quick Button */}
          <button
            onClick={onTestVoice}
            title="Nghe thử giọng thầy giáo Orus"
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-[#111c38] hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-extrabold transition cursor-pointer"
          >
            <span>🎧</span>
            <span>Thử giọng</span>
          </button>

          {/* Pause / Resume Button */}
          {speechState.isPlaying && (
            <button
              onClick={() => soundService.togglePause()}
              title={speechState.isPaused ? 'Tiếp tục nghe giảng' : 'Tạm dừng giọng đọc'}
              className="p-2.5 rounded-xl bg-[#111c38] hover:bg-slate-700 text-amber-300 border border-slate-700 text-base font-bold transition cursor-pointer"
            >
              {speechState.isPaused ? '▶' : '⏸'}
            </button>
          )}

          {/* Replay Button */}
          <button
            onClick={() => soundService.replayCurrent()}
            title="Nghe lại đoạn thuyết minh này"
            className="p-2.5 rounded-xl bg-[#111c38] hover:bg-slate-700 text-sky-300 border border-slate-700 text-base font-bold transition cursor-pointer"
          >
            🔁
          </button>

          {/* SFX Button */}
          <button
            onClick={handleToggleSfx}
            title="Hiệu ứng âm thanh tương tác"
            className="p-2.5 rounded-xl bg-[#111c38] hover:bg-slate-700 text-slate-200 border border-slate-700 text-base font-bold cursor-pointer"
          >
            {sfxOn ? '🔔' : '🔇'}
          </button>

          {/* Full Screen */}
          <button
            onClick={onToggleFullScreen}
            title="Toàn màn hình trình chiếu"
            className="p-2.5 rounded-xl bg-[#111c38] hover:bg-slate-700 text-slate-200 border border-slate-700 text-base font-bold cursor-pointer"
          >
            ⛶
          </button>

          {/* AI Verification Button */}
          <button
            onClick={() => onOpenAiVerification('chung')}
            title="Kiểm chứng phát biểu toán học với AI"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl badge-gold hover:opacity-95 font-black text-xs sm:text-sm shadow-lg transition cursor-pointer"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">KIỂM CHỨNG VỚI AI</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator Bar */}
      <div className="w-full bg-slate-800/80 h-1.5 mt-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </header>
  );
};
