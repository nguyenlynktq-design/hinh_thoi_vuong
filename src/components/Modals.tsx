import React from 'react';
import { soundService } from '../services/soundService';

export interface AiClaim {
  id: string;
  claim: string;
  isTrue: boolean;
  correctText: string;
}

export const AI_CLAIMS: Record<string, AiClaim> = {
  chung: {
    id: 'chung',
    claim: 'Tứ giác có hai đường chéo vuông góc chắc chắn luôn luôn là một hình thoi.',
    isTrue: false,
    correctText: 'Phản ví dụ: Hình con diều hoặc tứ giác có 2 đường chéo vuông góc nhưng không cắt nhau tại trung điểm.\nPhát biểu đúng: Hình bình hành có 2 đường chéo vuông góc mới là hình thoi.'
  },
  thm1_perp: {
    id: 'thm1_perp',
    claim: 'Mọi tứ giác có hai đường chéo vuông góc và cắt nhau tại trung điểm đều là hình vuông.',
    isTrue: false,
    correctText: 'Phản ví dụ: Hình thoi có 2 đường chéo vuông góc tại trung điểm nhưng 2 đường chéo có độ dài KHÁC NHAU thì không phải hình vuông!\nPhát biểu đúng: Phải có thêm điều kiện hai đường chéo bằng nhau thì mới là hình vuông.'
  },
  intro_sample: {
    id: 'intro_sample',
    claim: 'Khi mở tờ giấy gấp cắt góc vuông ra, ta luôn luôn nhận được một hình vuông dù cắt ở bất kì vị trí nào.',
    isTrue: false,
    correctText: 'Phản ví dụ: Nếu OA ≠ OB thì hai đường chéo có độ dài khác nhau, hình nhận được chỉ là HÌNH THOI chứ không phải hình vuông.'
  },
  practice_ai: {
    id: 'practice_ai',
    claim: 'Hình chữ nhật có 1 góc vuông là hình vuông.',
    isTrue: false,
    correctText: 'Sai ngụy biện: Mọi hình chữ nhật đã mặc định có sẵn 4 góc vuông rồi! Phải là: Hình thoi có 1 góc vuông mới biến thành hình vuông.'
  },
  ex333_ai: {
    id: 'ex333_ai',
    claim: 'Trong bài 3.33, vì chu vi là 36 nên chắc chắn chiều dài bằng 10 cm và chiều rộng bằng 8 cm.',
    isTrue: false,
    correctText: 'Sai: Vì MA ⟂ MD và M là trung điểm BC nên tam giác AMD vuông cân tại M, kéo theo chiều dài gấp đôi chiều rộng (tỉ lệ 2 : 1). Đáp số chuẩn xác phải là 12 cm và 6 cm.'
  }
};

export const AiVerificationModal: React.FC<{
  isOpen: boolean;
  claimKey: string;
  onClose: () => void;
}> = ({ isOpen, claimKey, onClose }) => {
  const [userChoice, setUserChoice] = React.useState<boolean | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [showCorrection, setShowCorrection] = React.useState(false);

  React.useEffect(() => {
    setUserChoice(null);
    setFeedback(null);
    setShowCorrection(false);
  }, [claimKey, isOpen]);

  if (!isOpen) return null;

  const claim = AI_CLAIMS[claimKey] || AI_CLAIMS['chung'];

  const handleChoice = (choice: boolean) => {
    setUserChoice(choice);
    setShowCorrection(true);
    if (choice === claim.isTrue) {
      soundService.playSuccess();
      setFeedback('🎉 XUẤT SẮC! Em đã phát hiện chính xác lỗ hổng lập luận của AI. Em có tư duy phản biện toán học rất sắc bén!');
    } else {
      soundService.playIncorrect();
      setFeedback('⚠️ Chưa đúng rồi! AI đã đưa ra một khẳng định ngụy biện thiếu điều kiện toán học. Hãy xem phân tích phản ví dụ bên dưới:');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#030712]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-500/50 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl badge-gold flex items-center justify-center font-black text-base">🤖</div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">Kiểm Chứng Khẳng Định Với AI</h3>
              <span className="text-xs text-amber-300 font-bold">Rèn luyện tư duy phản biện & Năng lực số</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer">✕</button>
        </div>

        <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>AI NÓI:</span>
          </div>
          <blockquote className="text-sm sm:text-base font-black text-amber-300 italic border-l-4 border-amber-500 pl-3 leading-relaxed">
            "{claim.claim}"
          </blockquote>
        </div>

        <div className="space-y-3 text-sm">
          <span className="font-bold text-slate-200">1. Theo em, khẳng định của AI là:</span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChoice(true)}
              className={`p-3 rounded-xl border-2 font-black text-base transition cursor-pointer ${
                userChoice === true ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 bg-[#070c18] hover:bg-slate-800 text-slate-200'
              }`}
            >
              ✅ ĐÚNG
            </button>
            <button
              onClick={() => handleChoice(false)}
              className={`p-3 rounded-xl border-2 font-black text-base transition cursor-pointer ${
                userChoice === false ? 'border-amber-400 bg-amber-500/20 text-amber-200' : 'border-slate-700 bg-[#070c18] hover:bg-slate-800 text-slate-200'
              }`}
            >
              ❌ SAI
            </button>
          </div>

          {feedback && (
            <div className={`p-3.5 rounded-xl text-sm font-bold leading-relaxed ${
              userChoice === claim.isTrue ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
            }`}>
              {feedback}
            </div>
          )}

          {showCorrection && (
            <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 space-y-2 text-sm text-slate-200 font-medium">
              <strong className="text-amber-300 font-black block">💡 PHẢN VÍ DỤ & CÁCH SỬA ĐÚNG:</strong>
              <div className="whitespace-pre-line leading-relaxed text-slate-200">
                {claim.correctText}
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-xs sm:text-sm text-amber-200 font-medium leading-relaxed">
          ⚠️ <strong>NGUYÊN TẮC VÀNG:</strong> <em>Không sử dụng AI thay cho chứng minh toán học.</em> Chỉ lập luận logic và hệ thống định lí mới là thước đo chân lý!
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-extrabold transition cursor-pointer"
          >
            Đóng hộp thoại
          </button>
        </div>
      </div>
    </div>
  );
};

export const VoiceSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTestVoice: () => void;
}> = ({ isOpen, onClose, onTestVoice }) => {
  const [rate, setRate] = React.useState(soundService.state.playbackRate);
  const [usePreloaded, setUsePreloaded] = React.useState(soundService.state.usePreloadedAudio);

  if (!isOpen) return null;

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    soundService.setPlaybackRate(newRate);
  };

  const handleTogglePreloaded = (val: boolean) => {
    setUsePreloaded(val);
    soundService.setUsePreloadedAudio(val);
  };

  return (
    <div className="fixed inset-0 bg-[#030712]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-500/50 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-lg border border-amber-400/40">🎙️</div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">Giọng Thuyết Minh Giáo Viên</h3>
              <span className="text-xs text-amber-300 font-bold">Thầy giáo: Nam (Hà Nội, rõ ràng & dứt khoát)</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        <div className="space-y-3.5 text-sm">
          <p className="text-slate-200 leading-relaxed font-medium">
            Hệ thống bài giảng đã được <strong className="text-amber-300 font-bold">tải sẵn trọn bộ âm thanh MP3</strong> giọng thầy giáo miền Bắc (Hà Nội) rõ ràng, đĩnh đạc và rành mạch từng định lí, bài tập hình học.
          </p>

          <div className="p-3 bg-[#070c18] rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Nguồn phát âm thanh:</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {usePreloaded ? 'Tải sẵn (Offline)' : 'Web Speech API'}
              </span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleTogglePreloaded(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  usePreloaded ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ⭐ Âm thanh tải sẵn (Khuyên dùng)
              </button>
              <button
                onClick={() => handleTogglePreloaded(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  !usePreloaded ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
                }`}
              >
                TTS Thiết bị
              </button>
            </div>
            <div className="text-xs text-emerald-400 font-medium pt-1">
              ✓ Đã sẵn sàng tất cả bài giảng từ Tab 1 đến Tab 6 trong app, hoạt động mượt mà không cần mạng.
            </div>
          </div>

          <div className="p-3 bg-[#070c18] rounded-xl border border-slate-700 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Tốc độ đọc của thầy giáo:</span>
              <span className="text-amber-300 font-mono font-bold">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <button onClick={() => handleRateChange(0.8)} className="hover:text-amber-300">0.8x Chậm</button>
              <button onClick={() => handleRateChange(1.0)} className="hover:text-amber-300">1.0x Chuẩn</button>
              <button onClick={() => handleRateChange(1.15)} className="hover:text-amber-300">1.15x Nhanh</button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onTestVoice}
              className="flex-1 py-3 px-4 rounded-xl gold-btn text-night-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>🔊</span>
              <span>Nghe thử giọng thầy giáo</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
            >
              Xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomModal: React.FC<{
  isOpen: boolean;
  title: string;
  msg: string;
  icon?: string;
  onClose: () => void;
}> = ({ isOpen, title, msg, icon = '💡', onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c1427] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-slate-700 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl border border-amber-500/40">
          {icon}
        </div>
        <h4 className="text-lg font-black text-white">{title}</h4>
        <div className="text-sm text-slate-200 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: msg }} />
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 gold-btn text-slate-950 rounded-xl text-sm font-black transition cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
