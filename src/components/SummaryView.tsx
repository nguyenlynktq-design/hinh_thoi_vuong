import React, { useState } from 'react';
import { soundService } from '../services/soundService';

interface SummaryViewProps {
  onOpenModal: (title: string, msg: string) => void;
}

interface MatrixProperty {
  id: string;
  name: string;
  hbh: boolean;
  hcn: boolean;
  ht: boolean;
  hv: boolean;
}

const MATRIX_PROPERTIES: MatrixProperty[] = [
  { id: 'p1', name: 'Các cặp cạnh đối song song', hbh: true, hcn: true, ht: true, hv: true },
  { id: 'p2', name: 'Các cặp cạnh đối bằng nhau', hbh: true, hcn: true, ht: true, hv: true },
  { id: 'p3', name: 'Bốn cạnh bằng nhau', hbh: false, hcn: false, ht: true, hv: true },
  { id: 'p4', name: 'Bốn góc vuông (90°)', hbh: false, hcn: true, ht: false, hv: true },
  { id: 'p5', name: 'Hai đường chéo cắt nhau tại trung điểm', hbh: true, hcn: true, ht: true, hv: true },
  { id: 'p6', name: 'Hai đường chéo bằng nhau', hbh: false, hcn: true, ht: false, hv: true },
  { id: 'p7', name: 'Hai đường chéo vuông góc với nhau', hbh: false, hcn: false, ht: true, hv: true },
  { id: 'p8', name: 'Hai đường chéo là phân giác các góc', hbh: false, hcn: false, ht: true, hv: true },
];

export const SummaryView: React.FC<SummaryViewProps> = ({ onOpenModal }) => {
  // Checkbox matrix state
  const [matrixState, setMatrixState] = useState<Record<string, { hbh: boolean; hcn: boolean; ht: boolean; hv: boolean }>>(() => {
    const init: Record<string, { hbh: boolean; hcn: boolean; ht: boolean; hv: boolean }> = {};
    MATRIX_PROPERTIES.forEach(p => {
      init[p.id] = { hbh: false, hcn: false, ht: false, hv: false };
    });
    return init;
  });

  const [matrixScoreFeedback, setMatrixScoreFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Exit ticket inputs
  const [etR1, setEtR1] = useState<string>('');
  const [etR2, setEtR2] = useState<string>('');
  const [etR3, setEtR3] = useState<string>('');
  const [etSq1, setEtSq1] = useState<string>('');
  const [etSq2, setEtSq2] = useState<string>('');
  const [etDiff, setEtDiff] = useState<string>('');
  const [exitTicketResult, setExitTicketResult] = useState<string | null>(null);

  const toggleCheck = (propId: string, col: 'hbh' | 'hcn' | 'ht' | 'hv') => {
    soundService.playPop();
    setMatrixState(prev => ({
      ...prev,
      [propId]: {
        ...prev[propId],
        [col]: !prev[propId][col]
      }
    }));
  };

  const handleAutoFill = () => {
    soundService.playSuccess();
    const filled: Record<string, { hbh: boolean; hcn: boolean; ht: boolean; hv: boolean }> = {};
    MATRIX_PROPERTIES.forEach(p => {
      filled[p.id] = { hbh: p.hbh, hcn: p.hcn, ht: p.ht, hv: p.hv };
    });
    setMatrixState(filled);
  };

  const handleGradeMatrix = () => {
    let score = 0;
    const total = MATRIX_PROPERTIES.length * 4;

    MATRIX_PROPERTIES.forEach(p => {
      const row = matrixState[p.id];
      if (row.hbh === p.hbh) score++;
      if (row.hcn === p.hcn) score++;
      if (row.ht === p.ht) score++;
      if (row.hv === p.hv) score++;
    });

    if (score === total) {
      soundService.playSuccess();
      setMatrixScoreFeedback({
        isSuccess: true,
        text: `🎉 XUẤT SẮC TUYỆT ĐỐI! Em đạt ${score}/${total} điểm bảng so sánh. Em đã nắm vững toàn bộ hệ thống tứ giác!`
      });
    } else {
      soundService.playIncorrect();
      setMatrixScoreFeedback({
        isSuccess: false,
        text: `Em đạt ${score}/${total} điểm. Hãy kiểm tra kĩ: Hình vuông có mang toàn bộ các dấu tích của hình chữ nhật và hình thoi không nhé!`
      });
    }
  };

  const handleSubmitExitTicket = () => {
    if (!etR1.trim() || !etR2.trim() || !etR3.trim() || !etSq1.trim() || !etSq2.trim() || !etDiff.trim()) {
      soundService.playIncorrect();
      setExitTicketResult('⚠️ Em vui lòng hoàn thành đủ cả 3 phần thử thách 3-2-1 trước khi nộp bài.');
      return;
    }

    soundService.playSuccess();
    setExitTicketResult('🎉 CHÚC MỪNG EM! Đã hoàn thành xuất sắc Exit Ticket!');
    onOpenModal(
      'Chứng nhận hoàn thành bài học',
      'Chúc mừng em đã hoàn thành toàn bộ bài học <strong>Bài 14: Hình thoi và Hình vuông</strong> theo đúng quy trình chuẩn: Quan sát → Thao tác → Dự đoán → Kiểm chứng → Giải thích → Chốt kiến thức → Luyện tập!'
    );
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-[#030712] p-6 sm:p-7 rounded-2xl border-2 border-purple-500/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            CHỐT BÀI & ĐÁNH GIÁ • SGK TRANG 72
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 text-gold-gradient">
            Bảng So Sánh & Exit Ticket 3-2-1
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-1.5 max-w-3xl font-medium">
            Tự kiểm tra toàn diện năng lực hình học trước khi kết thúc tiết học.
          </p>
        </div>
        <button
          onClick={() => soundService.playTeacherSection('summary')}
          className="px-4 py-2.5 rounded-xl bg-[#070c18] hover:bg-slate-700 text-white text-sm font-bold border border-slate-600 transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>🔊</span>
          <span>Nghe tóm tắt</span>
        </button>
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3 flex-wrap gap-2">
          <h3 className="font-black text-white text-lg sm:text-xl">
            Bảng Tương Tác So Sánh 4 Tứ Giác Trọng Tâm
          </h3>
          <button
            onClick={handleAutoFill}
            className="px-4 py-2 text-xs sm:text-sm font-black text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl border border-amber-500/50 transition cursor-pointer"
          >
            Xem đáp án đối chiếu
          </button>
        </div>
        <p className="text-sm text-slate-300 font-medium">
          Đánh dấu tích (✔) vào các tính chất tương ứng với từng loại hình:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse border border-slate-700">
            <thead className="bg-[#070c18] text-slate-200 font-black">
              <tr>
                <th className="p-3.5 text-left border border-slate-700 text-base">Tính chất hình học</th>
                <th className="p-3.5 border border-slate-700 bg-sky-950/60 text-sky-300">Hình bình hành</th>
                <th className="p-3.5 border border-slate-700 bg-indigo-950/60 text-indigo-300">Hình chữ nhật</th>
                <th className="p-3.5 border border-slate-700 bg-teal-950/60 text-teal-300">Hình thoi</th>
                <th className="p-3.5 border border-slate-700 bg-emerald-950/60 text-emerald-300">Hình vuông</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-200 font-bold">
              {MATRIX_PROPERTIES.map((prop, i) => {
                const row = matrixState[prop.id];
                return (
                  <tr key={prop.id} className={i % 2 === 0 ? 'bg-[#070c18]' : 'bg-[#0c1427]'}>
                    <td className="p-3 text-left border border-slate-700 font-extrabold text-slate-100">
                      {prop.name}
                    </td>
                    <td className="p-3 border border-slate-700">
                      <input
                        type="checkbox"
                        checked={row?.hbh || false}
                        onChange={() => toggleCheck(prop.id, 'hbh')}
                        className="accent-sky-500 w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border border-slate-700">
                      <input
                        type="checkbox"
                        checked={row?.hcn || false}
                        onChange={() => toggleCheck(prop.id, 'hcn')}
                        className="accent-indigo-500 w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border border-slate-700">
                      <input
                        type="checkbox"
                        checked={row?.ht || false}
                        onChange={() => toggleCheck(prop.id, 'ht')}
                        className="accent-teal-500 w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border border-slate-700">
                      <input
                        type="checkbox"
                        checked={row?.hv || false}
                        onChange={() => toggleCheck(prop.id, 'hv')}
                        className="accent-emerald-500 w-5 h-5 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGradeMatrix}
            className="px-6 py-3 rounded-xl gold-btn text-night-950 font-black text-sm sm:text-base shadow-lg transition cursor-pointer"
          >
            Chấm điểm bảng so sánh
          </button>
        </div>

        {matrixScoreFeedback && (
          <div
            className={`p-4 rounded-xl text-sm sm:text-base font-black border-2 ${
              matrixScoreFeedback.isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {matrixScoreFeedback.text}
          </div>
        )}
      </div>

      {/* EXIT TICKET 3-2-1 */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
          <span className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 font-black text-base flex items-center justify-center">
            🎯
          </span>
          <h3 className="font-black text-white text-lg sm:text-xl">
            Thử Thách Exit Ticket: 3 - 2 - 1
          </h3>
        </div>

        <div className="space-y-4 text-sm sm:text-base font-medium">
          {/* 3 Signs of Rhombus */}
          <div className="p-5 bg-[#070c18] rounded-2xl border border-slate-700 space-y-2">
            <label className="font-black text-amber-300 block">
              3. Kể tên 3 điều kiện để biến một hình bình hành thành hình thoi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <input
                type="text"
                value={etR1}
                onChange={(e) => setEtR1(e.target.value)}
                placeholder="Điều kiện 1 (cạnh kề...)"
                className="p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
              />
              <input
                type="text"
                value={etR2}
                onChange={(e) => setEtR2(e.target.value)}
                placeholder="Điều kiện 2 (đường chéo...)"
                className="p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
              />
              <input
                type="text"
                value={etR3}
                onChange={(e) => setEtR3(e.target.value)}
                placeholder="Điều kiện 3 (phân giác...)"
                className="p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
              />
            </div>
          </div>

          {/* 2 Properties of Square Diagonals */}
          <div className="p-5 bg-[#070c18] rounded-2xl border border-slate-700 space-y-2">
            <label className="font-black text-sky-300 block">
              2. Nêu 2 tính chất đặc trưng nhất của hai đường chéo hình vuông:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <input
                type="text"
                value={etSq1}
                onChange={(e) => setEtSq1(e.target.value)}
                placeholder="Tính chất 1 (về độ dài...)"
                className="p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
              />
              <input
                type="text"
                value={etSq2}
                onChange={(e) => setEtSq2(e.target.value)}
                placeholder="Tính chất 2 (về góc giao nhau...)"
                className="p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
              />
            </div>
          </div>

          {/* 1 Distinguishing statement */}
          <div className="p-5 bg-[#070c18] rounded-2xl border border-slate-700 space-y-2">
            <label className="font-black text-emerald-300 block">
              1. Điều gì giúp em phân biệt một hình thoi với một hình vuông?
            </label>
            <input
              type="text"
              value={etDiff}
              onChange={(e) => setEtDiff(e.target.value)}
              placeholder="Hình thoi cần thêm điều kiện gì để thành hình vuông?"
              className="w-full p-3 bg-[#111c38] rounded-xl border border-slate-600 text-sm text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
          {exitTicketResult && (
            <span className="text-sm sm:text-base font-black">
              {exitTicketResult}
            </span>
          )}
          <button
            onClick={handleSubmitExitTicket}
            className="px-6 py-3 rounded-xl gold-btn text-night-950 font-black text-sm sm:text-base shadow-lg cursor-pointer ml-auto"
          >
            Nộp Exit Ticket
          </button>
        </div>
      </div>
    </section>
  );
};
