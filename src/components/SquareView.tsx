import React, { useState } from 'react';
import { soundService } from '../services/soundService';

interface SquareViewProps {
  onOpenModal: (title: string, msg: string) => void;
}

const FAMILY_TREE_DATA: Record<string, { title: string; body: string }> = {
  tu_giac: {
    title: 'TỨ GIÁC',
    body: 'Hình gồm bốn đoạn thẳng khép kín, trong đó bất kì hai đoạn thẳng nào cũng không cùng nằm trên một đường thẳng. Tổng 4 góc luôn bằng 360°.'
  },
  hbh: {
    title: 'HÌNH BÌNH HÀNH',
    body: 'Tứ giác có các cạnh đối song song. Thừa hưởng tính chất: các cạnh đối bằng nhau, các góc đối bằng nhau, hai đường chéo cắt nhau tại trung điểm mỗi đường.'
  },
  ht: {
    title: 'HÌNH THOI',
    body: 'Hình bình hành có 4 cạnh bằng nhau. Thừa hưởng tính chất hình bình hành và có thêm: 2 đường chéo vuông góc, 2 đường chéo là phân giác các góc.'
  },
  hcn: {
    title: 'HÌNH CHỮ NHẬT',
    body: 'Tứ giác có 4 góc vuông (cũng là hình bình hành). Có thêm tính chất đặc trưng: 2 đường chéo bằng nhau và cắt nhau tại trung điểm.'
  },
  hv: {
    title: '👑 HÌNH VUÔNG',
    body: 'Giao điểm hoàn hảo giữa Hình Chữ Nhật và Hình Thoi! Có 4 góc vuông, 4 cạnh bằng nhau. Hai đường chéo: bằng nhau, vuông góc, cắt nhau tại trung điểm và là phân giác các góc (tạo góc 45°).'
  }
};

export const SquareView: React.FC<SquareViewProps> = () => {
  const [squareSize, setSquareSize] = useState<number>(80);
  const [selectedFamily, setSelectedFamily] = useState<string>('hv');

  const handleSelectFamily = (key: string) => {
    soundService.playPop();
    setSelectedFamily(key);
  };

  const half = squareSize;
  const familyInfo = FAMILY_TREE_DATA[selectedFamily];

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-indigo-950 p-6 sm:p-7 rounded-2xl border-2 border-emerald-500/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            Mục 2 • SGK Trang 70 - 72
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 text-gold-gradient">
            Hình Vuông: Vị Vua Của Các Tứ Giác
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-1.5 max-w-3xl font-medium">
            Tứ giác hoàn hảo hội tụ đầy đủ mọi phẩm chất của cả Hình Chữ Nhật và Hình Thoi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => soundService.playTeacherSection('square_def')}
            className="px-4 py-2.5 rounded-xl bg-[#070c18] hover:bg-slate-700 text-white text-sm font-bold border border-slate-600 transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>🔊</span>
            <span>Nghe giảng hình vuông</span>
          </button>
        </div>
      </div>

      {/* Definition & Hierarchy Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-black text-base flex items-center justify-center">
              A
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Khái Niệm Hình Vuông
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            Nhớ lại tình huống mở giấy với <strong className="text-amber-300">OA = OB</strong> ở đầu bài. Khi đó tứ giác có 4 góc vuông và 4 cạnh bằng nhau.
          </p>
          <div className="p-5 bg-[#070c18] rounded-2xl border-2 border-emerald-500/50 shadow-inner">
            <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wide">
              ĐỊNH NGHĨA CHÍNH THỨC SGK
            </span>
            <p className="text-base sm:text-lg font-black text-white mt-2 leading-relaxed">
              Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau.
            </p>
          </div>
          <div className="space-y-2.5 text-sm sm:text-base text-slate-200 font-bold">
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-black text-lg">✔</span>
              <span>Hình vuông <strong className="text-sky-300">là hình chữ nhật</strong> (có 4 góc vuông).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-black text-lg">✔</span>
              <span>Hình vuông <strong className="text-teal-300">là hình thoi</strong> (có 4 cạnh bằng nhau).</span>
            </div>
          </div>
        </div>

        {/* Hierarchy Tree */}
        <div className="lg:col-span-7 bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 font-black text-base flex items-center justify-center">
                B
              </span>
              <h3 className="font-black text-white text-lg sm:text-xl">
                Sơ Đồ Gia Đình Tứ Giác Tương Tác
              </h3>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-bold">Nhấp vào từng hình để tra cứu</span>
          </div>

          <div className="bg-[#070c18] p-5 rounded-2xl border-2 border-slate-700 flex flex-col items-center gap-4 text-sm font-black">
            <button
              onClick={() => handleSelectFamily('tu_giac')}
              className={`px-5 py-2 rounded-xl transition border cursor-pointer ${
                selectedFamily === 'tu_giac' ? 'bg-slate-700 text-amber-300 border-amber-400 shadow' : 'bg-slate-800 text-white border-slate-600'
              }`}
            >
              TỨ GIÁC
            </button>
            <div className="w-1 h-3 bg-slate-600"></div>

            <button
              onClick={() => handleSelectFamily('hbh')}
              className={`px-6 py-2.5 rounded-xl border-2 transition cursor-pointer ${
                selectedFamily === 'hbh' ? 'bg-sky-900 text-white border-sky-300 shadow-lg' : 'bg-sky-950 text-sky-300 border-sky-500/50'
              }`}
            >
              HÌNH BÌNH HÀNH (Các cạnh đối song song)
            </button>

            <div className="w-full flex justify-around items-center pt-1 gap-2">
              <button
                onClick={() => handleSelectFamily('ht')}
                className={`px-5 py-2.5 rounded-xl border-2 transition text-center cursor-pointer flex-1 ${
                  selectedFamily === 'ht' ? 'bg-teal-900 text-white border-teal-300 shadow-lg' : 'bg-teal-950 text-teal-300 border-teal-500/50'
                }`}
              >
                HÌNH THOI<br />
                <span className="text-xs font-normal text-teal-200">+ 4 cạnh bằng nhau</span>
              </button>
              <button
                onClick={() => handleSelectFamily('hcn')}
                className={`px-5 py-2.5 rounded-xl border-2 transition text-center cursor-pointer flex-1 ${
                  selectedFamily === 'hcn' ? 'bg-indigo-900 text-white border-indigo-300 shadow-lg' : 'bg-indigo-950 text-indigo-300 border-indigo-500/50'
                }`}
              >
                HÌNH CHỮ NHẬT<br />
                <span className="text-xs font-normal text-indigo-200">+ 4 góc vuông</span>
              </button>
            </div>

            <div className="w-1 h-3 bg-slate-600"></div>
            <button
              onClick={() => handleSelectFamily('hv')}
              className={`w-full sm:w-3/4 py-3.5 rounded-2xl gold-btn text-[#030712] font-black text-base shadow-2xl transition text-center cursor-pointer ${
                selectedFamily === 'hv' ? 'ring-4 ring-amber-300/80 scale-102' : ''
              }`}
            >
              👑 HÌNH VUÔNG (Giao của Hình Chữ Nhật & Hình Thoi)
            </button>
          </div>

          <div className="p-4 bg-[#070c18] rounded-xl border border-sky-500/40 text-sm text-slate-200 font-medium">
            <h4 className="font-black text-amber-300 text-base mb-1">{familyInfo.title}</h4>
            <p className="leading-relaxed font-medium">{familyInfo.body}</p>
          </div>
        </div>
      </div>

      {/* Part C: Tính chất hai đường chéo hình vuông (Định lí 3) */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-black text-base flex items-center justify-center">
              C
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Tính Chất Đường Chéo Hình Vuông (Định lí 3)
            </h3>
          </div>
          <button
            onClick={() => soundService.playTeacherSection('square_thm3')}
            className="p-1.5 text-slate-300 hover:text-amber-300 text-lg cursor-pointer"
            title="Nghe định lí 3"
          >
            🔊
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 bg-[#070c18] rounded-2xl border-2 border-slate-700 p-5 flex flex-col items-center">
            <div className="w-full flex justify-between text-sm font-bold text-slate-300 mb-2">
              <span>Kéo thanh trượt để thay đổi kích thước</span>
              <span className="font-black text-emerald-400 text-base">
                Cạnh a = {(half * 2 / 10).toFixed(1)} cm
              </span>
            </div>

            <div className="w-full h-80 sm:h-96 bg-[#030712] rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="-160 -140 320 280">
                <rect
                  x={-half}
                  y={-half}
                  width={half * 2}
                  height={half * 2}
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
                <line x1={-half} y1={half} x2={half} y2={-half} stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
                <line x1={-half} y1={-half} x2={half} y2={half} stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
                <path d="M 0,-14 L 14,-14 L 14,0" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="5" fill="#f8fafc" /><text x="7" y="18" fontSize="15" fontWeight="900" fill="#f8fafc">O</text>

                {/* 4 Corner Right Angles */}
                <path d={`M ${-half},${-half + 15} L ${-half + 15},${-half + 15} L ${-half + 15},${-half}`} fill="none" stroke="#10b981" strokeWidth="2" />
                <path d={`M ${half - 15},${-half} L ${half - 15},${-half + 15} L ${half},${-half + 15}`} fill="none" stroke="#10b981" strokeWidth="2" />
                <path d={`M ${half},${half - 15} L ${half - 15},${half - 15} L ${half - 15},${half}`} fill="none" stroke="#10b981" strokeWidth="2" />
                <path d={`M ${-half + 15},${half} L ${-half + 15},${half - 15} L ${-half},${half - 15}`} fill="none" stroke="#10b981" strokeWidth="2" />

                {/* Vertices */}
                <circle cx={-half} cy={-half} r="5" fill="#f8fafc" /><text x={-half - 20} y={-half - 6} fontWeight="900" fontSize="16" fill="#ffffff">A</text>
                <circle cx={half} cy={-half} r="5" fill="#f8fafc" /><text x={half + 10} y={-half - 6} fontWeight="900" fontSize="16" fill="#ffffff">B</text>
                <circle cx={half} cy={half} r="5" fill="#f8fafc" /><text x={half + 10} y={half + 20} fontWeight="900" fontSize="16" fill="#ffffff">C</text>
                <circle cx={-half} cy={half} r="5" fill="#f8fafc" /><text x={-half - 20} y={half + 20} fontWeight="900" fontSize="16" fill="#ffffff">D</text>

                {/* Angle 45 deg */}
                <text x={-half + 24} y={-half + 20} fontSize="13" fontWeight="900" fill="#38bdf8">45°</text>
                <text x={-half + 10} y={-half + 34} fontSize="13" fontWeight="900" fill="#38bdf8">45°</text>
              </svg>
            </div>
            <input
              type="range"
              min="50"
              max="110"
              value={squareSize}
              onChange={(e) => setSquareSize(parseInt(e.target.value))}
              className="w-full mt-4 accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#070c18] border-2 border-emerald-500 rounded-2xl shadow-xl">
              <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase">
                ⭐ ĐỊNH LÍ 3 (SGK TRANG 70)
              </span>
              <p className="text-sm sm:text-base font-bold text-white mt-1.5 leading-relaxed">
                Trong một hình vuông, hai đường chéo:
              </p>
              <ul className="text-sm sm:text-base space-y-2 list-disc list-inside mt-3 font-bold text-slate-100">
                <li><span className="text-sky-300 font-black">Bằng nhau</span>: AC = BD</li>
                <li><span className="text-amber-300 font-black">Vuông góc với nhau</span>: AC ⟂ BD</li>
                <li>Cắt nhau tại <span className="text-emerald-300 font-black">trung điểm mỗi đường</span></li>
                <li>Là các <span className="text-teal-300 font-black">đường phân giác</span> của các góc (tạo góc 45°)</li>
              </ul>
            </div>

            {/* Memory trick */}
            <div className="p-5 bg-[#070c18] border-2 border-amber-500/50 rounded-2xl shadow-xl">
              <span className="text-xs sm:text-sm font-black text-amber-300 uppercase">
                💡 MẸO GHI NHỚ TOÁN HỌC SIÊU TỐC
              </span>
              <div className="mt-2.5 space-y-1.5 text-sm sm:text-base text-slate-200 font-medium">
                <p>🔹 <strong>Hình chữ nhật:</strong> Đường chéo bằng nhau.</p>
                <p>🔹 <strong>Hình thoi:</strong> Đường chéo vuông góc & phân giác.</p>
                <p className="font-black text-amber-300 pt-1 text-base">👉 <strong>Hình vuông:</strong> Thừa kế TOÀN BỘ các tính chất trên!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
