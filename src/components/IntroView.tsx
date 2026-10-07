import React, { useState } from 'react';
import { soundService } from '../services/soundService';

interface IntroViewProps {
  onNavigate: (sectionId: string) => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onNavigate }) => {
  const [paperOA, setPaperOA] = useState<number>(80);
  const [paperOB, setPaperOB] = useState<number>(110);
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);
  const [selectedCase, setSelectedCase] = useState<'diff' | 'equal'>('diff');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const handleCaseChange = (mode: 'diff' | 'equal') => {
    setSelectedCase(mode);
    soundService.playPop();
    if (mode === 'diff') {
      setPaperOA(80);
      setPaperOB(110);
    } else {
      setPaperOA(90);
      setPaperOB(90);
    }
    setFeedback(null);
  };

  const toggleUnfold = () => {
    const nextState = !isUnfolded;
    setIsUnfolded(nextState);
    if (nextState) {
      soundService.playSuccess();
    } else {
      soundService.playPop();
    }
  };

  const handleCheckAnswer = (ans: string) => {
    if (ans === 'ht' && paperOA !== paperOB) {
      soundService.playSuccess();
      setFeedback({
        isCorrect: true,
        text: '🎉 <strong>Chính xác!</strong> Khi OA ≠ OB, bốn cạnh bằng nhau (cùng bằng độ dài vết cắt AB), hai đường chéo khác nhau nên hình nhận được là <strong>HÌNH THOI</strong>.'
      });
    } else if (ans === 'hv' && paperOA === paperOB) {
      soundService.playSuccess();
      setFeedback({
        isCorrect: true,
        text: '🎉 <strong>Tuyệt vời!</strong> Khi OA = OB, hai đường chéo AC = BD và vuông góc nhau, bốn cạnh bằng nhau và góc ở các đỉnh bằng 90°. Ta nhận được <strong>HÌNH VUÔNG</strong>!'
      });
    } else {
      soundService.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: '💡 <em>Gợi ý sư phạm:</em> Em hãy quan sát xem 4 cạnh của tứ giác khi mở ra có độ dài như thế nào với đoạn cắt AB? Hãy thử chuyển đổi giữa 2 trường hợp OA ≠ OB và OA = OB nhé!'
      });
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Header card */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-amber-400 tracking-wide uppercase">
            <span>KHỞI ĐỘNG • TÌNH HUỐNG SGK TRANG 67</span>
            <button
              onClick={() => soundService.playTeacherSection('intro')}
              className="p-1.5 text-slate-300 hover:text-amber-300 text-lg cursor-pointer"
              title="Đọc thuyết minh"
            >
              🔊
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Gấp đôi tờ giấy hai lần liên tiếp tạo góc vuông O
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium">
            Lấy điểm A trên cạnh này, điểm B trên cạnh kia, cắt theo đoạn thẳng AB rồi mở bung tờ giấy ra.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleCaseChange('diff')}
            className={`px-4 py-2.5 text-sm font-extrabold rounded-xl transition cursor-pointer border ${
              selectedCase === 'diff'
                ? 'bg-sky-600 text-white shadow-md border-sky-400'
                : 'bg-[#111c38] hover:bg-slate-800 text-slate-200 border-slate-600'
            }`}
          >
            Trường hợp 1: OA ≠ OB
          </button>
          <button
            onClick={() => handleCaseChange('equal')}
            className={`px-4 py-2.5 text-sm font-extrabold rounded-xl transition cursor-pointer border ${
              selectedCase === 'equal'
                ? 'bg-emerald-600 text-white shadow-md border-emerald-400'
                : 'bg-[#111c38] hover:bg-slate-800 text-slate-200 border-slate-600'
            }`}
          >
            Trường hợp 2: OA = OB
          </button>
        </div>
      </div>

      {/* Simulation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-[#070c18] p-5 sm:p-7 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-amber-300">
              Mô phỏng gấp & cắt mở giấy (Kéo thanh đo A và B bên dưới)
            </span>
            <button
              onClick={toggleUnfold}
              className={`px-4 py-2 text-sm font-black rounded-xl text-white shadow-md transition cursor-pointer ${
                isUnfolded ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isUnfolded ? '📄 Gấp lại 1/4 giấy' : '✂ Mở bung tờ giấy ra'}
            </button>
          </div>

          {/* SVG Canvas for paper folding */}
          <div className="w-full h-80 sm:h-96 bg-[#030712] rounded-2xl border-2 border-dashed border-slate-600 relative flex items-center justify-center overflow-hidden shadow-inner">
            <svg className="w-full h-full" viewBox="-220 -190 440 380">
              <defs>
                <pattern id="gridPaper" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect x="-220" y="-190" width="440" height="380" fill="url(#gridPaper)" />

              {/* Axes O */}
              <line x1="-190" y1="0" x2="190" y2="0" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="0" y1="-170" x2="0" y2="170" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />

              {/* Unfolded Quadrilateral Polygon */}
              {isUnfolded && (
                <polygon
                  points={`${-paperOA},0 0,${-paperOB} ${paperOA},0 0,${paperOB}`}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />
              )}

              {/* Folded 1/4 triangle OAB */}
              <polygon
                points={`0,0 ${-paperOA},0 0,${-paperOB}`}
                fill="rgba(245, 158, 11, 0.35)"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray="4 3"
              />

              {/* Cut Line AB */}
              <line
                x1={-paperOA}
                y1="0"
                x2="0"
                y2={-paperOB}
                stroke="#ef4444"
                strokeWidth="3.5"
              />

              {/* Right angle symbol at O */}
              <path d="M 0,-18 L 18,-18 L 18,0" fill="none" stroke="#f8fafc" strokeWidth="2" />

              {/* Points Labels & Circles */}
              <circle cx="0" cy="0" r="5" fill="#f8fafc" />
              <text x="-16" y="18" fontSize="16" fontWeight="900" fill="#f8fafc">O</text>

              <circle cx={-paperOA} cy="0" r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x={-paperOA - 22} y="6" fontSize="16" fontWeight="900" fill="#38bdf8">A</text>

              <circle cx="0" cy={-paperOB} r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x="8" y={-paperOB - 10} fontSize="16" fontWeight="900" fill="#38bdf8">B</text>

              {/* Reflected points when unfolded */}
              {isUnfolded && (
                <>
                  <circle cx={paperOA} cy="0" r="5" fill="#94a3b8" />
                  <text x={paperOA + 10} y="6" fontSize="15" fill="#94a3b8" fontWeight="800">C</text>
                  <circle cx="0" cy={paperOB} r="5" fill="#94a3b8" />
                  <text x="8" y={paperOB + 18} fontSize="15" fill="#94a3b8" fontWeight="800">D</text>
                </>
              )}
            </svg>
          </div>

          {/* Controls for lengths OA and OB */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 bg-[#0c1427] p-4 rounded-xl border border-slate-700">
            <div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-200 mb-2">
                <span>Độ dài đoạn OA:</span>
                <span className="text-sky-400 font-mono text-base font-extrabold">
                  {(paperOA / 10).toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="140"
                value={paperOA}
                onChange={(e) => {
                  setPaperOA(parseInt(e.target.value));
                  if (selectedCase === 'equal') setPaperOB(parseInt(e.target.value));
                }}
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-200 mb-2">
                <span>Độ dài đoạn OB:</span>
                <span className="text-sky-400 font-mono text-base font-extrabold">
                  {(paperOB / 10).toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="140"
                value={paperOB}
                onChange={(e) => {
                  setPaperOB(parseInt(e.target.value));
                  if (selectedCase === 'equal') setPaperOA(parseInt(e.target.value));
                }}
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Question & Hypothesis Card */}
        <div className="lg:col-span-4 bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col justify-between h-full">
          <div>
            <span className="inline-block px-3.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-black mb-3">
              CÂU HỎI TÌNH HUỐNG
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              Khi mở hoàn toàn tờ giấy đã cắt ra, tứ giác nhận được là hình gì?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed font-medium">
              Hãy bấm mở giấy và quan sát các cạnh, góc đối xứng qua hai nếp gấp vuông góc của tờ giấy ban đầu.
            </p>

            {/* Multiple choice options */}
            <div className="mt-5 space-y-2.5">
              {[
                { id: 'hbh', label: 'A. Hình bình hành thông thường' },
                { id: 'hcn', label: 'B. Hình chữ nhật' },
                { id: 'ht', label: 'C. Hình thoi (khi OA ≠ OB)' },
                { id: 'hv', label: 'D. Hình vuông (khi OA = OB)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleCheckAnswer(opt.id)}
                  className="w-full text-left p-3.5 rounded-xl border-2 border-slate-700 bg-[#070c18] hover:bg-slate-800 cursor-pointer text-sm font-bold text-slate-200 transition flex items-center gap-3"
                >
                  <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px]">
                    ●
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-sm font-bold leading-relaxed border-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: feedback.text }}
              />
            )}
          </div>

          <div className="pt-5 border-t border-slate-700 flex items-center justify-between mt-6">
            <span className="text-sm font-semibold text-slate-400">Khám phá tiếp theo:</span>
            <button
              onClick={() => {
                soundService.playPop();
                onNavigate('rhombus');
              }}
              className="px-5 py-2.5 rounded-xl gold-btn text-slate-950 text-sm font-black transition flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>Hình Thoi</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
