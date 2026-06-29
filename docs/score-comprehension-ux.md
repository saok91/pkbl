# Score Comprehension UX — spec طراحی (E15)

> **نسخه:** 0.3  
> **وضعیت:** ✅ complete — ۷/۷ استوری  
> **مرجع:** [epics E15](./epics.md) · [editor-analytics-layout.md](./editor-analytics-layout.md) (E6) · [PRD](./prd.md) خط ۶۲/۱۴۴  
> **اصل:** «از عدد به قضاوت، از قضاوت به اقدام» — برای کاربر بدون تخصص

---

## ۱. مسئله و مخاطب

- **مسئله:** بازخورد کاربر — اعداد خام بی‌معنا، ژارگون (n-gram، بی‌گرام، یونی‌گرام)، presentation ضعیف برای غیرمتخصص.
- **مخاطب هدف:** تایپ‌کنندهٔ فارسی بدون پیش‌زمینهٔ keyboard layout، ارگونومی تایپ ده‌انگشتی، یا NLP.
- **نیاز PRD:** کاربر باید بفهمد *چرا* یک چیدمان امتیاز خوب/بد گرفته (خط ۶۲، ۱۴۴).
- **رابطه با E6:** E6 داده را نمایش می‌دهد؛ E15 آن را *قابل‌فهم* می‌کند. scorer (E4) تغییر نمی‌کند.

---

## ۲. اصول UX

- **یک قضاوت کیفی پیش از هر عدد** — خوب / متوسط / ضعیف قبل از total خام.
- **Progressive disclosure** — نمای ساده پیش‌فرض؛ نمای متخصص اختیاری (breakdown کامل E6).
- **هر متریک = برچسب کیفی + توضیح (i) + توصیهٔ اقدام.**
- **ترجیح نمودار بر عدد خام** — بار انگشت، تعادل دست، baseline compare.
- **baseline-relative** — مقایسه با چیدمان پیش‌فرض ۶۰٪، نه absolute scale.
- **Consistency** — همان palette E5/E6: `slate-900/950`, accent `sky`, border `slate-800`.
- **Stale-while-revalidate** — همان رفتار debounce E6 حفظ شود.
- **Link to action** — hotspot و insight → highlight/select کلید روی keyboard.

---

## ۳. چیدمان نمای ساده (wireframe)

```
┌─────────────────────────────────┐
│ [نمای ساده | نمای متخصص]        │
├─────────────────────────────────┤
│ preset select                   │
│ ┌─────────────────────────────┐ │
│ │  ●●●●○○○  «چیدمان خوب»     │ │  ← Verdict gauge (S1)
│ │  امتیاز: ۸۴۲ (ثانویه)       │ │
│ │  +۱۸٪ بهتر از پیش‌فرض       │ │  ← Baseline compare (S4)
│ └─────────────────────────────┘ │
│ hint یک‌خطی (ranking-hint)      │
├─────────────────────────────────┤
│ ✅ قوت‌ها                        │  ← Strengths (S2)
│   · استفاده خوب از ردیف home   │
│ ⚠️ ضعف‌ها                        │  ← Weaknesses (S2)
│   · بار انگشت کوچک بالاست      │
├─────────────────────────────────┤
│ بار انگشتان (نمودار رنگی) (i)  │  ← Finger load chart (S5)
│ تعادل دست (نوار دوسویه) (i)    │
├─────────────────────────────────┤
│ نقاط پرهزینه (hotspots ساده)   │
└─────────────────────────────────┘
```

**نمای متخصص:** breakdown accordion کامل E6 + اعداد خام debug.

---

## ۴. Verdict Gauge (E15-S1)

- سه باند: ضعیف (amber/red)، متوسط (yellow)، خوب (emerald).
- برچسب فارسی prominent: «نیازمند بهبود» / «قابل‌قبول» / «چیدمان خوب».
- عدد total secondary (`text-slate-500`).
- باندها از `verdict.ts` + `metric-bands.ts` — نسبت به baseline پیش‌فرض.
- `aria-live="polite"` فقط روی تغییر برچسب کیفی.

---

## ۵. کارت‌های قوت/ضعف (E15-S2)

- منبع: `deriveInsights(breakdown, baseline)` در `src/lib/scoring/insights/`.
- حداکثر ۳ قوت + ۳ ضعف برتر (severity).
- هر کارت: آیکن + عنوان فارسی + جملهٔ توصیه.
- حالت empty: «اول چیدمان را کامل کنید».
- متریک‌های ارزیابی‌شده: homeRowUsage, handBalance, sameFingerBigrams, weakKeyPenalty, rowSwitching.

---

## ۶. واژه‌نامهٔ متریک‌ها (E15-S3)

| اصطلاح | تعریف ساده (فارسی) | مثال |
|--------|---------------------|------|
| n-gram | الگوی چند حرف پشت‌سرهم در متن | — |
| یونی‌گرام | تک‌حرف و فراوانی آن | «ا» پرتکرارترین حرف |
| بی‌گرام | دو حرف پشت‌سرهم | ‹سل› در ‹سلام› |
| تری‌گرام | سه حرف پشت‌سرهم | ‹سلا› در ‹سلام› |
| ردیف home | ردیف وسط صفحه‌کلید (ASDF) | جای انگشتان در حالت استراحت |
| بار انگشت | چقدر هر انگشت تایپ می‌کند | انگشت کوچک نباید زیاد بار بگیرد |
| تعادل دست | توزیع بار بین دست چپ و راست | ۵۰/۵۰ ایده‌آل است |
| بی‌گرام هم‌انگشتی | دو حرف پشت‌سرهم با یک انگشت | کند و خسته‌کننده |
| کلید ضعیف | جایگاه دشوار (مثل انگشت کوچک) | گوشه‌های صفحه‌کلید |
| تعویض ردیف | جابه‌جایی بین ردیف‌های بالا/وسط/پایین | حرکت اضافهٔ انگشت |

- کامپوننت `MetricInfo`: آیکن (i) + popover.
- بخش «راهنمای امتیاز»: collapsible یا modal با همهٔ مفاهیم.

---

## ۷. Baseline Compare (E15-S4)

- مرجع: امتیاز چیدمان پیش‌فرض ۶۰٪ روی preset جاری.
- cache per preset در `baseline.ts`.
- نمایش: «‪+۱۸٪‬ بهتر از چیدمان پیش‌فرض» + نوار دو میله‌ای.
- تابع pure قابل بازاستفاده در E9.

---

## ۸. نمودار بار انگشت و تعادل دست (E15-S5)

- `fingerLoad` → ۵ bar رنگ‌کدشده (سبز/قرمز).
- انگشت کوچک: آستانهٔ پایین‌تر.
- `handBalance` → نوار دوسویه چپ/راست + برچسب کیفی.
- SVG/`div` ساده — بدون کتابخانهٔ چارت سنگین.

---

## ۹. Delta Badge (E15-S6)

- badge گذرا «‪+۱۲‬» / «‪−۸‬» پس از ویرایش پایدار.
- محو پس از ~۲ ثانیه.
- هماهنگ با debounce ۱۲۰ms `useLiveScore`.
- بدون نمایش در اولین محاسبه.

---

## ۱۰. نمای ساده / متخصص (E15-S7)

| نمای ساده (پیش‌فرض) | نمای متخصص |
|---------------------|------------|
| Verdict gauge | breakdown accordion کامل E6 |
| قوت‌ها/ضعف‌ها | unigramCost و اعداد خام debug |
| baseline compare | همهٔ metric-rowهای فنی |
| نمودار بار انگشت | — |
| hotspots ساده | — |

- toggle در بالای پنل.
- `localStorage` key: `pkbl-analytics-view-mode`.

---

## ۱۱. درخت کامپوننت

```
src/lib/scoring/insights/
├── metric-bands.ts           # آستانه good/ok/poor هر متریک (versioned)     [S1, S2, S5]
├── metric-bands.test.ts
├── verdict.ts                # total + baseline → band کیفی (pure)              [S1]
├── verdict.test.ts
├── derive-insights.ts        # breakdown → Insight[] (strength/weakness)        [S2]
├── derive-insights.test.ts
├── baseline.ts               # امتیاز پیش‌فرض ۶۰٪ + delta نسبی (pure, cached)  [S4]
├── baseline.test.ts
└── types.ts                  # Insight, VerdictBand, MetricBand, BaselineDelta

src/components/editor/analytics/
├── score-panel.tsx           # refactor: شاخه‌بندی نمای ساده/متخصص              [S7]
├── score-hero.tsx            # موجود — افزودن score-delta-badge              [S6]
├── breakdown-accordion.tsx   # موجود — فقط نمای متخصص                        [S7]
├── hotspot-list.tsx          # موجود — زبان ساده در نمای ساده
├── ranking-hint.tsx          # موجود
├── ranking-hints.ts          # موجود — منبع p-value برای metric-bands
├── finger-load-bars.tsx      # موجود — یا جایگزین با finger-load-chart        [S5]
├── metric-row.tsx            # موجود — افزودن MetricInfo (i)                   [S3]
├── analytics-labels.ts       # موجود — بازاستفاده برچسب انگشتان
├── format-analytics.ts       # موجود
├── use-live-score.ts         # موجود — نگه‌داری previousTotal برای delta      [S6]
├── use-live-score.test.ts
│
└── comprehension/
    ├── verdict-gauge.tsx         # گیج/باند رنگی + برچسب کیفی               [S1]
    ├── strengths-weaknesses.tsx  # لیست کارت‌های قوت/ضعف                    [S2]
    ├── insight-card.tsx          # کارت تکی insight (shared)                [S2]
    ├── metric-info.tsx           # آیکن (i) + popover/tooltip                 [S3]
    ├── metric-glossary.ts        # تعریف فارسی اصطلاحات + مثال‌ها           [S3]
    ├── metrics-help.tsx          # بخش/مودال «راهنمای امتیاز»                 [S3]
    ├── baseline-compare.tsx      # نوار مقایسه با پیش‌فرض + delta درصد       [S4]
    ├── finger-load-chart.tsx     # نمودار بار انگشت رنگ‌کدشده                 [S5]
    ├── hand-balance-bar.tsx      # نوار دوسویه تعادل دست                      [S5]
    ├── score-delta-badge.tsx     # badge گذرا +/- پس از ویرایش               [S6]
    ├── view-mode-toggle.tsx      # toggle ساده | متخصص + localStorage         [S7]
    └── comprehension-labels.ts   # برچسب‌های کیفی فارسی (خوب/متوسط/ضعیف)
```

---

## ۱۲. State و data flow

- **Source of truth layout:** `useEditorStore` (موجود).
- **Score:** `useLiveScore` (موجود) → `ScoreResult`.
- **Insights:** `deriveInsights(result.breakdown, baseline)` — pure، در render یا useMemo.
- **Baseline:** cache per preset — یک‌بار محاسبه.
- **View mode:** `localStorage` + React state محلی.

---

## ۱۳. Accessibility

- popover: کیبورد + `Esc` + `aria-describedby`.
- verdict: `aria-live="polite"`.
- toggle نمای: `<button>` با `aria-pressed`.
- نمودارها: `role="img"` + `aria-label` فارسی.

---

## ۱۴. mapping به استوری‌های E15

| استوری | کامپوننت / فایل |
|--------|-----------------|
| E15-S1 | `verdict-gauge.tsx`, `verdict.ts`, `metric-bands.ts` |
| E15-S2 | `strengths-weaknesses.tsx`, `insight-card.tsx`, `derive-insights.ts` |
| E15-S3 | `metric-info.tsx`, `metric-glossary.ts`, `metrics-help.tsx` |
| E15-S4 | `baseline-compare.tsx`, `baseline.ts` |
| E15-S5 | `finger-load-chart.tsx` (یا ارتقای `finger-load-bars.tsx`), `hand-balance-bar.tsx` |
| E15-S6 | `score-delta-badge.tsx` |
| E15-S7 | `view-mode-toggle.tsx`, refactor `score-panel.tsx` |

---

## ۱۵. ترتیب پیشنهادی پیاده‌سازی

| مرحله | استوری | توضیح |
|-------|--------|-------|
| 1 | E15-S1 | Verdict gauge — بیشترین ارزش، پایهٔ بقیه |
| 2 | E15-S2 | قوت‌ها/ضعف‌ها — نیاز مستقیم PRD |
| 3 | E15-S3 | واژه‌نامه (i) — رفع ژارگون |
| 4 | E15-S7 | نمای ساده/متخصص — بعد از وجود محتوای ساده |
| — | **MVP slice** | S1+S2+S3+S7 |
| 5 | E15-S5 | نمودار بار انگشت/تعادل |
| 6 | E15-S4 | baseline compare — پایهٔ E9 |
| 7 | E15-S6 | delta badge — polish |

---

## ۱۶. خارج از scope

- نمودار خطی تاریخچه امتیاز (E6 v1 صریحاً exclude کرده).
- LLM-generated hints.
- compare چند layout (E9).
- تغییر scorer یا `ScoreBreakdown` schema (E4).

---

## ۱۷. وضعیت پیاده‌سازی (۱۴۰۵/۰۴/۱۰)

| استوری | وضعیت | یادداشت |
|--------|--------|---------|
| S1 Verdict Gauge | ✅ | gauge + baseline delta در UI |
| S2 Strengths/Weaknesses | ✅ | `deriveInsights(breakdown, baseline)` |
| S3 واژه‌نامه (i) | ✅ | hover + click، glossary کامل، hotspots ساده |
| S4 Baseline compare | ✅ | `baseline-compare.tsx` + wiring |
| S5 Finger load + hand balance | ✅ | `leftHandShare`/`rightHandShare` در breakdown |
| S6 Delta badge | ✅ | `score-delta-badge.tsx` + `useLiveScore` |
| S7 Simple/Expert toggle | ✅ | `useSyncExternalStore` — بدون flash |

**پوشش تست:** lib + component + integration — ۷۷+ تست pass.

---

## Changelog

| نسخه | تاریخ | تغییر |
|------|-------|-------|
| 0.3 | ۱۴۰۵/۰۴/۱۰ | تکمیل S4/S5/S6 + fixهای code review |
| 0.2 | ۱۴۰۵/۰۴/۱۰ | وضعیت پیاده‌سازی + یافته‌های code review |
| 0.1 | ۱۴۰۵/۰۴/۰۹ | پیش‌نویس اولیه E15 |
