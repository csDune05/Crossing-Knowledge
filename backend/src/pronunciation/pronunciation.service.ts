import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePronunciationPracticeDto } from './dto/pronunciation.dto';
import { PronunciationPractice } from './entities/pronunciation-practice.entity';
import { EvaluatePronunciationDto, EvaluatePronunciationResponseDto } from './dto/evaluate.dto';

@Injectable()
export class PronunciationService {
  constructor(
    @InjectRepository(PronunciationPractice)
    private readonly pronunciationPracticeRepository: Repository<PronunciationPractice>,
  ) {}

  async create(
    createPronunciationPracticeDto: CreatePronunciationPracticeDto,
  ): Promise<PronunciationPractice> {
    // In a real app, you would fetch the user and word entities
    // and handle the audio file upload/storage.
    // For now, we'll just create a record with a dummy score.
    const practice = this.pronunciationPracticeRepository.create({
      ...createPronunciationPracticeDto,
      user: { id: createPronunciationPracticeDto.userId } as any,
      word: { id: createPronunciationPracticeDto.wordId } as any,
      score: Math.floor(Math.random() * 101), // Dummy score
    });

    return this.pronunciationPracticeRepository.save(practice);
  }

  async evaluate(dto: EvaluatePronunciationDto): Promise<EvaluatePronunciationResponseDto> {
    const expected = normalizeCompare(dto.expectedText);
    const spoken = normalizeCompare(dto.spokenText);

    if (!expected || !spoken) {
      return { result: 'wrong', score: 0, hint: 'Gợi ý: Con bấm mic và nói lại từ vựng nhé.' };
    }

    // 1) chấm nhanh từ transcript thô
    const rawScore = similarity(expected, spoken);

    // 2) nếu chưa ổn, gọi NLP thật để "đoán" câu đúng từ spokenText
    let corrected = '';
    if (rawScore < 0.8) corrected = await hfVietnameseCorrection(spoken);

    // 3) chọn best giữa spoken và corrected
    const best = corrected ? pickBest(expected, [spoken, corrected]) : { bestAlt: spoken, bestScore: rawScore };

    const score = Math.round(best.bestScore * 100);
    const result: 'correct' | 'close' | 'wrong' =
      best.bestScore >= 0.8 ? 'correct' : best.bestScore >= 0.6 ? 'close' : 'wrong';

    const hint = buildHint(expected, spoken, corrected, result);

    return { result, score, hint, correctedSpoken: corrected || undefined };
  }

}

const toNFC = (s = '') => (s || '').normalize('NFC');

const normalizeCompare = (s = '') =>
  toNFC(s).toLowerCase().replace(/\s+/g, ' ').trim();

const stripVietnameseDiacritics = (s = '') =>
  toNFC(s)
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
};

const similarity = (a: string, b: string) => {
  const aa = normalizeCompare(a);
  const bb = normalizeCompare(b);
  if (!aa && !bb) return 1;
  if (!aa || !bb) return 0;
  return 1 - levenshtein(aa, bb) / Math.max(aa.length, bb.length);
};

const pickBest = (expected: string, alts: string[]) => {
  let bestAlt = alts[0];
  let bestScore = similarity(expected, bestAlt);
  for (const c of alts) {
    const sc = similarity(expected, c);
    if (sc > bestScore) {
      bestScore = sc;
      bestAlt = c;
    }
  }
  return { bestAlt, bestScore };
};

const quote = (s: string) => `“${s}”`;

function buildHint(expected: string, spoken: string, corrected: string, result: 'correct'|'close'|'wrong') {
  const expBase = stripVietnameseDiacritics(expected);
  const spBase = stripVietnameseDiacritics(spoken);

  if (expBase && expBase === spBase && expected !== spoken) {
    return `Gợi ý: Con chú ý dấu trong ${quote(expected)}.`;
  }

  if (corrected && normalizeCompare(corrected) !== normalizeCompare(spoken)) {
    if (normalizeCompare(corrected) === normalizeCompare(expected)) {
      return `Gợi ý: Con đọc gần đúng rồi, thử đọc rõ hơn: ${quote(expected)}.`;
    }
    return `Gợi ý: Con đang đọc giống ${quote(corrected)}. Mục tiêu là ${quote(expected)}.`;
  }

  if (result === 'close') return `Gợi ý: Thử đọc rõ hơn: ${quote(expected)}.`;
  if (result === 'wrong') return `Gợi ý: Con nghe lại và đọc: ${quote(expected)}.`;
  return '';
}

// Gọi Hugging Face Inference API (serverless) bằng HTTP request :contentReference[oaicite:3]{index=3}
async function hfVietnameseCorrection(text: string): Promise<string> {
  const model = process.env.HF_CORRECTION_MODEL || 'bmd1905/bartpho-syllable-base-vietnamese-correction';
  const token = process.env.HF_API_TOKEN;
  if (!token) return '';

  const url = `https://api-inference.huggingface.co/models/${model}`;

  // Retry vì HF có thể trả 503 khi model "đang load"
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: text }),
    });

    if (r.status === 503) {
      await new Promise((res) => setTimeout(res, 800 * attempt));
      continue;
    }

    if (!r.ok) return '';

    const data: any = await r.json();
    const out = Array.isArray(data) ? data?.[0]?.generated_text : data?.generated_text;
    return typeof out === 'string' ? out.trim() : '';
  }

  return '';
}
