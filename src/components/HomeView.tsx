import React from 'react';
import { soundService } from '../services/soundService';

interface HomeViewProps {
  onNavigate: (sectionId: string) => void;
  onOpenAiVerification: (claimKey: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAiVerification }) => {
  return (
    <section className="flex flex-col items-center justify-center py-6 sm:py-8 text-center animate-fadeIn">
      {/* Center Illuminated Shield Icon */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-sky-500/30 rounded-full blur-2xl"></div>
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-b from-sky-400 to-indigo-950 p-1 shadow-2xl border-2 border-sky-300/60 flex items-center justify-center">
          <div className="w-full h-full bg-[#070c18] rounded-[22px] flex items-center justify-center">
            <svg className="w-10 h-10 text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.96-7 10.15-3.87-1.19-7-5.48-7-10.15V6.3l7-3.12z"/>
              <path d="M10 15.5l-3.5-3.5 1.41-1.41L10 12.67l5.59-5.59L17 8.5z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Badge Title */}
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full badge-gold text-xs sm:text-sm font-black tracking-widest uppercase mb-4 shadow-lg leading-normal">
        <span>⭐ BÀI GIẢNG HÌNH HỌC TƯƠNG TÁC CHUẨN KNTT ⭐</span>
      </div>

      {/* Main Headline with Gold Gradient */}
      <div className="w-full max-w-5xl px-2">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gold-gradient tracking-tight uppercase leading-snug">
          HÌNH THOI VÀ HÌNH VUÔNG
        </h2>
      </div>

      {/* Subtitle badge with Bright Outline */}
      <div className="mt-4 mb-6 inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-sky-950/90 border-2 border-sky-400/50 text-sky-200 text-sm sm:text-base font-bold tracking-wide shadow-lg leading-relaxed max-w-full">
        <span>CHỦ ĐỀ: TỨ GIÁC ĐẶC BIỆT & TÍNH CHẤT ĐỐI XỨNG HÌNH HỌC</span>
      </div>

      <p className="text-slate-200 text-base sm:text-lg max-w-3xl leading-relaxed mb-8 font-medium px-2">
        Phương pháp khám phá trực quan: <span className="text-amber-300 font-extrabold">Quan sát</span> → <span className="text-sky-300 font-extrabold">Thao tác</span> → <span className="text-emerald-300 font-extrabold">Dự đoán</span> → <span className="text-indigo-200 font-extrabold">Kiểm chứng logic</span>. Tích hợp phản biện <strong className="text-amber-300 font-black">Năng lực số & AI</strong> cùng hệ thống <strong className="text-emerald-300 font-black">Luyện tập 3 mức độ</strong>.
      </p>

      {/* Pedagogical Rules Highlight Card */}
      <div className="w-full max-w-3xl bg-[#0c1427] p-6 rounded-2xl border-2 border-amber-500/40 shadow-2xl text-left mb-8">
        <div className="flex items-center justify-between text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-700">
          <span>📜 QUY TRÌNH HỌC TẬP & NGUYÊN TẮC TOÁN HỌC CHUẨN</span>
          <button
            onClick={() => soundService.playTeacherSection('home')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 cursor-pointer"
          >
            <span>🔊</span>
            <span>Nghe giới thiệu</span>
          </button>
        </div>
        <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 font-medium">
          <li className="flex items-start gap-2.5">
            <span className="text-sky-400 font-black text-lg">🔹</span>
            <span>Mỗi đơn vị kiến thức tuân thủ 7 bước sư phạm: Thao tác hình học động thực thụ trước khi hình thành định nghĩa và định lí.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-400 font-black text-lg">🔹</span>
            <span>Hệ thống bài tập phân hoá rõ ràng <strong className="text-amber-300 font-bold">3 Mức độ</strong>: <em>Nhận biết - Thông hiểu - Vận dụng</em> (mỗi mức độ gồm 2 câu hỏi tương tác).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-400 font-black text-lg">⭐</span>
            <span><strong className="text-amber-300 font-bold">Năng lực số và AI:</strong> Rèn luyện tư duy phản biện qua phản ví dụ hình học. <em>Tuyệt đối không dùng AI thay thế cho lập luận và chứng minh toán học!</em></span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => {
            soundService.playPop();
            onNavigate('intro');
          }}
          className="gold-btn px-9 py-4 rounded-2xl text-slate-950 font-black text-base sm:text-lg tracking-wide shadow-2xl flex items-center gap-2 cursor-pointer"
        >
          <span>🚀 BẮT ĐẦU BÀI HỌC</span>
          <span className="text-xl">→</span>
        </button>
        <button
          onClick={() => {
            soundService.playPop();
            onOpenAiVerification('intro_sample');
          }}
          className="px-7 py-4 rounded-2xl bg-[#111c38] hover:bg-slate-800 border-2 border-slate-600 text-slate-100 font-extrabold text-sm sm:text-base shadow-lg transition flex items-center gap-2 cursor-pointer"
        >
          <span>🔍 Kiểm chứng với AI</span>
        </button>
        <button
          onClick={() => {
            soundService.playPop();
            onNavigate('practice');
          }}
          className="px-7 py-4 rounded-2xl bg-[#111c38] hover:bg-slate-800 border-2 border-slate-600 text-slate-100 font-extrabold text-sm sm:text-base shadow-lg transition cursor-pointer"
        >
          ✏️ Luyện tập (Nhận biết - Thông hiểu - Vận dụng)
        </button>
      </div>
    </section>
  );
};
