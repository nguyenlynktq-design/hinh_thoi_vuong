/**
 * Audio and Speech Synthesis Engine
 * Hỗ trợ:
 * 1. Âm thanh tải sẵn về app (giọng Nam thầy giáo miền Bắc rõ ràng, dứt khoát)
 * 2. Đầy đủ mapping thuyết minh cho TẤT CẢ các tab: 1, 2, 3, 4, 5, 6
 * 3. Hiệu ứng âm thanh SFX tải sẵn (thành công, báo sai, pop, chuông)
 * 4. Web Speech API fallback giọng nam
 */

export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSection: string;
  playbackRate: number;
  usePreloadedAudio: boolean;
}

export const PRELOADED_VOICES: Record<string, string> = {
  home: '/audio/voice_home.mp3',
  intro: '/audio/voice_intro.mp3',
  rhombus: '/audio/voice_rhombus.mp3',
  rhombus_def: '/audio/voice_rhombus_def.mp3',
  rhombus_thm1: '/audio/voice_rhombus_thm1.mp3',
  rhombus_signs: '/audio/voice_rhombus_signs.mp3',
  square: '/audio/voice_square.mp3',
  square_def: '/audio/voice_square_def.mp3',
  square_thm3: '/audio/voice_square_thm3.mp3',
  practice: '/audio/voice_practice.mp3',
  lab: '/audio/voice_lab.mp3',
  summary: '/audio/voice_summary.mp3',
  teacher_test: '/audio/voice_teacher_test.mp3',
};

export const LESSON_SCRIPTS: Record<string, string> = {
  home: 'Chào mừng các em đến với Bài 14: Hình thoi và Hình vuông trong bộ sách Toán 8 Kết nối tri thức. Phương pháp học gồm quan sát, thao tác, dự đoán và kiểm chứng logic.',
  intro: 'Chào các em! Chúng ta bắt đầu với hoạt động Khởi động gấp giấy trang 67. Gấp đôi tờ giấy hai lần liên tiếp tạo góc vuông O. Cắt theo đoạn thẳng A B rồi mở bung ra. Nếu O A khác O B, ta nhận được hình thoi. Khi O A bằng O B, ta nhận được hình vuông hoàn hảo.',
  rhombus: 'Mục một: Hình thoi. Định nghĩa: Hình thoi là tứ giác có bốn cạnh bằng nhau. Do có các cặp cạnh đối bằng nhau, hình thoi cũng là một hình bình hành, nên nó thừa hưởng toàn bộ các tính chất của hình bình hành.',
  rhombus_def: 'Mục một: Hình thoi. Định nghĩa: Hình thoi là tứ giác có bốn cạnh bằng nhau. Do có các cặp cạnh đối bằng nhau, hình thoi cũng là một hình bình hành, nên nó thừa hưởng toàn bộ các tính chất của hình bình hành.',
  rhombus_thm1: 'Định lí 1: Trong hình thoi, hai đường chéo vuông góc với nhau; và hai đường chéo là các đường phân giác của các góc trong hình thoi. Các em hãy thử kéo các đỉnh A và B trên màn hình để kiểm chứng góc A O B luôn luôn bằng 90 độ.',
  rhombus_signs: 'Định lí 2 về dấu hiệu nhận biết hình thoi: Một hình bình hành là hình thoi nếu có hai cạnh kề bằng nhau; hoặc có hai đường chéo vuông góc với nhau; hoặc có một đường chéo là phân giác của một góc.',
  square: 'Mục hai: Hình vuông. Định nghĩa: Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau. Hình vuông vừa là hình chữ nhật, lại vừa là hình thoi. Đây là hình hoàn hảo nhất trong gia đình tứ giác!',
  square_def: 'Mục hai: Hình vuông. Định nghĩa: Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau. Hình vuông vừa là hình chữ nhật, lại vừa là hình thoi. Đây là hình hoàn hảo nhất trong gia đình tứ giác!',
  square_thm3: 'Định lí 3: Trong hình vuông, hai đường chéo bằng nhau, vuông góc với nhau, cắt nhau tại trung điểm của mỗi đường và là các đường phân giác của các góc. Đường chéo hình vuông hội tụ toàn bộ phẩm chất của cả hình chữ nhật và hình thoi.',
  practice: 'Hệ thống luyện tập ba mức độ: Mức một Nhận biết; Mức hai Thông hiểu; và Mức ba Vận dụng. Mỗi mức độ gồm hai câu hỏi tương tác. Thầy mời các em quan sát hình động và tự tin chinh phục từng câu hỏi nhé!',
  lab: 'Chào mừng các em đến với Phòng thí nghiệm Tứ giác Sandbox! Tại đây, các em có thể tự do kéo bốn đỉnh A, B, C, D. Máy quét cảm biến sẽ tự động nhận diện các cặp cạnh song song, góc vuông và hai đường chéo, giúp các em quan sát sự chuyển hóa trực quan giữa các hình.',
  summary: 'Tổng kết bài học: Thầy mời các em hoàn thành bảng so sánh bốn tứ giác trọng tâm và thử thách Exit Ticket 3 2 1 để củng cố toàn bộ kiến thức hôm nay.',
  teacher_test: 'Chào các em học sinh thân yêu! Thầy là giáo viên dạy Toán 8. Hôm nay chúng ta sẽ cùng khám phá vẻ đẹp hình học của hình thoi và hình vuông nhé!'
};

class SoundService {
  private sfxEnabled = true;
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((state: SpeechState) => void)[] = [];
  
  public state: SpeechState = {
    isPlaying: false,
    isPaused: false,
    currentSection: '',
    playbackRate: 1.0,
    usePreloadedAudio: true,
  };

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public subscribe(listener: (state: SpeechState) => void) {
    this.listeners.push(listener);
    listener({ ...this.state });
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public isSfxEnabled() {
    return this.sfxEnabled;
  }

  // SFX play via preloaded MP3 or AudioContext oscillator
  public playSuccess() {
    if (!this.sfxEnabled) return;
    this.playAudioFile('/audio/sfx/sfx_success.mp3', () => {
      try {
        const ctx = this.getAudioContext();
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          }, i * 90);
        });
      } catch (e) {
        console.warn('Audio fallback error', e);
      }
    });
  }

  public playIncorrect() {
    if (!this.sfxEnabled) return;
    this.playAudioFile('/audio/sfx/sfx_incorrect.mp3', () => {
      try {
        const ctx = this.getAudioContext();
        [330, 240].forEach((freq, i) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
          }, i * 140);
        });
      } catch (e) {
        console.warn('Audio fallback error', e);
      }
    });
  }

  public playPop() {
    if (!this.sfxEnabled) return;
    this.playAudioFile('/audio/sfx/sfx_pop.mp3', () => {
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  public playBell() {
    if (!this.sfxEnabled) return;
    this.playAudioFile('/audio/sfx/sfx_bell.mp3', () => {
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  private playAudioFile(url: string, onFallback: () => void) {
    try {
      const audio = new Audio(url);
      audio.volume = 0.9;
      audio.play().catch(() => onFallback());
    } catch {
      onFallback();
    }
  }

  // Teacher Voice Engine (Preloaded MP3 with full tab coverage + Fallback)
  public playTeacherSection(sectionKey: string) {
    // Resolve alias
    let resolvedKey = sectionKey;
    if (sectionKey === 'rhombus' && !PRELOADED_VOICES['rhombus']) resolvedKey = 'rhombus_def';
    if (sectionKey === 'square' && !PRELOADED_VOICES['square']) resolvedKey = 'square_def';

    const audioUrl = PRELOADED_VOICES[resolvedKey] || PRELOADED_VOICES['intro'];
    const script = LESSON_SCRIPTS[resolvedKey] || LESSON_SCRIPTS['intro'];

    this.stopSpeaking();

    this.state.currentSection = sectionKey;
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.notify();

    if (this.state.usePreloadedAudio && audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        audio.playbackRate = this.state.playbackRate;
        audio.volume = 1.0;

        audio.onended = () => {
          this.state.isPlaying = false;
          this.state.isPaused = false;
          this.currentAudio = null;
          this.notify();
        };

        audio.onerror = () => {
          console.warn(`Không thể phát ${audioUrl}, chuyển sang Web Speech API fallback`);
          this.speakWithWebSpeech(script);
        };

        audio.play().catch(err => {
          console.warn('Audio play error, falling back:', err);
          this.speakWithWebSpeech(script);
        });
      } catch (err) {
        console.warn('Audio init error:', err);
        this.speakWithWebSpeech(script);
      }
    } else {
      this.speakWithWebSpeech(script);
    }
  }

  public togglePause() {
    if (this.currentAudio) {
      if (this.currentAudio.paused) {
        this.currentAudio.play();
        this.state.isPaused = false;
      } else {
        this.currentAudio.pause();
        this.state.isPaused = true;
      }
      this.notify();
      return;
    }

    if ('speechSynthesis' in window && this.state.isPlaying) {
      if (this.state.isPaused) {
        window.speechSynthesis.resume();
        this.state.isPaused = false;
      } else {
        window.speechSynthesis.pause();
        this.state.isPaused = true;
      }
      this.notify();
    }
  }

  public stopSpeaking() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.notify();
  }

  public replayCurrent() {
    if (this.state.currentSection) {
      this.playTeacherSection(this.state.currentSection);
    } else {
      this.playTeacherSection('intro');
    }
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
    this.notify();
  }

  public setUsePreloadedAudio(val: boolean) {
    this.state.usePreloadedAudio = val;
    this.notify();
  }

  private speakWithWebSpeech(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'vi-VN';
    utt.rate = this.state.playbackRate * 0.95;
    // Giọng nam trầm đĩnh đạc
    utt.pitch = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const viVoices = voices.filter(v => v.lang.toLowerCase().includes('vi'));
    // Ưu tiên giọng nam tiếng Việt (NamMinh, Nam, Male)
    const maleVoice = viVoices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes('nam') || n.includes('minh') || n.includes('male');
    }) || viVoices[0];

    if (maleVoice) {
      utt.voice = maleVoice;
    }

    utt.onend = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    utt.onerror = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utt;
    window.speechSynthesis.speak(utt);
  }
}

export const soundService = new SoundService();
