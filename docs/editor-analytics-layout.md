# پنل Analytics — spec طراحی (E6)

> **نسخه:** 0.3  
> **وضعیت:** پیاده‌سازی شده (E6 ✅)  
> **مرجع:** [epics E6](./epics.md) · [architecture §5.7](./architecture.md)  
> **اصل:** مینیمال، خوانا، keyboard-first — بدون نمودار پیچیده در v1

---

## ۱. اصول UX

| اصل | کاربرد در E6 |
|-----|--------------|
| **یک عدد، یک تصمیم** | امتیاز کلی بزرگ و ثابت؛ جزئیات فقط در صورت نیاز |
| **Progressive disclosure** | breakdown در accordion بسته؛ hint یک خط در بالا |
| **Consistency** | همان palette E5: `slate-900/950`، accent `sky`، border `slate-800` |
| **Stale-while-revalidate** | هنگام debounce، عدد قبلی + opacity کم؛ بدون flicker |
| **Link to action** | hotspot → highlight کلید؛ کلیک hotspot → scroll/select key |
| **Plain language** | برچسب فارسی؛ hint template — بدون اصطلاح فنی raw cost |

---

## ۲. چیدمان صفحه (desktop ≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│ header: عنوان · LayerToggle (موجود)                              │
├──────────────────────────────────────────┬──────────────────────┤
│                                          │  ScorePanel (sticky) │
│  toolbar (موجود)                         │  ┌─────────────────┐ │
│                                          │  │ preset select   │ │
│  KeyboardCanvas                          │  │ امتیاز: ۸۴۲     │ │
│  (+ hotspot ring روی keycap)             │  │ hint یک‌خطی     │ │
│                                          │  ├─────────────────┤ │
│                                          │  │ Hotspots (top5) │ │
│  CharacterPalette (موجود)                │  ├─────────────────┤ │
│                                          │  │ Breakdown ▼     │ │
│                                          │  └─────────────────┘ │
└──────────────────────────────────────────┴──────────────────────┘
```

**`<1024px`:** ScorePanel بالای keyboard (نه sticky)؛ breakdown و hotspots زیر keyboard.

**`editor-shell` refactor (پیاده‌سازی):**
- `grid lg:grid-cols-[1fr_280px] gap-4` — wrapper با `lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5.5rem)] lg:overflow-y-auto`
- ستون چپ: toolbar + keyboard + palette (بدون تغییر رفتار)
- ستون راست: `ScorePanel`؛ `<1024px` با `order-1` بالای keyboard

---

## ۳. درخت کامپوننت (composition)

```
src/components/editor/analytics/
├── score-panel.tsx           # compound root
├── score-hero.tsx            # total + loading + preset
├── ranking-hint.tsx          # E6-S4
├── hotspot-list.tsx          # E6-S3 ranked list
├── breakdown-accordion.tsx   # E6-S2
├── metric-row.tsx            # label + value (shared)
├── finger-load-bars.tsx      # mini horizontal bars
├── analytics-labels.ts       # map فارسی
├── ranking-hints.ts          # قوانین template
└── use-live-score.ts         # debounce + computeScore client-side
```

**الگو:** `ScorePanel` فقط layout؛ داده از `useLiveScore(layout, presetId)`.

---

## ۴. Score Hero (E6-S1)

### محتوا
1. **Preset selector** — `<select>` ساده یا segmented control دو گزینه:
   - `wiki-fa` → «ویکی‌پدیا فارسی»
   - `varzesh3` → «ورزش۳»
2. **امتیاز کلی** — `text-4xl font-bold tabular-nums`، جهت: **بالاتر بهتر**
3. **وضعیت loading** — opacity `0.6` روی hero؛ **عدد قبلی visible** (stale)

### رفتار
- debounce **120ms** پس از تغییر layout
- preset در `localStorage` key: `pkbl-corpus-preset`
- scoring: client-side `computeScore` + artifact preset (تا E12 آماده شود)

---

## ۵. Ranking Hint (E6-S4)

یک `<p>` زیر امتیاز، `text-sm text-slate-400`، حداکثر ۲ جمله.

**اولویت قوانین** (اولین match برنده است):

| # | شرط | متن hint |
|---|-----|----------|
| 1 | `unigramCost` بالا + char بدون assign | «برخی حروف پرکاربرد هنوز جایگاه ندارند — اول آن‌ها را بچینید.» |
| 2 | `weakKeyPenalty` > p75 baseline* | «بار روی کلیدهای دشوار (مثل انگشت کوچک) بالاست.» |
| 3 | `sameFingerBigrams` > p75 | «توالی‌های هم‌انگشتی زیاد است — حروف پرتکرار را از هم جدا کنید.» |
| 4 | `homeRowUsage` < 45% | «استفاده از ردیف home کم است — حروف پرتکرار را به مرکز ببرید.» |
| 5 | `handBalance` < 0.85 | «بار بین دو دست نامتوازن است.» |
| 6 | `rowSwitching` > p75 | «جابه‌جایی بین ردیف‌ها زیاد است.» |
| 7 | default | «چیدمان متعادل است — برای بهبود، hotspots را بررسی کنید.» |

\* p75: از golden fixture یا ثابت‌های v1 در `ranking-hints.ts` (قابل tune بعداً).

---

## ۶. Hotspots (E6-S3)

### لیست (primary)
- نمایش **top 5** در panel (epics: top 10 — بقیه در «نمایش همه» expand)
- هر ردیف: `حرف · امتیاز هزینه · نام کلید`
- کلیک → `selectKey(keyId)` + flash highlight (reuse `flashDropTarget`)

### Heat روی keyboard (secondary)
- فقط برای top 3 hotspot: ring `ring-2 ring-amber-400/70`
- بدون gradient رنگی — مینیمال
- prop جدید `hotspotKeyIds: Set<string>` روی `KeyboardCanvas`

---

## ۷. Breakdown Accordion (E6-S2)

سه بخش، **همه بسته به‌طور پیش‌فرض** جز section اول:

### الف) امتیاز n-gram (باز پیش‌فرض)
| field | برچسب FA | format |
|-------|----------|--------|
| `unigramScore` | یونی‌گرام | `+۱۲۳` (signed, 0 decimal) |
| `bigramScore` | بی‌گرام |同上 |
| `trigramScore` | تری‌گرام |同上 |

### ب) ارگونومی
| field | برچسب FA | format |
|-------|----------|--------|
| `homeRowUsage` | ردیف home | `۶۲٪` |
| `handBalance` | تعادل دست | `۰٫۹۱` (0–1) |
| `fingerLoad` | بار انگشت | mini bars — **۵ انگشت** (aggregate هر دو دست؛ نوع `Record<Finger, number>` در E4) |
| `sameFingerBigrams` | بی‌گرام هم‌انگشتی | عدد صحیح |
| `sameHandBigrams` | بی‌گرام هم‌دست | عدد صحیح |
| `handAlternation` | تعویض دست | عدد صحیح |
| `rowSwitching` | تعویض ردیف | عدد صحیح |

### ج) جریمه‌ها (debug-light)
| field | برچسب FA | format |
|-------|----------|--------|
| `weakKeyPenalty` | کلیدهای ضعیف | عدد |
| `unigramCost` | هزینه خام یونی‌گرام | عدد (muted `text-slate-500`) |

**نمایش finger load (v1):**

```
اشاره   ████████░░  ۳۲٪
کوچک    ███░░░░░░░  ۱۸٪
```

> **v2 (اختیاری):** تفکیک دست → `Record<Hand, Record<Finger, number>>` و ۱۰ bar.

---

## ۸. برچسب‌های فارسی (`analytics-labels.ts`)

```typescript
export const FINGER_LABEL_FA: Record<Finger, string> = {
  thumb: "شست",
  index: "اشاره",
  middle: "وسطی",
  ring: "حلقه",
  pinky: "کوچک",
};

export const HAND_LABEL_FA: Record<Hand, string> = {
  left: "چپ",
  right: "راست",
};

export const BREAKDOWN_SECTION_FA = {
  ngram: "امتیاز n-gram",
  ergonomics: "ارگونومی",
  penalties: "جریمه‌ها",
} as const;

export const ANALYTICS_PANEL_SECTION_FA = {
  breakdown: "جزئیات امتیاز",
  hotspots: "نقاط پرهزینه",
} as const;
```

---

## ۹. State و data flow

```typescript
// use-live-score.ts
type LiveScoreState = {
  result: ScoreResult | null;
  isStale: boolean;      // layout changed, debounce pending
  error: string | null;
  presetId: CorpusPresetId;
};
```

- **Source of truth layout:** `useEditorStore` (موجود)
- **Analytics state:** hook محلی یا slice جدا در store — ترجیح hook تا store شلوغ نشود
- **بدون prop drilling:** `ScorePanel` خودش layout را از store می‌خواند

---

## ۱۰. Accessibility (حداقل v1)

- preset: `<label>` + `aria-describedby` برای description کوتاه
- accordion: `<button aria-expanded>`
- hotspot list: `<button>` per row، focus visible
- امتیاز: `aria-live="polite"` فقط روی تغییر total (نه هر breakdown field)

---

## ۱۱. mapping به استوری‌های E6

| استوری | کامپوننت / فایل |
|--------|-----------------|
| E6-S1 | `score-hero.tsx`, `use-live-score.ts` |
| E6-S2 | `breakdown-accordion.tsx`, `finger-load-bars.tsx` |
| E6-S3 | `hotspot-list.tsx` + prop `hotspotKeyIds` در `keycap.tsx` |
| E6-S4 | `ranking-hint.tsx`, `ranking-hints.ts` |

---

## ۱۲. خارج از scope v1

- نمودار خطی تاریخچه امتیاز
- compare دو layout (E9)
- custom corpus selector (E7)
- انیمیشن شمارنده امتیاز
- LLM-generated hints

---

## Changelog

| نسخه | تاریخ | تغییر |
|------|-------|-------|
| 0.3 | ۱۴۰۵/۰۴/۰۸ | رفع review gaps: a11y accordion، hotspot/selected، stale opacity، برچسب‌های FA |
| 0.2 | ۱۴۰۵/۰۴/۰۸ | هم‌تراز با پیاده‌سازی؛ finger load ۵ bar؛ known gaps |
| 0.1 | ۱۴۰۵/۰۴/۰۸ | پیشنهاد اولیه — layout، labels، hints |
