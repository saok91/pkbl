# وضعیت توسعه — PKBL

> **آخرین به‌روزرسانی:** ۱۴۰۵/۰۴/۱۰ (برنامه E16–E19)  
> **جزئیات:** [epics.md](./epics.md) · **معماری:** [architecture.md](./architecture.md)

**راهنما:** `⬜` todo · `🔄` در حال انجام · `✅` انجام‌شده · `⏸` بعد از MVP

---

## فاز ۰ — Foundation

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E0 | S1 | Scaffold پروژه T3 | ✅ |
| E0 | S2 | ساختار پوشه‌های دامنه | ✅ |
| E0 | S3 | CI و quality gates | ✅ |
| E0 | S4 | Seed دیتابیس و migration اولیه | ✅ |

## فاز ۱ — Domain Core

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E1 | S1 | KLE parser برای subset ۶۰٪ | ✅ |
| E1 | S2 | مدل Layout و EditableScope | ✅ |
| E1 | S3 | عملیات assign و swap | ✅ |
| E1 | S4 | Serialize و import/export KLE | ✅ |
| E1 | S5 | تشخیص کاراکترهای بدون جایگاه | ✅ |
| E2 | S1 | Finger map قالب ۶۰٪ | ✅ |
| E2 | S2 | Reach penalty و weak key penalty | ✅ |
| E3 | S1 | نرمال‌سازی متن فارسی | ✅ |
| E3 | S2 | استخراج n-gram | ✅ |
| E3 | S3 | Corpus build script | ✅ |
| E3 | S4 | Corpus preset registry | ✅ |
| E4 | S1 | هستهٔ scorer | ✅ |
| E4 | S2 | سیگنال‌های unigram | ✅ |
| E4 | S3 | سیگنال‌های bigram | ✅ |
| E4 | S4 | سیگنال‌های trigram | ✅ |
| E4 | S5 | متریک‌های ارگونومی aggregate | ✅ |
| E4 | S6 | ScoringConfig versioned | ✅ |

## فاز ۲ — Editor MVP

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E5 | S1 | رندر بصری صفحه‌کلید ۶۰٪ | ✅ |
| E5 | S2 | انتخاب لایه base/shift | ✅ |
| E5 | S3 | Click-to-assign | ✅ |
| E5 | S4 | Drag-and-drop assign | ✅ |
| E5 | S5 | Character palette | ✅ |
| E5 | S6 | Reset و عملیات سریع | ✅ |
| E6 | S1 | Live score با debounce | ✅ |
| E6 | S2 | Breakdown panel | ✅ |
| E6 | S3 | Hotspots visualization | ✅ |
| E6 | S4 | Ranking hint (توضیح انسانی) | ✅ |
| E12 | S1 | tRPC score router | ✅ |
| E12 | S2 | tRPC layout router | ✅ |
| E12 | S3 | tRPC corpus router | ✅ |
| E12 | S4 | tRPC leaderboard router | ✅ |

## فاز ۲ (refinement) — Score Comprehension

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E15 | S1 | قضاوت کلی با گیج کیفی (Verdict Gauge) | ✅ |
| E15 | S2 | کارت‌های قوت‌ها و ضعف‌ها | ✅ |
| E15 | S3 | واژه‌نامهٔ متریک‌ها: آیکن (i) + راهنما | ✅ |
| E15 | S4 | مقایسه با خط مبنا (چیدمان پیش‌فرض ۶۰٪) | ✅ |
| E15 | S5 | نمایش بصری بار انگشتان و تعادل دست‌ها | ✅ |
| E15 | S6 | Delta امتیاز پس از هر ویرایش | ✅ |
| E15 | S7 | تفکیک نمای ساده/متخصص + پنهان‌سازی debug | ✅ |

## فاز ۲ (refinement) — Layout Fidelity v2

> **برنامهٔ کامل:** [plans/layout-fidelity-v2.md](./plans/layout-fidelity-v2.md)

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E16 | S1 | تعریف `NORMALIZATION_CONFIG_V2` | ⬜ |
| E16 | S2 | Rebuild artifactهای preset corpus | ⬜ |
| E16 | S3 | ممیزی charset و علائم نگارشی | ⬜ |
| E16 | S4 | سیاست leaderboard برای نسخه corpus | ⬜ |
| E17 | S1 | متریک‌های shift در `ScoreBreakdown` | ⬜ |
| E17 | S2 | وزن shift در total score | ⬜ |
| E17 | S3 | Insights و glossary برای Shift | ⬜ |
| E18 | S1 | `buildRadarProfile` pure function | ⬜ |
| E18 | S2 | کامپوننت `LayoutRadarChart` (SVG) | ⬜ |
| E18 | S3 | wire به live score / baseline cache | ⬜ |
| E19 | S1 | KLE «فارسی قدیمی Windows» | ⬜ |
| E19 | S2 | `LayoutPreset` registry | ⬜ |
| E19 | S3 | UI dropdown + load با confirm | ⬜ |
| E19 | S4 | Baseline و charset preset-aware | ⬜ |

## فاز ۳ — Workflow

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E7 | S1 | UI paste corpus | ⏸ |
| E7 | S2 | پردازش client-side n-gram (ماژول مشترک) | ⏸ |
| E7 | S3 | اعتبارسنجی server در submit | ⏸ |
| E8 | S1 | Auto-save draft | ✅ |
| E8 | S2 | مدیریت چند layout محلی | ⏸ |
| E8 | S3 | Export/import KLE file | ⏸ |
| E9 | S1 | Compare mode دو layout | ⏸ |
| E9 | S2 | Comparison summary table | ⏸ |

## فاز ۴ — Community

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E10 | S1 | Submit layout به leaderboard | ✅ |
| E10 | S2 | Leaderboard list | ✅ |
| E10 | S3 | Notification شکست رکورد | ⏸ |
| E10 | S4 | Auto-promotion به template | ⏸ |
| E10 | S5 | Load community template | ⏸ |

## فاز ۵ — Enhancement

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E11 | S1 | Suggest best key for char | ⏸ |
| E11 | S2 | Auto-fill suggestion (با confirm) | ⏸ |

## فاز ۶ — Export

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E13 | S1 | Export IR (Intermediate Representation) | ⏸ |
| E13 | S2 | Windows export (.klc / MSKLC) | ⏸ |
| E13 | S3 | macOS export (.keylayout) | ⏸ |
| E13 | S4 | Linux XKB export | ⏸ |

## فاز ۷ — Launch

| اپیک | استوری | عنوان | وضعیت |
|------|--------|-------|-------|
| E14 | S1 | Performance audit | ⏸ |
| E14 | S2 | Accessibility pass | ⏸ |
| E14 | S3 | Error handling & empty states | ⏸ |
| E14 | S4 | Production deploy | ⏸ |
| E14 | S5 | Landing & onboarding | ⏸ |
| E14 | S6 | E2E smoke tests | ⏸ |

---

## خلاصهٔ اپیک‌ها

| اپیک | عنوان | پیشرفت |
|------|-------|--------|
| E0 | Foundation & Dev Infrastructure | 4/4 ✅ |
| E1 | Layout Model & KLE | 5/5 ✅ |
| E2 | Ergonomics Model | 2/2 ✅ |
| E3 | Corpus Engine & Presets | 4/4 ✅ |
| E4 | Scoring Engine | 6/6 ✅ |
| E5 | Editor UI | 6/6 ✅ |
| E6 | Score Analytics Panel | 4/4 ✅ |
| E7 | Custom Corpus | 0/3 ⏸ |
| E8 | Local Persistence | 1/3 |
| E9 | Compare Layouts | 0/2 ⏸ |
| E10 | Leaderboard & Promotion | 2/5 |
| E11 | Character Placement Suggestions | 0/2 ⏸ |
| E12 | API Layer | 4/4 ✅ |
| E13 | Export Pipeline | 0/4 ⏸ |
| E14 | Polish & Launch | 0/6 ⏸ |
| E15 | Score Comprehension UX | 7/7 ✅ |
| E16 | Normalization v2 & Corpus Rebuild | 0/4 ⬜ |
| E17 | Shift-Aware Scoring | 0/3 ⬜ |
| E18 | Layout Radar Chart | 0/3 ⬜ |
| E19 | Preset Layout Selector | 0/4 ⬜ |

**MVP:** 30/30 استوری block ✅  
**Layout Fidelity v2:** 0/14 استوری — [برنامه](./plans/layout-fidelity-v2.md)
