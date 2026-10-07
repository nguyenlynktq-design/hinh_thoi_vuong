const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const SFX_DIR = path.join(OUTPUT_DIR, 'sfx');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(SFX_DIR)) fs.mkdirSync(SFX_DIR, { recursive: true });

function downloadChunk(text) {
  return new Promise((resolve, reject) => {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(text.trim()) + '&tl=vi&client=tw-ob';
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for text: ${text}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

function splitTextIntoSentences(text, maxLen = 120) {
  const parts = text.split(/([.,;!?\n]+)/);
  const chunks = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if ((current + part).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    } else {
      current += part;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(c => c.length > 0 && !/^[.,;!?\s]+$/.test(c));
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generateMaleSpeechFile(filename, text) {
  console.log(`\nĐang tạo audio giọng Nam thầy giáo: ${filename}...`);
  const sentences = splitTextIntoSentences(text);
  const buffers = [];

  for (const sentence of sentences) {
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await sleep(250);
        const buf = await downloadChunk(sentence);
        buffers.push(buf);
        success = true;
        break;
      } catch (err) {
        console.warn(`Thử lại lần ${attempt} cho câu: "${sentence}" (${err.message})`);
        await sleep(1000);
      }
    }
    if (!success) {
      console.error(`Thất bại khi tải đoạn: ${sentence}`);
    }
  }

  const rawBuffer = Buffer.concat(buffers);
  const rawPath = path.join(OUTPUT_DIR, `raw_${filename}`);
  fs.writeFileSync(rawPath, rawBuffer);

  // Xử lý bộ lọc giọng Nam rõ ràng, dứt khoát, âm trầm đĩnh đạc của thầy giáo dạy Toán
  const finalPath = path.join(OUTPUT_DIR, filename);
  try {
    execSync(
      `ffmpeg -y -i "${rawPath}" -af "rubberband=pitch=0.76,equalizer=f=200:t=q:w=1.2:g=4,equalizer=f=3200:t=q:w=1:g=2.5,compand=attacks=0:decays=0.08:points=-80/-80|-20/-10|0/-3,loudnorm" -b:a 96k "${finalPath}" 2>/dev/null`
    );
    fs.unlinkSync(rawPath);
    const size = fs.statSync(finalPath).size;
    console.log(`-> Đã lưu ${filename} giọng Nam dứt khoát (${size} bytes)`);
  } catch (err) {
    console.warn(`Fallback copy cho ${filename}: ${err.message}`);
    fs.renameSync(rawPath, finalPath);
  }
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
    file: 'voice_summary.mp3',
    text: 'Tổng kết bài học: Thầy mời các em hoàn thành bảng so sánh bốn tứ giác trọng tâm và thử thách Exit Ticket 3 2 1 để khắc sâu toàn bộ kiến thức hôm nay.'
  }
];

async function main() {
  for (const item of lessons) {
    await generateMaleSpeechFile(item.file, item.text);
  }
  console.log('\n=== TẤT CẢ FILE ÂM THANH GIỌNG NAM THẦY GIÁO ĐÃ ĐƯỢC TẠO HOÀN TẤT! ===');
}

main().catch(console.error);
