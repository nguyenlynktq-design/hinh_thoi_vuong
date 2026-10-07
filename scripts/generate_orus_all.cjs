const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY!");
  process.exit(1);
}

const lessons = [
  {
    file: 'voice_teacher_test.mp3',
    text: 'Chào các em học sinh thân yêu! Thầy là giáo viên dạy Toán 8. Hôm nay chúng ta sẽ cùng khám phá vẻ đẹp hình học của hình thoi và hình vuông nhé!'
  },
  {
    file: 'voice_home.mp3',
    text: 'Chào mừng các em đến với Bài 14: Hình thoi và Hình vuông trong bộ sách Toán 8 Kết nối tri thức. Phương pháp học gồm quan sát, thao tác, dự đoán và kiểm chứng logic.'
  },
  {
    file: 'voice_intro.mp3',
    text: 'Chào các em! Chúng ta bắt đầu với hoạt động Khởi động gấp giấy trang 67. Gấp đôi tờ giấy hai lần liên tiếp tạo góc vuông O. Cắt theo đoạn thẳng A B rồi mở bung ra. Nếu O A khác O B, ta nhận được hình thoi. Khi O A bằng O B, ta nhận được hình vuông hoàn hảo.'
  },
  {
    file: 'voice_rhombus_def.mp3',
    text: 'Mục một: Hình thoi. Định nghĩa: Hình thoi là tứ giác có bốn cạnh bằng nhau. Do có các cặp cạnh đối bằng nhau, hình thoi cũng là một hình bình hành, nên nó có đầy đủ các tính chất của hình bình hành.'
  },
  {
    file: 'voice_rhombus_thm1.mp3',
    text: 'Định lí 1: Trong hình thoi, hai đường chéo vuông góc với nhau; và hai đường chéo là các đường phân giác của các góc trong hình thoi. Các em hãy thử kéo các đỉnh A và B trên màn hình để kiểm chứng góc A O B luôn luôn bằng 90 độ.'
  },
  {
    file: 'voice_rhombus_signs.mp3',
    text: 'Dấu hiệu nhận biết hình thoi theo Định lí 2: Một hình bình hành là hình thoi nếu có hai cạnh kề bằng nhau; hoặc có hai đường chéo vuông góc với nhau; hoặc có một đường chéo là phân giác của một góc.'
  },
  {
    file: 'voice_square_def.mp3',
    text: 'Mục hai: Hình vuông. Định nghĩa: Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau. Hình vuông vừa là hình chữ nhật, lại vừa là hình thoi. Đây là hình hoàn hảo nhất trong gia đình tứ giác!'
  },
  {
    file: 'voice_square_thm3.mp3',
    text: 'Định lí 3: Trong hình vuông, hai đường chéo bằng nhau, vuông góc với nhau, cắt nhau tại trung điểm của mỗi đường và là các đường phân giác của các góc. Đường chéo hình vuông hội tụ toàn bộ phẩm chất của cả hình chữ nhật và hình thoi.'
  },
  {
    file: 'voice_practice.mp3',
    text: 'Hệ thống luyện tập ba mức độ: Mức một Nhận biết; Mức hai Thông hiểu; và Mức ba Vận dụng. Mỗi mức độ gồm hai câu hỏi tương tác. Thầy mời các em quan sát hình động và tự tin chinh phục từng câu hỏi nhé!'
  },
  {
    file: 'voice_lab.mp3',
    text: 'Chào mừng các em đến với Phòng thí nghiệm Tứ giác Sandbox! Tại đây, các em có thể tự do kéo bốn đỉnh A, B, C, D. Máy quét cảm biến sẽ tự động nhận diện các cặp cạnh song song, góc vuông và hai đường chéo, giúp các em quan sát sự biến đổi sinh động giữa các hình.'
  },
  {
    file: 'voice_summary.mp3',
    text: 'Tổng kết bài học: Thầy mời các em hoàn thành bảng so sánh bốn tứ giác trọng tâm và thử thách Exit Ticket 3 2 1 để củng cố toàn bộ kiến thức hôm nay.'
  }
];

async function generateOrusAudio(item) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{
      parts: [{
        text: `Đọc bằng tiếng Việt giọng nam thầy giáo Orus rõ ràng, dứt khoát, to, tròn vành rõ chữ, truyền cảm: ${item.text}`
      }]
    }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Orus" }
        }
      }
    }
  };

  console.log(`Đang gọi Gemini TTS Orus cho: ${item.file}...`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const base64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64) {
        throw new Error(JSON.stringify(data.error || "No audio returned"));
      }

      const pcmBuf = Buffer.from(base64, "base64");
      const tempPcm = path.join("/tmp", `orus_${item.file}.pcm`);
      const finalMp3 = path.join(OUTPUT_DIR, item.file);

      fs.writeFileSync(tempPcm, pcmBuf);
      // Áp dụng bộ lọc âm lượng chuẩn loudnorm và làm rõ dải tần giọng nói 1-4kHz
      execSync(`ffmpeg -y -f s16le -ar 24000 -ac 1 -i "${tempPcm}" -af "volume=1.4,equalizer=f=3000:t=q:w=1:g=2,loudnorm" -b:a 128k "${finalMp3}" 2>/dev/null`);
      fs.unlinkSync(tempPcm);

      const size = fs.statSync(finalMp3).size;
      console.log(`-> Thành công: ${item.file} (${size} bytes)`);
      return;
    } catch (err) {
      console.warn(`Thử lại ${attempt}/3 cho ${item.file}:`, err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.error(`Thất bại khi tạo ${item.file}`);
}

async function main() {
  console.log("=== BẮT ĐẦU TẠO TẤT CẢ FILE GIỌNG NAM ORUS (TAB 1 ĐẾN TAB 6) ===");
  for (const item of lessons) {
    await generateOrusAudio(item);
    await new Promise(r => setTimeout(r, 800));
  }
  console.log("=== HOÀN TẤT TOÀN BỘ 11 FILE ÂM THANH GIỌNG NAM ORUS! ===");
}

main().catch(console.error);
