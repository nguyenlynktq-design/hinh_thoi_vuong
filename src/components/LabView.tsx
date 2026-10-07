import React, { useState, useRef, useEffect } from 'react';
import { soundService } from '../services/soundService';

interface Point {
  x: number;
  y: number;
}

export const LabView: React.FC = () => {
  const [points, setPoints] = useState<Record<string, Point>>({
    A: { x: -120, y: -60 },
    B: { x: 80, y: -60 },
    C: { x: 120, y: 80 },
    D: { x: -80, y: 80 },
  });
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handlePreset = (type: 'hbh' | 'hcn' | 'ht' | 'hv') => {
    soundService.playSuccess();
    if (type === 'hbh') {
      setPoints({ A: { x: -110, y: -60 }, B: { x: 50, y: -60 }, C: { x: 110, y: 60 }, D: { x: -50, y: 60 } });
    } else if (type === 'hcn') {
      setPoints({ A: { x: -100, y: -60 }, B: { x: 100, y: -60 }, C: { x: 100, y: 60 }, D: { x: -100, y: 60 } });
    } else if (type === 'ht') {
      setPoints({ A: { x: -120, y: 0 }, B: { x: 0, y: -80 }, C: { x: 120, y: 0 }, D: { x: 0, y: 80 } });
    } else if (type === 'hv') {
      setPoints({ A: { x: -75, y: -75 }, B: { x: 75, y: -75 }, C: { x: 75, y: 75 }, D: { x: -75, y: 75 } });
    }
  };

  const handleReset = () => {
    soundService.playPop();
    handlePreset('hbh');
  };

  // Dragging event listeners
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!activeDrag || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 300 / rect.height;
      const svgX = (clientX - rect.left) * scaleX - 200;
      const svgY = (clientY - rect.top) * scaleY - 150;

      const clampedX = Math.round(Math.max(-180, Math.min(180, svgX)));
      const clampedY = Math.round(Math.max(-130, Math.min(130, svgY)));

      setPoints((prev) => ({
        ...prev,
        [activeDrag]: { x: clampedX, y: clampedY }
      }));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => setActiveDrag(null);

    if (activeDrag) {
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
  }, [activeDrag]);

  // Diagnostics calculations
  const { A, B, C, D } = points;
  const dist = (p1: Point, p2: Point) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const dotProduct = (v1: Point, v2: Point) => v1.x * v2.x + v1.y * v2.y;

  const dAB = dist(A, B);
  const dBC = dist(B, C);
  const dCD = dist(C, D);
  const dDA = dist(D, A);
  const dAC = dist(A, C);
  const dBD = dist(B, D);

  const vAB = { x: B.x - A.x, y: B.y - A.y };
  const vDC = { x: C.x - D.x, y: C.y - D.y };
  const vAD = { x: D.x - A.x, y: D.y - A.y };
  const vBC = { x: C.x - B.x, y: C.y - B.y };
  const vAC = { x: C.x - A.x, y: C.y - A.y };
  const vBD = { x: D.x - B.x, y: D.y - B.y };

  const isOppParallel =
    Math.abs(vAB.x - vDC.x) < 9 &&
    Math.abs(vAB.y - vDC.y) < 9 &&
    Math.abs(vAD.x - vBC.x) < 9 &&
    Math.abs(vAD.y - vBC.y) < 9;

  const isOppEqual = Math.abs(dAB - dCD) < 7 && Math.abs(dBC - dDA) < 7;
  const is4SidesEqual = isOppEqual && Math.abs(dAB - dBC) < 8;

  const dotA = Math.abs(dotProduct(vAB, vAD));
  const isRightAngle = dotA / (dAB * dDA) < 0.1;

  const dotDiag = Math.abs(dotProduct(vAC, vBD));
  const isDiagPerp = dotDiag / (dAC * dBD) < 0.1;
  const isDiagEqual = Math.abs(dAC - dBD) < 8;

  let shapeName = 'TỨ GIÁC TỰ DO';
  let badgeClass = 'bg-slate-800 text-slate-300 border border-slate-600';
  let comment = 'Kéo các điểm sao cho các cặp cạnh đối song song để bắt đầu bước vào gia đình hình học nhé.';

  if (isOppParallel && is4SidesEqual && isRightAngle) {
    shapeName = '👑 HÌNH VUÔNG HOÀN HẢO';
    badgeClass = 'gold-btn text-[#030712] font-black shadow-lg';
    comment = 'Tuyệt tác hình học! Bạn đã tạo ra một Hình Vuông có 4 góc vuông và 4 cạnh bằng nhau.';
  } else if (isOppParallel && is4SidesEqual) {
    shapeName = '💎 HÌNH THOI';
    badgeClass = 'bg-teal-500 text-slate-950 font-black shadow-md';
    comment = 'Rất tốt! Tứ giác này là Hình Thoi với hai đường chéo vuông góc tại trung điểm.';
  } else if (isOppParallel && isRightAngle) {
    shapeName = '📐 HÌNH CHỮ NHẬT';
    badgeClass = 'bg-indigo-500 text-white font-black shadow-md';
    comment = 'Chính xác! Tứ giác có 4 góc vuông và 2 đường chéo bằng nhau là Hình Chữ Nhật.';
  } else if (isOppParallel) {
    shapeName = '▱ HÌNH BÌNH HÀNH';
    badgeClass = 'bg-sky-500 text-slate-950 font-black shadow-sm';
    comment = 'Hình bình hành cơ bản. Hãy thử kéo để hai đường chéo vuông góc xem điều gì xảy ra!';
  }

  const renderSensorItem = (label: string, active: boolean) => (
    <div
      className={`flex items-center justify-between p-2.5 rounded-xl transition ${
        active
          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200 font-black'
          : 'bg-[#070c18] border border-slate-700 text-slate-400 font-bold'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-300'}>{label}</span>
      <span className="font-mono text-xs">{active ? '✔ ĐẠT' : '---'}</span>
    </div>
  );

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-7 rounded-2xl border-2 border-indigo-500/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            SANDBOX • KHÔNG GIAN THỰC HÀNH TỰ DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 text-gold-gradient">
            Phòng Thí Nghiệm Tứ Giác
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-1.5 max-w-3xl font-medium">
            Kéo tự do 4 đỉnh để khám phá biến đổi giữa Tứ giác → Hình Bình Hành → Hình Chữ Nhật → Hình Thoi → Hình Vuông!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-[#070c18] hover:bg-slate-700 text-sm font-bold border border-slate-600 transition cursor-pointer"
          >
            🔄 Đặt lại vị trí ban đầu
          </button>
        </div>
      </div>

      {/* Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-[#0c1427] p-5 sm:p-6 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-300">
              Kéo 4 đỉnh <strong>A, B, C, D</strong> bằng chuột hoặc ngón tay:
            </span>
            <div className={`px-4 py-1.5 rounded-full text-xs sm:text-sm uppercase font-black transition ${badgeClass}`}>
              {shapeName}
            </div>
          </div>

          <div className="w-full h-80 sm:h-96 relative bg-[#030712] rounded-2xl border-2 border-slate-700 overflow-hidden select-none">
            <svg ref={svgRef} className="w-full h-full cursor-crosshair" viewBox="-200 -150 400 300">
              <rect x="-200" y="-150" width="400" height="300" fill="#080e1a" />

              {/* Diagonals */}
              <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />
              <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#64748b" strokeWidth="2" strokeDasharray="4 3" />

              {/* Polygon */}
              <polygon
                points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* 4 Draggable Vertices */}
              {(['A', 'B', 'C', 'D'] as const).map((pt) => {
                const pos = points[pt];
                const lblOffsetX = pos.x > 0 ? 12 : -22;
                const lblOffsetY = pos.y > 0 ? 20 : -10;
                return (
                  <g key={pt}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="9"
                      fill="#6366f1"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="drag-point pulse-glow cursor-grab active:cursor-grabbing"
                      onMouseDown={() => setActiveDrag(pt)}
                      onTouchStart={() => setActiveDrag(pt)}
                    />
                    <text
                      x={pos.x + lblOffsetX}
                      y={pos.y + lblOffsetY}
                      fontWeight="900"
                      fontSize="16"
                      fill="#6366f1"
                    >
                      {pt}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Preset Buttons */}
          <div className="w-full flex flex-wrap gap-2.5 justify-center mt-4 text-sm font-bold">
            <span className="text-slate-400 self-center mr-1">Hình mẫu chuẩn:</span>
            <button
              onClick={() => handlePreset('hbh')}
              className="px-3.5 py-1.5 bg-[#070c18] hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 font-extrabold cursor-pointer transition"
            >
              Hình bình hành
            </button>
            <button
              onClick={() => handlePreset('hcn')}
              className="px-3.5 py-1.5 bg-[#070c18] hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 font-extrabold cursor-pointer transition"
            >
              Hình chữ nhật
            </button>
            <button
              onClick={() => handlePreset('ht')}
              className="px-3.5 py-1.5 bg-teal-950 hover:bg-teal-900 text-teal-300 rounded-xl border border-teal-600 font-extrabold cursor-pointer transition"
            >
              Hình thoi
            </button>
            <button
              onClick={() => handlePreset('hv')}
              className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl border border-emerald-600 font-extrabold cursor-pointer transition"
            >
              Hình vuông
            </button>
          </div>
        </div>

        {/* Live Diagnostics */}
        <div className="lg:col-span-4 bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
              MÁY QUÉT CẢM BIẾN HÌNH HỌC
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-2 text-sm">
            {renderSensorItem('Cặp cạnh đối song song', isOppParallel)}
            {renderSensorItem('Cặp cạnh đối bằng nhau', isOppEqual)}
            {renderSensorItem('Bốn cạnh bằng nhau', is4SidesEqual)}
            {renderSensorItem('Bốn góc vuông (90°)', isRightAngle && isOppParallel)}
            {renderSensorItem('Hai đường chéo vuông góc', isDiagPerp)}
            {renderSensorItem('Hai đường chéo bằng nhau', isDiagEqual)}
          </div>

          <div className="p-4 bg-[#070c18] border-2 border-indigo-500/40 rounded-2xl text-sm space-y-1">
            <div className="flex items-center gap-2 font-black text-indigo-300">
              <span>🤖 Trợ lý phản xạ Lab:</span>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {comment}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
