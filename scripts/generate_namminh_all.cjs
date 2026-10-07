const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "audio");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const lessons = [
  {
    file: "voice_teacher_test.mp3",
    text: "Chào các em học sinh thân yêu! Thầy là giáo viên dạy Toán 8. Hôm nay chúng ta sẽ cùng khám phá vẻ đẹp hình học của hình thoi và hình vuông nhé!"
  },
  {
    file: "voice_home.mp3",
    text: "Chào mừng các em đến với Bài 14: Hình thoi và Hình vuông trong bộ sách Toán 8 Kết nối tri thức. Phương pháp học gồm quan sát, thao tác, dự đoán và kiểm chứng logic."
  },
  {
    file: "voice_intro.mp3",
    text: "Chào các em! Chúng ta bắt đầu với hoạt động Khởi động gấp giấy trang 67. Gấp đôi tờ giấy hai lần liên tiếp tạo góc vuông O. Cắt theo đoạn thẳng A B rồi mở bung ra. Nếu O A khác O B, ta nhận được hình thoi. Khi O A bằng O B, ta nhận được hình vuông hoàn hảo."
  },
  {
    file: "voice_rhombus_def.mp3",
    text: "Mục một: Hình thoi. Định nghĩa: Hình thoi là tứ giác có bốn cạnh bằng nhau. Do có các cặp cạnh đối bằng nhau, hình thoi cũng là một hình bình hành, nên nó thừa hưởng toàn bộ các tính chất của hình bình hành."
  },
  {
    file: "voice_rhombus_thm1.mp3",
    text: "Định lí 1: Trong hình thoi, hai đường chéo vuông góc với nhau; và hai đường chéo là các đường phân giác của các góc trong hình thoi. Các em hãy thử kéo các đỉnh A và B trên màn hình để kiểm chứng góc A O B luôn luôn bằng 90 độ."
  },
  {
    file: "voice_rhombus_signs.mp3",
    text: "Định lí 2 về dấu hiệu nhận biết hình thoi: Một hình bình hành là hình thoi nếu có hai cạnh kề bằng nhau; hoặc có hai đường chéo vuông góc với nhau; hoặc có một đường chéo là phân giác của một góc."
  },
  {
    file: "voice_square_def.mp3",
    text: "Mục hai: Hình vuông. Định nghĩa: Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau. Hình vuông vừa là hình chữ nhật, lại vừa là hình thoi. Đây là hình hoàn hảo nhất trong gia đình tứ giác!"
  },
  {
    file: "voice_square_thm3.mp3",
    text: "Định lí 3: Trong hình vuông, hai đường chéo bằng nhau, vuông góc với nhau, cắt nhau tại trung điểm của mỗi đường và là các đường phân giác của các góc. Đường chéo hình vuông hội tụ toàn bộ phẩm chất của cả hình chữ nhật và hình thoi."
  },
  {
    file: "voice_practice.mp3",
    text: "Hệ thống luyện tập ba mức độ: Mức một Nhận biết; Mức hai Thông hiểu; và Mức ba Vận dụng. Mỗi mức độ gồm hai câu hỏi tương tác. Thầy mời các em quan sát hình động và tự tin chinh phục từng câu hỏi nhé!"
  },
  {
    file: "voice_lab.mp3",
    text: "Chào mừng các em đến với Phòng thí nghiệm Tứ giác Sandbox! Tại đây, các em có thể tự do kéo bốn đỉnh A, B, C, D. Máy quét cảm biến sẽ tự động nhận diện các cặp cạnh song song, góc vuông và hai đường chéo, giúp các em quan sát sự chuyển hóa trực quan giữa các hình."
  },
  {
    file: "voice_summary.mp3",
    text: "Tổng kết bài học: Thầy mời các em hoàn thành bảng so sánh bốn tứ giác trọng tâm và thử thách Exit Ticket 3 2 1 để củng cố toàn bộ kiến thức hôm nay."
  }
];

async function generateAll() {
  console.log("=== BẮT ĐẦU TẠO TẤT CẢ FILE GIỌNG NAM CHUẨN TIẾNG VIỆT (vi-VN-NamMinhNeural) ===");
  const tempDir = path.join("/tmp", "edge_speech_" + Date.now());
  fs.mkdirSync(tempDir, { recursive: true });

  const tts = new MsEdgeTTS();
  await tts.setMetadata("vi-VN-NamMinhNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const item of lessons) {
    console.log(`Đang tạo âm thanh: ${item.file}...`);
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await tts.toFile(tempDir, item.text);
        const tempAudio = path.join(tempDir, "audio.mp3");
        const targetPath = path.join(OUTPUT_DIR, item.file);

        if (fs.existsSync(tempAudio)) {
          fs.copyFileSync(tempAudio, targetPath);
          fs.unlinkSync(tempAudio);
          const size = fs.statSync(targetPath).size;
          console.log(`-> Đã lưu ${item.file} thành công (${size} bytes)`);
          break;
        } else {
          throw new Error("Temp audio file not generated");
        }
      } catch (err) {
        console.warn(`Lỗi khi tạo ${item.file} (thử lần ${attempt}):`, err.message);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    await new Promise(r => setTimeout(r, 400));
  }

  // Tạo thêm bản copy cho tab alias
  fs.copyFileSync(path.join(OUTPUT_DIR, "voice_rhombus_def.mp3"), path.join(OUTPUT_DIR, "voice_rhombus.mp3"));
  fs.copyFileSync(path.join(OUTPUT_DIR, "voice_square_def.mp3"), path.join(OUTPUT_DIR, "voice_square.mp3"));

  console.log("=== HOÀN TẤT TẤT CẢ CÁC TỆP ÂM THANH GIỌNG NAM CHUẨN TIẾNG VIỆT! ===");
}

generateAll().catch(console.error);
