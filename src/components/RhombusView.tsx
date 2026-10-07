import React, { useState, useRef, useEffect } from 'react';
import { soundService } from '../services/soundService';

interface RhombusViewProps {
  onOpenAiVerification: (claimKey: string) => void;
  onOpenModal: (title: string, msg: string) => void;
}

export const RhombusView: React.FC<RhombusViewProps> = ({
  onOpenAiVerification,
  onOpenModal,
}) => {
  // Edge visibility
  const [revealedEdges, setRevealedEdges] = useState<Record<string, boolean>>({});
  const [defChoice, setDefChoice] = useState<string>('');
  const [hbhProofVisible, setHbhProofVisible] = useState<boolean | null>(null);

  // Dynamic Rhombus (Node A & B)
  const [rx, setRx] = useState<number>(140);
  const [ry, setRy] = useState<number>(90);
  const [isDraggingNode, setIsDraggingNode] = useState<'A' | 'B' | null>(null);
  const [showBisectorColors, setShowBisectorColors] = useState<boolean>(false);
  const [whyThm1Visible, setWhyThm1Visible] = useState<boolean>(false);

  // Theorem prediction
  const [predPerp, setPredPerp] = useState<string>('');
  const [predBisect, setPredBisect] = useState<string>('');

  // GT - KL input
  const [gtInput, setGtInput] = useState<string>('');
  const [klInput, setKlInput] = useState<string>('');
  const [gtklFeedback, setGtklFeedback] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dragging logic for Rhombus
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDraggingNode || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = 480 / rect.width;
      const scaleY = 320 / rect.height;
      const x = (clientX - rect.left) * scaleX - 240;
      const y = (clientY - rect.top) * scaleY - 160;

      if (isDraggingNode === 'A') {
        const val = Math.max(60, Math.min(200, Math.abs(x)));
        setRx(Math.round(val));
      } else if (isDraggingNode === 'B') {
        const val = Math.max(50, Math.min(130, Math.abs(y)));
        setRy(Math.round(val));
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => setIsDraggingNode(null);

    if (isDraggingNode) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingNode]);

  const revealEdge = (edge: string) => {
    soundService.playPop();
    setRevealedEdges((prev) => ({ ...prev, [edge]: true }));
  };

  const revealAllEdges = () => {
    soundService.playSuccess();
    setRevealedEdges({ AB: true, BC: true, CD: true, DA: true });
  };

  const handleDefSelect = (val: string) => {
    setDefChoice(val);
    if (val === '4_canh') {
      soundService.playSuccess();
    } else {
      soundService.playIncorrect();
    }
  };

  const handleThmCheck = (p1: string, p2: string) => {
    setPredPerp(p1);
    setPredBisect(p2);
    if (p1 === 'vuonggoc' && p2 === 'phangiac') {
      soundService.playSuccess();
      onOpenModal(
        'Phát hiện định lí xuất sắc!',
        'Chính xác! Em vừa tự khám phá ra <strong>Định lí 1</strong>: Hai đường chéo hình thoi vuông góc và là các đường phân giác của các góc trong hình thoi.'
      );
    }
  };

  const handlePreviewSign = (num: number) => {
    soundService.playPop();
    const msgs = [
      '',
      '<strong>Dấu hiệu 1:</strong> Hình bình hành có hai cạnh kề bằng nhau (AB = AD). Do các cạnh đối bằng nhau (AB = CD và AD = BC) nên cả 4 cạnh đều bằng nhau → Biến thành Hình Thoi!',
      '<strong>Dấu hiệu 2:</strong> Hình bình hành có hai đường chéo vuông góc (AC ⟂ BD). Do cắt nhau tại trung điểm O, tam giác ABD có AO vừa là trung tuyến vừa là đường cao nên cân tại A (AB = AD) → Biến thành Hình Thoi!',
      '<strong>Dấu hiệu 3:</strong> Hình bình hành có đường chéo AC là phân giác góc A (∠BAC = ∠DAC). Mà ∠BCA = ∠DAC (so le trong), do đó ∠BAC = ∠BCA → Tam giác ABC cân tại B (BA = BC) → Biến thành Hình Thoi!'
    ];
    onOpenModal(`Mô phỏng Dấu hiệu ${num}`, msgs[num]);
  };

  const handleCheckGTKL = () => {
    const gt = gtInput.toLowerCase();
    const kl = klInput.toLowerCase();
    if ((gt.includes('bình hành') || gt.includes('hbh')) && gt.includes('phân giác') && kl.includes('thoi')) {
      soundService.playSuccess();
      setGtklFeedback('✅ Rất chuẩn! GT: ABCD là hình bình hành, đường chéo AC là phân giác góc A. KL: ABCD là hình thoi.');
    } else {
      soundService.playIncorrect();
      setGtklFeedback('⚠️ Gợi ý: GT cần nêu tứ giác là hình bình hành và có 1 đường chéo phân giác; KL là tứ giác đó là hình thoi.');
    }
  };

  // Live calculations
  const sideLength = Math.sqrt(rx * rx + ry * ry);
  const angleRad = Math.atan2(ry, rx);
  const angleDeg = (angleRad * 180 / Math.PI).toFixed(1);

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-indigo-950 p-6 sm:p-7 rounded-2xl border-2 border-teal-500/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            Mục 1 • SGK Trang 67 - 69
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 text-gold-gradient">
            Hình Thoi: Định Nghĩa, Tính Chất & Dấu Hiệu
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-1.5 max-w-3xl font-medium">
            Khám phá tứ giác có 4 cạnh bằng nhau, hai đường chéo vuông góc và là đường phân giác các góc.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => soundService.playTeacherSection('rhombus_def')}
            className="px-4 py-2.5 rounded-xl bg-[#070c18] hover:bg-slate-700 text-white text-sm font-bold border border-slate-600 transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>🔊</span>
            <span>Nghe giảng định nghĩa</span>
          </button>
        </div>
      </div>

      {/* Part A: Khái niệm hình thoi */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40 font-black text-base flex items-center justify-center">
              A
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Khái niệm Hình Thoi (Hình 3.47 SGK)
            </h3>
          </div>
          <span className="text-sm text-amber-300 font-bold italic">
            Nhấp vào từng cạnh để đo độ dài thực tế
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive SVG ABCD */}
          <div className="lg:col-span-7 bg-[#070c18] rounded-2xl border-2 border-slate-700 p-5 flex flex-col items-center">
            <svg className="w-full h-72 sm:h-80" viewBox="-180 -120 360 240">
              <polygon
                points="0,-80 120,0 0,80 -120,0"
                fill="rgba(13, 148, 136, 0.25)"
                stroke="#14b8a6"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Clickable Edges */}
              <line onClick={() => revealEdge('AB')} x1="0" y1="-80" x2="120" y2="0" stroke="transparent" strokeWidth="24" className="cursor-pointer" />
              <line onClick={() => revealEdge('BC')} x1="120" y1="0" x2="0" y2="80" stroke="transparent" strokeWidth="24" className="cursor-pointer" />
              <line onClick={() => revealEdge('CD')} x1="0" y1="80" x2="-120" y2="0" stroke="transparent" strokeWidth="24" className="cursor-pointer" />
              <line onClick={() => revealEdge('DA')} x1="-120" y1="0" x2="0" y2="-80" stroke="transparent" strokeWidth="24" className="cursor-pointer" />

              {/* Ticks on sides */}
              <g stroke="#14b8a6" strokeWidth="2.5">
                <line x1="56" y1="-43" x2="64" y2="-37" />
                <line x1="56" y1="37" x2="64" y2="43" />
                <line x1="-64" y1="43" x2="-56" y2="37" />
                <line x1="-64" y1="-37" x2="-56" y2="-43" />
              </g>

              {/* Vertices */}
              <circle cx="0" cy="-80" r="6" fill="#f8fafc" />
              <text x="-6" y="-92" fontWeight="900" fontSize="16" fill="#ffffff">B</text>
              <circle cx="120" cy="0" r="6" fill="#f8fafc" />
              <text x="132" y="6" fontWeight="900" fontSize="16" fill="#ffffff">C</text>
              <circle cx="0" cy="80" r="6" fill="#f8fafc" />
              <text x="-6" y="104" fontWeight="900" fontSize="16" fill="#ffffff">D</text>
              <circle cx="-120" cy="0" r="6" fill="#f8fafc" />
              <text x="-144" y="6" fontWeight="900" fontSize="16" fill="#ffffff">A</text>

              {/* Measurement Labels */}
              {revealedEdges['AB'] && (
                <text x="65" y="-45" fontSize="15" fontWeight="900" fill="#38bdf8">5.0 cm</text>
              )}
              {revealedEdges['BC'] && (
                <text x="65" y="52" fontSize="15" fontWeight="900" fill="#38bdf8">5.0 cm</text>
              )}
              {revealedEdges['CD'] && (
                <text x="-105" y="52" fontSize="15" fontWeight="900" fill="#38bdf8">5.0 cm</text>
              )}
              {revealedEdges['DA'] && (
                <text x="-105" y="-45" fontSize="15" fontWeight="900" fill="#38bdf8">5.0 cm</text>
              )}
            </svg>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <button
                onClick={revealAllEdges}
                className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-sm font-extrabold rounded-xl border border-teal-400/50 transition cursor-pointer"
              >
                Hiện tất cả độ dài 4 cạnh
              </button>
            </div>
          </div>

          {/* Definition discovery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#070c18] rounded-2xl border-2 border-slate-700">
              <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider">
                HOẠT ĐỘNG PHÁT HIỆN KIẾN THỨC
              </span>
              <p className="text-sm sm:text-base text-slate-200 mt-2 font-medium">
                Quan sát bốn cạnh AB, BC, CD, DA của tứ giác. Hoàn thành phát biểu định nghĩa:
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-300">Hình thoi là tứ giác có:</span>
                <select
                  value={defChoice}
                  onChange={(e) => handleDefSelect(e.target.value)}
                  className="p-2.5 bg-[#111c38] border-2 border-slate-600 rounded-xl text-sm font-extrabold text-amber-300 focus:outline-amber-400 cursor-pointer"
                >
                  <option value="">-- Bấm vào đây để chọn cụm từ --</option>
                  <option value="4_canh">bốn cạnh bằng nhau</option>
                  <option value="4_goc">bốn góc bằng nhau</option>
                  <option value="2_cheo">hai đường chéo bằng nhau</option>
                </select>
              </div>
              {defChoice === '4_canh' && (
                <div className="mt-4 p-4 bg-teal-950/80 border-2 border-teal-400 text-teal-200 rounded-xl text-sm font-bold leading-relaxed">
                  🎉 <strong className="text-white">ĐỊNH NGHĨA CHÍNH XÁC (SGK TRANG 67):</strong><br />
                  <span className="text-teal-300 text-base font-black">
                    Hình thoi là tứ giác có bốn cạnh bằng nhau.
                  </span>
                </div>
              )}
            </div>

            {/* Parallelogram reasoning */}
            <div className="p-5 bg-[#070c18] rounded-2xl border-2 border-slate-700">
              <h4 className="text-sm font-black text-sky-400 uppercase tracking-wide">
                🤔 Câu hỏi tư duy toán học:
              </h4>
              <p className="text-sm sm:text-base text-slate-200 mt-1.5 font-medium">
                Hình thoi có phải là một hình bình hành không? Vì sao?
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => {
                    soundService.playSuccess();
                    setHbhProofVisible(true);
                  }}
                  className="px-4 py-2 bg-sky-950 hover:bg-sky-900 text-sky-300 border-2 border-sky-500/50 rounded-xl text-sm font-extrabold transition cursor-pointer"
                >
                  Phải, là hình bình hành
                </button>
                <button
                  onClick={() => {
                    soundService.playIncorrect();
                    setHbhProofVisible(false);
                  }}
                  className="px-4 py-2 bg-[#111c38] hover:bg-slate-700 text-slate-300 border-2 border-slate-700 rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  Không phải
                </button>
              </div>
              {hbhProofVisible !== null && (
                <div className="mt-3 text-sm text-slate-200 bg-[#111c38] p-3.5 rounded-xl border border-sky-500/40 leading-relaxed font-medium">
                  <strong className="text-amber-300 font-extrabold">Giải thích toán học:</strong> Vì tứ giác có các cặp cạnh đối bằng nhau (AB = CD và AD = BC) nên theo dấu hiệu nhận biết,{' '}
                  <span className="font-extrabold text-sky-400">hình thoi cũng là một hình bình hành</span>. Do đó, hình thoi mang đầy đủ tất cả các tính chất của hình bình hành!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Part B: Tính chất hai đường chéo (Định lí 1) */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 font-black text-base flex items-center justify-center">
              B
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Tính Chất Hai Đường Chéo (Định lí 1)
            </h3>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onOpenAiVerification('thm1_perp')}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-black rounded-xl badge-gold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>🔍 KIỂM CHỨNG VỚI AI</span>
            </button>
            <button
              onClick={() => {
                setShowBisectorColors(!showBisectorColors);
                soundService.playPop();
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-xl border transition cursor-pointer ${
                showBisectorColors
                  ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                  : 'bg-[#111c38] hover:bg-slate-700 text-slate-200 border-slate-600'
              }`}
            >
              🎨 Tô màu góc bằng nhau
            </button>
            <button
              onClick={() => soundService.playTeacherSection('rhombus_thm1')}
              className="p-1.5 text-slate-300 hover:text-amber-300 text-lg cursor-pointer"
              title="Nghe định lí 1"
            >
              🔊
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Dynamic Rhombus Canvas */}
          <div className="lg:col-span-7 bg-[#070c18] rounded-2xl border-2 border-slate-700 p-4 sm:p-5 flex flex-col items-center">
            <div className="w-full flex justify-between text-sm text-slate-300 mb-2 font-bold">
              <span>
                Kéo đỉnh <strong className="text-sky-400 text-base">A</strong> hoặc <strong className="text-teal-400 text-base">B</strong> để thay đổi hình
              </span>
              <span className="font-extrabold text-emerald-400 text-base">∠AOB = 90.0°</span>
            </div>
            <div className="w-full h-80 sm:h-96 relative overflow-hidden bg-[#030712] rounded-2xl shadow-inner border-2 border-slate-700 select-none">
              <svg ref={svgRef} className="w-full h-full cursor-crosshair" viewBox="-240 -160 480 320">
                <rect x="-240" y="-160" width="480" height="320" fill="#080e1a" />

                {/* Diagonals */}
                <line x1={-rx} y1="0" x2={rx} y2="0" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
                <line x1="0" y1={-ry} x2="0" y2={ry} stroke="#14b8a6" strokeWidth="3" strokeDasharray="5 3" />

                {/* Right angle symbol at O */}
                <path d="M 0,-16 L 16,-16 L 16,0" fill="none" stroke="#ef4444" strokeWidth="2.5" />

                {/* Rhombus Polygon */}
                <polygon
                  points={`${-rx},0 0,${-ry} ${rx},0 0,${ry}`}
                  fill="rgba(56, 189, 248, 0.18)"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Angle arcs if active */}
                {showBisectorColors && (
                  <g stroke="#f59e0b" strokeWidth="3.5" fill="none">
                    <path d={`M ${-rx + 24},0 A 24 24 0 0 1 ${-rx + 24 * Math.cos(angleRad)},${-24 * Math.sin(angleRad)}`} />
                    <path d={`M ${-rx + 24},0 A 24 24 0 0 0 ${-rx + 24 * Math.cos(angleRad)},${24 * Math.sin(angleRad)}`} />
                  </g>
                )}

                {/* Center O */}
                <circle cx="0" cy="0" r="5" fill="#f8fafc" />
                <text x="8" y="18" fontSize="15" fontWeight="900" fill="#f8fafc">O</text>

                {/* Draggable A */}
                <circle
                  cx={-rx}
                  cy="0"
                  r="9"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drag-point pulse-glow cursor-grab active:cursor-grabbing"
                  onMouseDown={() => setIsDraggingNode('A')}
                  onTouchStart={() => setIsDraggingNode('A')}
                />
                <text x={-rx - 25} y="6" fontSize="16" fontWeight="900" fill="#38bdf8">A</text>

                {/* Draggable B */}
                <circle
                  cx="0"
                  cy={-ry}
                  r="9"
                  fill="#14b8a6"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drag-point pulse-glow cursor-grab active:cursor-grabbing"
                  onMouseDown={() => setIsDraggingNode('B')}
                  onTouchStart={() => setIsDraggingNode('B')}
                />
                <text x="-6" y={-ry - 14} fontSize="16" fontWeight="900" fill="#14b8a6">B</text>

                {/* Dependent C & D */}
                <circle cx={rx} cy="0" r="6" fill="#94a3b8" />
                <text x={rx + 14} y="6" fontSize="16" fontWeight="900" fill="#94a3b8">C</text>
                <circle cx="0" cy={ry} r="6" fill="#94a3b8" />
                <text x="-6" y={ry + 22} fontSize="16" fontWeight="900" fill="#94a3b8">D</text>

                {/* Live label */}
                <text x="70" y="-60" fontSize="14" fontWeight="900" fill="#38bdf8">
                  BC = {(sideLength / 10).toFixed(1)} cm
                </text>
              </svg>
            </div>

            {/* Live Data Monitor */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center text-sm font-bold">
              <div className="bg-[#0c1427] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-xs">Đường chéo AC</span>
                <span className="font-black text-sky-400 text-base">{(rx * 2 / 10).toFixed(1)} cm</span>
              </div>
              <div className="bg-[#0c1427] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-xs">Đường chéo BD</span>
                <span className="font-black text-teal-400 text-base">{(ry * 2 / 10).toFixed(1)} cm</span>
              </div>
              <div className="bg-[#0c1427] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-xs">Góc ∠DAO</span>
                <span className="font-black text-amber-300 text-base">{angleDeg}°</span>
              </div>
              <div className="bg-[#0c1427] p-3 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-xs">Góc ∠BAO</span>
                <span className="font-black text-amber-300 text-base">{angleDeg}°</span>
              </div>
            </div>
          </div>

          {/* Discovery & Theorem 1 Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 bg-[#070c18] rounded-2xl border-2 border-slate-700">
              <h4 className="text-sm font-black text-sky-400 uppercase">
                DỰ ĐOÁN MỐI QUAN HỆ HAI ĐƯỜNG CHÉO
              </h4>
              <p className="text-sm text-slate-200 mt-1.5 leading-relaxed font-medium">
                Khi các em kéo đỉnh A hoặc B, kích thước hình thoi thay đổi liên tục. Hãy hoàn thành phát hiện:
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-300">1. Hai đường chéo AC và BD:</span>
                  <select
                    value={predPerp}
                    onChange={(e) => handleThmCheck(e.target.value, predBisect)}
                    className="p-2.5 rounded-xl bg-[#111c38] border-2 border-slate-600 font-bold text-amber-300 cursor-pointer"
                  >
                    <option value="">-- Chọn mối quan hệ --</option>
                    <option value="songsong">song song với nhau</option>
                    <option value="vuonggoc">vuông góc với nhau (AC ⟂ BD)</option>
                    <option value="bangnhau">bằng nhau</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-300">2. AC là tia:</span>
                  <select
                    value={predBisect}
                    onChange={(e) => handleThmCheck(predPerp, e.target.value)}
                    className="p-2.5 rounded-xl bg-[#111c38] border-2 border-slate-600 font-bold text-amber-300 cursor-pointer"
                  >
                    <option value="">-- Chọn mối quan hệ --</option>
                    <option value="phangiac">phân giác của các góc A và C</option>
                    <option value="trungtuyen">trung tuyến</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Theorem 1 Card */}
            <div className="p-5 bg-[#070c18] border-2 border-amber-500 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 font-black text-amber-300 text-base mb-2">
                <span>⭐ ĐỊNH LÍ 1 (SGK TRANG 68)</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                Trong hình thoi:
              </p>
              <ul className="text-sm sm:text-base space-y-2 list-disc list-inside mt-2 font-bold text-slate-100">
                <li>
                  Hai đường chéo <span className="text-amber-300 underline font-black">vuông góc với nhau</span>. (AC ⟂ BD)
                </li>
                <li>
                  Hai đường chéo là các <span className="text-sky-300 underline font-black">đường phân giác</span> của các góc của hình thoi.
                </li>
              </ul>
              {/* Why button */}
              <button
                onClick={() => setWhyThm1Visible(!whyThm1Visible)}
                className="mt-4 text-sm text-sky-400 font-black underline hover:text-sky-300 flex items-center gap-1.5 cursor-pointer"
              >
                💡 Vì sao? (Chứng minh nhanh bằng tam giác cân)
              </button>
              {whyThm1Visible && (
                <div className="mt-3 p-3.5 bg-[#111c38] rounded-xl text-sm text-slate-200 leading-relaxed border border-slate-600 font-medium">
                  Vì ABCD là hình thoi nên AB = AD. Do đó tam giác ABD cân tại A.<br />
                  Hình thoi cũng là hình bình hành nên O là trung điểm của BD.<br />
                  Do đó AO vừa là đường trung tuyến, đồng thời là <strong className="text-amber-300">đường cao</strong> (AC ⟂ BD) và là <strong className="text-sky-300">đường phân giác</strong> của góc BAD.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Part C: Ví dụ 1 - Hai đường tròn cắt nhau */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-black text-base flex items-center justify-center">
              C
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Ví Dụ 1: Hai Đường Tròn Cùng Bán Kính Cắt Nhau (Hình 3.49)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 bg-[#070c18] rounded-2xl border-2 border-slate-700 p-5 flex flex-col items-center">
            <svg className="w-full h-72" viewBox="-160 -100 320 200">
              <circle cx="-50" cy="0" r="70" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
              <circle cx="50" cy="0" r="70" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeDasharray="4 3" />
              <polygon points="-50,0 0,-49 50,0 0,49" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="3" />
              <line x1="-50" y1="0" x2="50" y2="0" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="0" y1="-49" x2="0" y2="49" stroke="#ef4444" strokeWidth="2.5" />

              <circle cx="-50" cy="0" r="5" fill="#38bdf8" /><text x="-70" y="5" fontWeight="900" fontSize="15" fill="#38bdf8">A</text>
              <circle cx="50" cy="0" r="5" fill="#14b8a6" /><text x="60" y="5" fontWeight="900" fontSize="15" fill="#14b8a6">C</text>
              <circle cx="0" cy="-49" r="5" fill="#ffffff" /><text x="-6" y="-58" fontWeight="900" fontSize="15" fill="#ffffff">B</text>
              <circle cx="0" cy="49" r="5" fill="#ffffff" /><text x="-6" y="68" fontWeight="900" fontSize="15" fill="#ffffff">D</text>

              <text x="-32" y="-28" fontSize="14" fill="#38bdf8" fontWeight="900">R</text>
              <text x="24" y="-28" fontSize="14" fill="#14b8a6" fontWeight="900">R</text>
              <text x="-32" y="38" fontSize="14" fill="#38bdf8" fontWeight="900">R</text>
              <text x="24" y="38" fontSize="14" fill="#14b8a6" fontWeight="900">R</text>
            </svg>
            <div className="text-sm font-bold text-slate-300 mt-2">
              Đường tròn (A; R) và (C; R) cùng bán kính R
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 text-sm font-medium">
              <strong className="text-amber-300 font-extrabold text-base">Bước 1: So sánh các đoạn thẳng</strong>
              <p className="text-slate-200 mt-1">Vì B và D cùng thuộc (A; R) và (C; R) nên:</p>
              <div className="font-mono bg-[#111c38] p-2.5 rounded-lg border border-slate-600 mt-2 text-sky-300 font-black text-base">
                AB = AD = CB = CD = R
              </div>
            </div>
            <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 text-sm font-medium">
              <strong className="text-amber-300 font-extrabold text-base">Bước 2: Kết luận dạng hình</strong>
              <p className="text-slate-200 mt-1">
                Tứ giác ABCD có 4 cạnh bằng nhau nên tứ giác ABCD là <strong className="text-teal-400 font-black">HÌNH THOI</strong>.
              </p>
            </div>
            <div className="p-4 bg-teal-950/80 rounded-xl border-2 border-teal-500/50 text-sm text-teal-100 font-medium">
              <strong className="text-teal-300 font-black text-base">Bước 3: Vận dụng Định lí 1</strong>
              <p className="mt-1">Suy ra quan hệ vuông góc giữa đoạn nối tâm AC và dây chung BD:</p>
              <span className="inline-block mt-2 font-black text-base bg-[#070c18] px-3 py-1 rounded-lg text-amber-300 border border-teal-400">
                AC ⟂ BD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Part D: Dấu hiệu nhận biết hình thoi (Định lí 2) */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-black text-base flex items-center justify-center">
              D
            </span>
            <h3 className="font-black text-white text-lg sm:text-xl">
              Dấu Hiệu Nhận Biết Hình Thoi (Sơ đồ tương tác)
            </h3>
          </div>
          <button
            onClick={() => soundService.playTeacherSection('rhombus_signs')}
            className="p-1.5 text-slate-300 hover:text-amber-300 text-lg cursor-pointer"
            title="Nghe dấu hiệu"
          >
            🔊
          </button>
        </div>

        <p className="text-sm sm:text-base text-slate-200 font-medium">
          Một hình bình hành chỉ cần thêm <strong className="text-amber-300 font-black">1 trong 3 điều kiện đặc trưng</strong> dưới đây là trở thành hình thoi:
        </p>

        {/* 3 Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((signNum) => {
            const titles = [
              '',
              'Hình bình hành có hai cạnh kề bằng nhau',
              'Hình bình hành có hai đường chéo vuông góc',
              'Hình bình hành có một đường chéo là phân giác',
            ];
            const descs = [
              '',
              'AB = AD kết hợp các cạnh đối bằng nhau → 4 cạnh bằng nhau.',
              'AC ⟂ BD tại trung điểm O → Tam giác ABD cân tại A → AB = AD.',
              'AC là phân giác góc A kết hợp so le trong → Tam giác ABC cân.',
            ];
            return (
              <div
                key={signNum}
                onClick={() => handlePreviewSign(signNum)}
                className="p-5 rounded-2xl border-2 border-indigo-500/40 hover:border-indigo-400 bg-[#070c18] hover:bg-[#111c38] cursor-pointer transition flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-black text-indigo-300 mb-2">
                    <span>DẤU HIỆU {signNum}</span>
                    <span className="text-lg group-hover:scale-125 transition">✨</span>
                  </div>
                  <p className="text-sm sm:text-base font-black text-white">{titles[signNum]}</p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">{descs[signNum]}</p>
                </div>
                <div className="mt-4 text-center text-xs sm:text-sm font-extrabold text-indigo-300 bg-[#0c1427] py-2 rounded-xl border border-indigo-500/30">
                  Nhấp xem giải thích →
                </div>
              </div>
            );
          })}
        </div>

        {/* GT - KL Activity */}
        <div className="p-5 bg-[#070c18] rounded-2xl border-2 border-slate-700 space-y-4">
          <h4 className="text-sm font-black text-amber-300 uppercase">
            Hoạt động: Viết Giả thiết – Kết luận của Dấu hiệu (c)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">GIẢ THIẾT (GT):</label>
              <input
                type="text"
                value={gtInput}
                onChange={(e) => setGtInput(e.target.value)}
                placeholder="Ví dụ: ABCD là HBH, AC là phân giác góc A"
                className="w-full text-sm p-3 rounded-xl border-2 border-slate-600 bg-[#111c38] text-white focus:outline-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">KẾT LUẬN (KL):</label>
              <input
                type="text"
                value={klInput}
                onChange={(e) => setKlInput(e.target.value)}
                placeholder="Ví dụ: ABCD là hình thoi"
                className="w-full text-sm p-3 rounded-xl border-2 border-slate-600 bg-[#111c38] text-white focus:outline-sky-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckGTKL}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-black rounded-xl transition shadow-md cursor-pointer"
            >
              Kiểm tra giả thiết - kết luận
            </button>
            {gtklFeedback && (
              <span className="text-sm font-bold">{gtklFeedback}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
