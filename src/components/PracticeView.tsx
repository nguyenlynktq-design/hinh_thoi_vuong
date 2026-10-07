import React, { useState } from 'react';
import { soundService } from '../services/soundService';

interface PracticeViewProps {
  onOpenAiVerification: (claimKey: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onOpenAiVerification }) => {
  const [activeLevel, setActiveLevel] = useState<number>(1);

  // Feedback states
  const [q11Feedback, setQ11Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [q12Feedback, setQ12Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [q21Feedback, setQ21Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [q22Feedback, setQ22Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [q31Feedback, setQ31Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Question 3.1 Simulation Mode
  const [sim330Mode, setSim330Mode] = useState<'normal' | 'iso' | 'right_iso'>('normal');

  // Question 3.2 Input calculation
  const [inputAB, setInputAB] = useState<string>('');
  const [inputBC, setInputBC] = useState<string>('');
  const [showHint333, setShowHint333] = useState<boolean>(false);
  const [q32Feedback, setQ32Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const handleSelectLevel = (lvl: number) => {
    soundService.playPop();
    setActiveLevel(lvl);
  };

  // Check handlers
  const handleQ11 = (choice: string) => {
    if (choice === 'b') {
      soundService.playSuccess();
      setQ11Feedback({
        isCorrect: true,
        text: '🎉 <strong>CHÍNH XÁC!</strong> Theo định nghĩa chuẩn SGK Toán 8 (trang 67): <em>Hình thoi là tứ giác có bốn cạnh bằng nhau.</em>'
      });
    } else {
      soundService.playIncorrect();
      setQ11Feedback({
        isCorrect: false,
        text: '⚠️ <strong>Chưa chính xác:</strong> Bốn góc bằng nhau là hình chữ nhật; hai đường chéo bằng nhau là hình thang cân hoặc hình chữ nhật. Hình thoi định nghĩa theo <strong>4 cạnh bằng nhau</strong>.'
      });
    }
  };

  const handleQ12 = (choice: string) => {
    if (choice === 'd') {
      soundService.playSuccess();
      setQ12Feedback({
        isCorrect: true,
        text: '🎉 <strong>XUẤT SẮC! (BÀI 3.29 SGK)</strong><br />• Hai đường chéo vuông góc tại trung điểm mỗi đường → Là Hình Thoi.<br />• Hai đường chéo bằng nhau tại trung điểm mỗi đường → Là Hình Chữ Nhật.<br />👉 Tứ giác vừa là hình thoi, vừa là hình chữ nhật chính là <strong>HÌNH VUÔNG</strong>.'
      });
    } else {
      soundService.playIncorrect();
      setQ12Feedback({
        isCorrect: false,
        text: '💡 <em>Gợi ý:</em> Đáp án của em mới chỉ đúng với một nửa giả thiết. Đừng quên hai đường chéo <strong>VỪA vuông góc VỪA bằng nhau</strong> tại trung điểm nhé!'
      });
    }
  };

  const handleQ21 = (choice: string) => {
    if (choice === 'c') {
      soundService.playSuccess();
      setQ21Feedback({
        isCorrect: true,
        text: '🎉 <strong>CHÍNH XÁC!</strong> Hình bình hành có hai đường chéo bằng nhau (AC = BD) là <strong>Hình Chữ Nhật</strong> chứ không phải hình thoi!'
      });
    } else {
      soundService.playIncorrect();
      setQ21Feedback({
        isCorrect: false,
        text: '⚠️ <strong>Chưa đúng:</strong> Điều kiện này là dấu hiệu ĐỦ để tạo thành hình thoi. Đề bài hỏi điều kiện <strong>KHÔNG ĐỦ</strong> (tức là điều kiện dẫn tới hình khác).'
      });
    }
  };

  const handleQ22 = (choice: string) => {
    if (choice === 'b') {
      soundService.playSuccess();
      setQ22Feedback({
        isCorrect: true,
        text: '🎉 <strong>RẤT CHUẨN!</strong> Theo Định lí 4: Hình thoi có 2 đường chéo bằng nhau thì trở thành hình chữ nhật. Tứ giác vừa có 4 cạnh bằng nhau (hình thoi) vừa có 4 góc vuông (hình chữ nhật) là <strong>Hình Vuông</strong>.'
      });
    } else {
      soundService.playIncorrect();
      setQ22Feedback({
        isCorrect: false,
        text: '⚠️ <strong>Chưa chính xác:</strong> Hai đường chéo hình thoi hoàn toàn có thể bằng nhau (chính là khi các góc bằng 90° để tạo thành hình vuông). Bạn học sinh đã nói hoàn toàn đúng!'
      });
    }
  };

  const handleQ31 = (choice: string) => {
    if (choice === 'b') {
      soundService.playSuccess();
      setQ31Feedback({
        isCorrect: true,
        text: '🎉 <strong>HOÀN TOÀN CHÍNH XÁC! (BÀI 3.30a SGK)</strong><br />Vì DE // AC và DF // AB nên AEDF là hình bình hành. Để hình bình hành AEDF là hình thoi thì đường chéo AD phải là tia phân giác của góc BAC.'
      });
    } else {
      soundService.playIncorrect();
      setQ31Feedback({
        isCorrect: false,
        text: '💡 <em>Gợi ý:</em> Hãy nhớ dấu hiệu: <strong>Hình bình hành có một đường chéo là phân giác</strong> của một góc thì là hình thoi. Đường chéo đó chính là AD!'
      });
    }
  };

  const handleCheckQ32 = () => {
    const ab = parseFloat(inputAB);
    const bc = parseFloat(inputBC);
    if (ab === 6 && bc === 12) {
      soundService.playSuccess();
      setQ32Feedback({
        isCorrect: true,
        text: '🎉 <strong>XUẤT SẮC TUYỆT ĐỐI! (BÀI 3.33 SGK)</strong><br />• Lập luận: Tam giác AMD vuông cân tại M ⇒ AB = BM = 1/2 BC (tỉ lệ chiều dài gấp đôi chiều rộng).<br />• Nửa chu vi: AB + BC = 36 : 2 = 18 cm.<br />• Ta có: AB + 2AB = 18 ⇒ 3AB = 18 ⇒ <strong>AB = 6 cm</strong> và <strong>BC = 12 cm</strong>!'
      });
    } else {
      soundService.playIncorrect();
      setQ32Feedback({
        isCorrect: false,
        text: '⚠️ <strong>Chưa chính xác:</strong> Em hãy bấm nút "Xem gợi ý suy luận" để khai thác tính chất tam giác vuông cân và nửa chu vi 18 cm nhé!'
      });
    }
  };

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Level Header */}
      <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full badge-gold text-xs sm:text-sm font-black uppercase tracking-wider">
              PHÂN HÓA NĂNG LỰC TOÁN HỌC
            </span>
            <button
              onClick={() => onOpenAiVerification('practice_ai')}
              className="text-sm font-extrabold text-sky-400 hover:underline flex items-center gap-1.5 ml-2 cursor-pointer"
            >
              <span>🔍 Phản biện AI</span>
            </button>
            <button
              onClick={() => soundService.playTeacherSection('practice')}
              className="p-1 text-slate-300 hover:text-amber-300 text-base cursor-pointer ml-1"
              title="Nghe hướng dẫn luyện tập"
            >
              🔊
            </button>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1.5 text-gold-gradient">
            Luyện Tập: Nhận Biết – Thông Hiểu – Vận Dụng
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-medium">
            Hệ thống bài tập phân cấp bám sát SGK Kết nối tri thức (mỗi mức độ gồm đúng 2 câu hỏi thực hành tương tác).
          </p>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex items-center gap-2 bg-[#070c18] p-1.5 rounded-2xl border-2 border-slate-700 text-sm font-black flex-wrap">
          {[
            { lvl: 1, label: '1. Nhận biết (2 câu)' },
            { lvl: 2, label: '2. Thông hiểu (2 câu)' },
            { lvl: 3, label: '3. Vận dụng (2 câu)' },
          ].map((item) => (
            <button
              key={item.lvl}
              onClick={() => handleSelectLevel(item.lvl)}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer font-bold ${
                activeLevel === item.lvl
                  ? 'gold-btn text-[#030712] font-black shadow-md'
                  : 'text-slate-300 hover:bg-[#111c38]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEVEL 1: NHẬN BIẾT */}
      {activeLevel === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm sm:text-base font-black text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <span>🌟 MỨC ĐỘ 1: NHẬN BIẾT</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-600">
                Chuẩn 2 Câu
              </span>
            </span>
            <span className="text-sm text-slate-300 font-bold">
              Mục tiêu: Nhận diện định nghĩa và tính chất cơ bản
            </span>
          </div>

          {/* Câu 1.1 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <span className="inline-block px-3 py-1 rounded-lg bg-sky-950 text-sky-300 font-black text-xs mb-2 border border-sky-600">
                CÂU 1.1 • NHẬN BIẾT ĐỊNH NGHĨA
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Trong các khẳng định sau về hình thoi, khẳng định nào sau đây là ĐÚNG theo định nghĩa SGK?
              </h3>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Quan sát kỹ dấu hiệu đặc trưng về các cạnh của hình thoi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
              {[
                { id: 'a', text: 'A. Hình thoi là tứ giác có 4 góc bằng nhau.' },
                { id: 'b', text: 'B. Hình thoi là tứ giác có bốn cạnh bằng nhau.' },
                { id: 'c', text: 'C. Hình thoi là tứ giác có hai đường chéo bằng nhau.' },
                { id: 'd', text: 'D. Hình thoi là hình thang cân có hai cạnh đáy bằng nhau.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ11(opt.id)}
                  className="p-4 rounded-2xl border-2 border-slate-700 bg-[#070c18] hover:bg-slate-800 text-left font-bold text-slate-200 transition cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {q11Feedback && (
              <div
                className={`text-sm sm:text-base p-4 rounded-2xl font-bold border-2 leading-relaxed ${
                  q11Feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: q11Feedback.text }}
              />
            )}
          </div>

          {/* Câu 1.2 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <span className="inline-block px-3 py-1 rounded-lg bg-sky-950 text-sky-300 font-black text-xs mb-2 border border-sky-600">
                CÂU 1.2 • NHẬN BIẾT ĐƯỜNG CHÉO (BÀI 3.29 SGK)
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Tứ giác có hai đường chéo bằng nhau và vuông góc với nhau tại trung điểm của mỗi đường là hình gì?
              </h3>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Kết hợp dấu hiệu của hình thoi và hình chữ nhật.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
              {[
                { id: 'a', text: 'A. Hình bình hành' },
                { id: 'b', text: 'B. Hình chữ nhật' },
                { id: 'c', text: 'C. Hình thoi' },
                { id: 'd', text: 'D. Hình vuông' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ12(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                    opt.id === 'd'
                      ? 'border-amber-400 bg-amber-500/15 hover:bg-amber-500/25 font-black text-amber-300 shadow-lg'
                      : 'border-slate-700 bg-[#070c18] hover:bg-slate-800 font-bold text-slate-200'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {q12Feedback && (
              <div
                className={`text-sm sm:text-base p-4 rounded-2xl font-bold border-2 leading-relaxed ${
                  q12Feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: q12Feedback.text }}
              />
            )}
          </div>
        </div>
      )}

      {/* LEVEL 2: THÔNG HIỂU */}
      {activeLevel === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>⚡ MỨC ĐỘ 2: THÔNG HIỂU</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600">
                Chuẩn 2 Câu
              </span>
            </span>
            <span className="text-sm text-slate-300 font-bold">
              Mục tiêu: Hiểu bản chất các dấu hiệu nhận biết và mối liên hệ phả hệ
            </span>
          </div>

          {/* Câu 2.1 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <span className="inline-block px-3 py-1 rounded-lg bg-amber-950 text-amber-300 font-black text-xs mb-2 border border-amber-600">
                CÂU 2.1 • DẤU HIỆU NHẬN BIẾT HÌNH THOI
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Cho hình bình hành ABCD. Điều kiện nào dưới đây KHÔNG ĐỦ để kết luận ABCD là hình thoi?
              </h3>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Dựa vào 3 dấu hiệu nhận biết của Định lí 2 SGK trang 69.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
              {[
                { id: 'a', text: 'A. Hai cạnh kề bằng nhau: AB = AD' },
                { id: 'b', text: 'B. Hai đường chéo vuông góc: AC ⟂ BD' },
                { id: 'c', text: 'C. Hai đường chéo bằng nhau: AC = BD' },
                { id: 'd', text: 'D. Một đường chéo là phân giác: AC là tia phân giác góc DAB' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ21(opt.id)}
                  className="p-4 rounded-2xl border-2 border-slate-700 bg-[#070c18] hover:bg-slate-800 text-left font-bold text-slate-200 transition cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {q21Feedback && (
              <div
                className={`text-sm sm:text-base p-4 rounded-2xl font-bold border-2 leading-relaxed ${
                  q21Feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: q21Feedback.text }}
              />
            )}
          </div>

          {/* Câu 2.2 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3">
              <span className="inline-block px-3 py-1 rounded-lg bg-amber-950 text-amber-300 font-black text-xs mb-2 border border-amber-600">
                CÂU 2.2 • DẤU HIỆU NHẬN BIẾT HÌNH VUÔNG
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Một bạn học sinh khẳng định: "Hình thoi có hai đường chéo bằng nhau là hình vuông". Bạn đó nói đúng hay sai? Vì sao?
              </h3>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Vận dụng Định lí 4 về dấu hiệu nhận biết hình vuông (SGK trang 71).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
              {[
                { id: 'a', text: 'A. Sai, vì hình thoi có hai đường chéo bằng nhau chỉ là hình chữ nhật.' },
                { id: 'b', text: 'B. Đúng, vì hình thoi có hai đường chéo bằng nhau thì vừa có 4 cạnh bằng nhau vừa có 4 góc vuông nên là hình vuông.' },
                { id: 'c', text: 'C. Sai, vì hai đường chéo hình thoi không bao giờ bằng nhau được.' },
                { id: 'd', text: 'D. Sai, cần thêm điều kiện một góc vuông nữa mới đủ.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleQ22(opt.id)}
                  className="p-4 rounded-2xl border-2 border-slate-700 bg-[#070c18] hover:bg-slate-800 text-left font-bold text-slate-200 transition cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {q22Feedback && (
              <div
                className={`text-sm sm:text-base p-4 rounded-2xl font-bold border-2 leading-relaxed ${
                  q22Feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: q22Feedback.text }}
              />
            )}
          </div>
        </div>
      )}

      {/* LEVEL 3: VẬN DỤNG */}
      {activeLevel === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm sm:text-base font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <span>🔥 MỨC ĐỘ 3: VẬN DỤNG</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600">
                Chuẩn 2 Câu
              </span>
            </span>
            <span className="text-sm text-slate-300 font-bold">
              Mục tiêu: Lập luận toán học, suy luận hình học động và giải toán định lượng
            </span>
          </div>

          {/* Câu 3.1: Bài 3.30 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3 flex flex-col sm:flex-row justify-between items-start gap-3">
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-rose-950 text-rose-300 font-black text-xs mb-2 border border-rose-600">
                  CÂU 3.1 • VẬN DỤNG SGK BÀI 3.30
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Cho tam giác ABC, điểm D nằm trên BC. Kẻ DE // AC và DF // AB. Khi nào tứ giác AEDF là HÌNH THOI?
                </h3>
                <p className="text-sm text-slate-300 mt-1 font-medium">
                  Bấm chuyển đổi trạng thái mô phỏng tam giác ABC để kiểm chứng trực quan:
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    soundService.playPop();
                    setSim330Mode('normal');
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl border font-black transition cursor-pointer ${
                    sim330Mode === 'normal'
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-[#111c38] text-slate-200 border-slate-600'
                  }`}
                >
                  ABC Thường
                </button>
                <button
                  onClick={() => {
                    soundService.playPop();
                    setSim330Mode('iso');
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl border font-black transition cursor-pointer ${
                    sim330Mode === 'iso'
                      ? 'bg-sky-500 text-slate-950 border-sky-300'
                      : 'bg-sky-950 text-sky-200 border-sky-600'
                  }`}
                >
                  ABC Cân tại A & AD phân giác
                </button>
                <button
                  onClick={() => {
                    soundService.playPop();
                    setSim330Mode('right_iso');
                  }}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl border font-black transition cursor-pointer ${
                    sim330Mode === 'right_iso'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-emerald-950 text-emerald-200 border-emerald-600'
                  }`}
                >
                  ABC Vuông cân tại A
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-[#070c18] rounded-2xl p-4 border-2 border-slate-700 flex flex-col items-center">
                <svg className="w-full h-72" viewBox="-160 -130 320 230">
                  {sim330Mode === 'normal' && (
                    <>
                      <polygon points="0,-100 -120,80 120,80" fill="none" stroke="#64748b" strokeWidth="2.5" />
                      <polygon points="0,-100 -60,-10 0,80 60,-10" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="3" />
                      <line x1="0" y1="-100" x2="0" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                    </>
                  )}
                  {sim330Mode === 'iso' && (
                    <>
                      <polygon points="0,-100 -110,80 110,80" fill="none" stroke="#64748b" strokeWidth="2.5" />
                      <polygon points="0,-100 -55,-10 0,80 55,-10" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="3.5" />
                      <line x1="0" y1="-100" x2="0" y2="80" stroke="#f59e0b" strokeWidth="2.5" />
                    </>
                  )}
                  {sim330Mode === 'right_iso' && (
                    <>
                      <polygon points="0,-100 -100,0 100,0" fill="none" stroke="#64748b" strokeWidth="2.5" />
                      <polygon points="0,-100 -50,-50 0,0 50,-50" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="3.5" />
                      <line x1="0" y1="-100" x2="0" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
                      <path d="M -15,-85 L 0,-70 L 15,-85" fill="none" stroke="#10b981" strokeWidth="2" />
                    </>
                  )}

                  {/* Vertices */}
                  <circle cx="0" cy="-100" r="5" fill="#ffffff" /><text x="-6" y="-112" fontWeight="900" fontSize="15" fill="#fff">A</text>
                  <circle cx="-120" cy="80" r="5" fill="#ffffff" /><text x="-140" y="86" fontWeight="900" fontSize="15" fill="#fff">B</text>
                  <circle cx="120" cy="80" r="5" fill="#ffffff" /><text x="130" y="86" fontWeight="900" fontSize="15" fill="#fff">C</text>
                  <circle cx="0" cy={sim330Mode === 'right_iso' ? 0 : 80} r="5" fill="#ef4444" /><text x="-6" y={sim330Mode === 'right_iso' ? 20 : 102} fontWeight="900" fontSize="15" fill="#f87171">D</text>
                  <circle cx="-60" cy={sim330Mode === 'right_iso' ? -50 : -10} r="5" fill="#f59e0b" /><text x="-80" y={sim330Mode === 'right_iso' ? -50 : -10} fontWeight="900" fontSize="15" fill="#f59e0b">E</text>
                  <circle cx="60" cy={sim330Mode === 'right_iso' ? -50 : -10} r="5" fill="#f59e0b" /><text x="70" y={sim330Mode === 'right_iso' ? -50 : -10} fontWeight="900" fontSize="15" fill="#f59e0b">F</text>
                </svg>

                <span className="text-sm text-amber-300 font-black mt-2 text-center">
                  {sim330Mode === 'normal' && 'ABC thường: AEDF là Hình Bình Hành (có DE // AC và DF // AB)'}
                  {sim330Mode === 'iso' && 'ABC cân tại A, D là chân phân giác: AEDF là HÌNH THOI (HBH có đường chéo AD là phân giác)'}
                  {sim330Mode === 'right_iso' && 'ABC vuông cân tại A: AEDF là HÌNH VUÔNG (Hình thoi có góc BAC = 90°)'}
                </span>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <span className="text-sm font-bold text-slate-300">
                  Chọn điều kiện chuẩn xác để AEDF là hình thoi:
                </span>
                <div className="space-y-2 text-sm sm:text-base">
                  {[
                    { id: 'a', text: 'A. D là trung điểm cạnh BC' },
                    { id: 'b', text: 'B. D là chân đường phân giác của góc A (AD là phân giác ∠BAC)' },
                    { id: 'c', text: 'C. Tam giác ABC là tam giác đều' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleQ31(opt.id)}
                      className="w-full p-3.5 rounded-xl border-2 border-slate-700 bg-[#070c18] hover:bg-slate-800 text-left font-bold text-slate-200 transition cursor-pointer"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                {q31Feedback && (
                  <div
                    className={`text-sm sm:text-base p-3.5 rounded-xl font-bold border-2 leading-relaxed ${
                      q31Feedback.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                    dangerouslySetInnerHTML={{ __html: q31Feedback.text }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Câu 3.2: Bài 3.33 */}
          <div className="bg-[#0c1427] p-6 rounded-2xl border-2 border-slate-700 shadow-xl space-y-5">
            <div className="border-b border-slate-700 pb-3 flex justify-between items-start">
              <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-rose-950 text-rose-300 font-black text-xs mb-2 border border-rose-600">
                  CÂU 3.2 • VẬN DỤNG ĐỊNH LƯỢNG (BÀI 3.33 SGK)
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Hình chữ nhật ABCD có chu vi bằng 36 cm. Gọi M là trung điểm BC, biết MA ⟂ MD. Tính độ dài các cạnh AB và BC.
                </h3>
                <p className="text-sm text-slate-300 mt-1 font-medium">
                  Nhập số đo tính được vào hai ô bên dưới rồi bấm "Kiểm tra đáp số":
                </p>
              </div>
              <button
                onClick={() => onOpenAiVerification('ex333_ai')}
                className="text-sm font-black text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>🔍 Phản biện AI</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 space-y-2">
                <label className="block text-sm font-bold text-slate-200">
                  Độ dài cạnh AB (chiều rộng):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputAB}
                    onChange={(e) => setInputAB(e.target.value)}
                    placeholder="Nhập số cm..."
                    className="w-full p-3 bg-[#111c38] border-2 border-slate-600 rounded-xl text-white font-mono text-base focus:outline-amber-400"
                  />
                  <span className="text-slate-300 font-bold">cm</span>
                </div>
              </div>
              <div className="p-4 bg-[#070c18] rounded-xl border border-slate-700 space-y-2">
                <label className="block text-sm font-bold text-slate-200">
                  Độ dài cạnh BC (chiều dài):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputBC}
                    onChange={(e) => setInputBC(e.target.value)}
                    placeholder="Nhập số cm..."
                    className="w-full p-3 bg-[#111c38] border-2 border-slate-600 rounded-xl text-white font-mono text-base focus:outline-amber-400"
                  />
                  <span className="text-slate-300 font-bold">cm</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCheckQ32}
                className="px-6 py-3 rounded-xl gold-btn text-night-950 font-black text-sm sm:text-base shadow-lg transition cursor-pointer"
              >
                Kiểm tra đáp số Câu 3.2
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  setShowHint333(!showHint333);
                }}
                className="px-4 py-3 rounded-xl bg-[#111c38] hover:bg-slate-700 text-sky-300 font-bold text-sm border border-slate-600 transition cursor-pointer"
              >
                💡 Xem gợi ý suy luận
              </button>
            </div>

            {showHint333 && (
              <div className="p-4 bg-[#070c18] rounded-xl border border-sky-500/40 text-sm text-slate-200 leading-relaxed font-medium">
                <strong className="text-amber-300 font-extrabold">Gợi ý hình học:</strong> Do ΔABM = ΔDCM (c-g-c) nên MA = MD. Khi đó tam giác AMD vuông cân tại M, suy ra ∠AMB = ∠DMC = 45°. Do đó tam giác ABM vuông cân tại B ⇒ AB = BM = 1/2 BC (chiều dài gấp đôi chiều rộng).
              </div>
            )}

            {q32Feedback && (
              <div
                className={`text-sm sm:text-base p-4 rounded-xl font-bold border-2 leading-relaxed ${
                  q32Feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
                dangerouslySetInnerHTML={{ __html: q32Feedback.text }}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
