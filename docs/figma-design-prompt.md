# پرامپت طراحی UI/UX برای Figma — PKBL

> **هدف این سند:** یک پرامپت کامل برای ابزار طراحی Figma (یا Figma AI / Make Designs) تا بر اساس **نیازمندی‌های محصول** یک رابط کاربری با UX خوب بسازد — **بدون** پیش‌فرض گرفتن از ظاهر، رنگ، تایپوگرافی یا چیدمان بصری فعلی.
>
> **نام محصول:** PKBL — آزمایشگاه چیدمان صفحه‌کلید فارسی  
> **شعار کوتاه:** «طراحی، ارزیابی و مقایسهٔ چیدمان صفحه‌کلید فارسی»

---

## دستورالعمل مهم برای طراح

**لطفاً تمام تصمیم‌های بصری را خودت بگیر.** این سند فقط می‌گوید *چه* باید وجود داشته باشد و *کاربر چه کاری* باید بتواند انجام دهد — نه *چطور* باید به نظر برسد.

- رنگ، فونت، spacing، سایه، border-radius، تم روشن/تاریک، و سبک بصری را **آزادانه** انتخاب کن.
- wireframe یا mockup موجود در کد یا مستندات فنی **الگو نیست**؛ فقط منبع نیازمندی‌های رفتاری.
- اگر بین نیازمندی‌ها تعارض دیدی، اولویت با **وضوح برای کاربر غیرمتخصص** و **جریان کاری صفحه‌کلید-محور** است.
- زبان رابط کاربری: **فارسی** (RTL). محتوای نمونه (labelها، hintها، پیام‌ها) را به فارسی بنویس.
- پلتفرم هدف: **دسکتاپ وب** (اولویت اصلی). موبایل secondary است.

---

## ۱. خلاصهٔ محصول و مسئله

### مسئله
کاربر فارسی‌زبان می‌خواهد چیدمان صفحه‌کلید بهتری از چیدمان پیش‌فرض پیدا کند، اما:
- ابزار تعاملی برای چیدن و ارزیابی ندارد
- نمی‌تواند با حدس بفهمد کدام چیدمان از نظر تایپ ده‌انگشتی، توزیع بار انگشت‌ها و الگوهای رایج نوشتار فارسی بهتر است
- مسیر رسیدن از «ایده» تا «نصب روی سیستم‌عامل» یکپارچه نیست (export در فاز بعد)

### راه‌حل
یک **وب‌اپ تعاملی** که:
1. روی یک **قالب فیزیکی ۶۰٪** (صفحه‌کلید ANSI-style کوچک) کار می‌کند
2. به کاربر اجازه می‌دهد **حروف فارسی و نمادهای رایج تایپ فارسی** را روی کلیدها بچیند
3. **در لحظه** چیدمان را بر اساس corpus فارسی امتیاز می‌دهد
4. **قوت‌ها، ضعف‌ها و نقاط پرهزینه** را نشان می‌دهد
5. چیدمان‌های خوب را در **جدول امتیازات** (leaderboard) ثبت می‌کند — **بدون نیاز به ورود/حساب کاربری**
6. در بلندمدت خروجی نصب‌پذیر برای Windows / macOS / Linux تولید می‌کند

### ارزش اصلی (Value Proposition)
این محصول یک **آزمایشگاه** است، نه یک نمایشگر ایستای چیدمان. ارزش برای کاربر:
- فهمیدن **چرا** یک چیدمان بهتر است
- مقایسهٔ کاندیدها
- حفظ و اشتراک چیدمان‌های قوی

---

## ۲. مخاطب و پرسونا

### پرسونای اصلی — «تایپ‌کنندهٔ فارسی»
- فارسی تایپ می‌کند (کار، مطالعه، شبکه‌های اجتماعی)
- **پیش‌زمینهٔ فنی ندارد:** نمی‌داند n-gram، ارگونومی، یا keyboard layout engineering چیست
- می‌خواهد سریع بفهمد: «چیدمانم خوب است یا بد؟» و «چه چیزی را عوض کنم؟»
- صبور برای خواندن جداول فنی نیست؛ به **قضاوت کیفی** و **توصیهٔ عملی** نیاز دارد

### پرسونای ثانویه — «علاقه‌مند به صفحه‌کلید»
- چیدمان‌های جامعه را مرور می‌کند
- layout خود را submit می‌کند (بدون login)
- از چیدمان‌های برتر به‌عنوان نقطهٔ شروع استفاده می‌کند

### پرسونای غیرهدف (v1)
- کاربرانی که می‌خواهند geometry فیزیکی دلخواه بسازند
- کاربرانی که زبان غیرفارسی یا layout غیر ۶۰٪ می‌خواهند
- کاربرانی که انتظار شبکهٔ اجتماعی کامل دارند

---

## ۳. اصول UX (نه بصری)

این اصول **الزام رفتاری** هستند؛ پیاده‌سازی بصری را خودت طراحی کن:

| اصل | معنی |
|-----|------|
| **صفحه‌کلید-محور** | مرکز تجربه یک نمای تعاملی شبیه صفحه‌کلید است — نه فرم‌های طولانی |
| **یک قضاوت، سپس جزئیات** | کاربر اول باید بفهمد «خوب/متوسط/ضعیف»؛ اعداد خام secondary |
| **Progressive disclosure** | اطلاعات ساده پیش‌فرض؛ جزئیات فنی فقط در «نمای متخصص» |
| **بازخورد فوری** | هر تغییر کلید → امتیاز و insight به‌روز (با debounce کوتاه ~۱۰۰–۱۵۰ms) |
| **از insight به action** | کلیک روی hotspot یا ضعف → highlight/select کلید مربوط روی keyboard |
| **baseline-relative** | مقایسه با چیدمان پیش‌فرض ۶۰٪، نه scale مطلق نامفهوم |
| **بدون اصطلاح بدون توضیح** | هر متریک فنی باید راهنمای ساده (مثلاً آیکن info) داشته باشد |
| **بدون login** | همهٔ جریان‌های v1 بدون حساب کاربری |
| **RTL-friendly** | shell و متن فارسی RTL؛ keyboard خودش LTR فیزیکی است |

---

## ۴. معماری اطلاعات — صفحات و ناحیه‌ها

طراحی را برای **کل محصول** (MVP + roadmap) در نظر بگیر. صفحات/ناحیه‌های زیر:

| # | صفحه/ناحیه | اولویت | توضیح |
|---|------------|--------|-------|
| 1 | **ویرایشگر اصلی (Editor)** | MVP — اصلی | صفحهٔ اصلی اپ؛ طراحی و امتیاز live |
| 2 | **جدول امتیازات (Leaderboard)** | MVP | فهرست چیدمان‌های برتر |
| 3 | **Submit به Leaderboard** | MVP | modal/flow ثبت چیدمان |
| 4 | **گالری قالب‌ها (Templates)** | post-MVP | چیدمان‌های جامعه و پیش‌فرض |
| 5 | **مقایسهٔ دو چیدمان (Compare)** | post-MVP | side-by-side |
| 6 | **مدیریت layoutهای محلی** | post-MVP | list/create/rename/delete |
| 7 | **Corpus سفارشی (Paste متن)** | post-MVP | textarea + preset «متن من» |
| 8 | **Export به OS** | آینده | Windows / macOS / Linux |
| 9 | **Landing + Onboarding** | pre-launch | intro + tour ۳ مرحله‌ای |
| 10 | **راهنما / واژه‌نامه** | MVP (درون پنل) | توضیح مفاهیم امتیازدهی |

---

## ۵. صفحهٔ اصلی — ویرایشگر (Editor)

### ۵.۱ هدف صفحه
کاربر بتواند:
- چیدمان را روی قالب ۶۰٪ ببیند و ویرایش کند
- بین لایهٔ base و shift جابه‌جا شود
- کاراکتر assign / swap / reset کند
- امتیاز و تحلیل را **هم‌زمان** ببیند
- پیش‌نویس auto-save شده باشد

### ۵.۲ قالب صفحه‌کلید (Keyboard Canvas)

**نیازمندی‌های محتوا:**
- نمایش **قالب فیزیکی ۶۰٪ ANSI-style** — geometry واقع‌گرایانه (عرض کلیدها متفاوت: Tab، Shift، Space، Enter، …)
- هر keycap نشان‌دهندهٔ کاراکتر **لایهٔ فعال** (base یا shift) است
- کلیدهای modifier (Ctrl, Shift, Tab, Caps Lock, Win, Alt, Menu, Backspace, Enter) **غیرقابل ویرایش** — باید visually distinct باشند
- spacebar **قابل ویرایش** (کاراکتر primary)
- کلید انتخاب‌شده: state مشخص
- کلید در حال drop (drag): highlight
- hotspot (حروف پرهزینه): visual indicator روی keycap (مثلاً ring یا badge) — حداکثر top 3 روی keyboard
- نام template: «Persian Standard 60%» / «چیدمان استاندارد فارسی ۶۰٪»

**نیازمندی‌های تعامل:**
- **Click روی کلید editable** → popover/palette برای انتخاب کاراکتر
- **Drag از character palette** → drop روی key → assign
- **Drag key → key** → swap کاراکترها
- **Click روی hotspot در پنل** → scroll/highlight/select key روی keyboard
- keyboard shortcuts: Undo (Ctrl/Cmd+Z), Redo, Esc برای بستن popover

### ۵.۳ لایه Base / Shift

- toggle واضح: **Base | Shift**
- visual distinction بین لایه‌ها (هر روشی که UX را بهتر می‌کند)
- در shift، نمادها و علائم نگارشی رایج فارسی assign می‌شوند

### ۵.۴ Character Palette (پالت کاراکتر)

**محتوا:**
- همهٔ کاراکترهای مجاز v1: **حروف فارسی + نمادهای رایج تایپ فارسی** (شامل اعداد فارسی، علائم نگارشی، ZWNJ، …)
- گروه‌بندی منطقی (مثلاً: حروف، اعداد، علائم) — روش گروه‌بندی را خودت انتخاب کن
- state **assigned** vs **unassigned** برای هر کاراکتر
- کاراکترهای duplicate (دو کلید یک حرف) — اگر applicable، warning

**تعامل:**
- click روی کاراکتر → حالت «منتظر انتخاب کلید» یا assign مستقیم اگر کلید انتخاب شده
- drag کاراکتر به keyboard

### ۵.۵ Toolbar (نوار ابزار)

عملیات موردنیاز:
| عمل | توضیح |
|-----|-------|
| **بازگشت (Undo)** | حداقل ۲۰ step |
| **ازنو (Redo)** | |
| **بازنشانی کلید** | reset کلید انتخاب‌شده — disabled اگر کلیدی انتخاب نشده |
| **بازنشانی همه** | reset همه editable keys — **نیاز به confirm dialog** |

### ۵.۶ Header / Shell

عناصر پیشنهادی (چیدمان را خودت تعیین کن):
- نام/لوگوی اپ: PKBL — آزمایشگاه چیدمان فارسی
- Layer toggle (Base/Shift)
- **Draft save indicator** با stateها:
  - «در حال بارگذاری پیش‌نویس…»
  - «در حال ذخیره…»
  - «پیش‌نویس ذخیره شد · [ساعت]»
  - پیام خطای ذخیره (اگر localStorage fail)
- لینk/nav به Leaderboard (وقتی موجود است)
- لینk به راهنما

### ۵.۷ Responsive — ویرایشگر

| breakpoint | رفتار |
|------------|-------|
| **≥ 1024px (desktop)** | keyboard در ستون اصلی؛ پنل analytics در sidebar (ترجیحاً sticky هنگام scroll) |
| **< 1024px** | analytics **بالای** keyboard (نه sticky)؛ keyboard و palette زیر |

**توجه:** mobile-first نیست؛ desktop تجربهٔ اصلی است. ولی layout نباید در tablet/mobile بشکند.

---

## ۶. پنل Analytics / Score — نیازمندی‌های کامل

این پنل **قلب فهم‌پذیری** محصول است. کاربر غیرمتخصص نباید با اعداد خام تنها بماند.

### ۶.۱ Corpus Preset Selector

کاربر باید preset corpus را انتخاب کند — امتیاز بر اساس آن محاسبه می‌شود:

| Preset | نام فارسی | توضیح کوتاه |
|--------|-----------|-------------|
| `wiki-fa` | ویکی‌پدیا فارسی | متن عمومی و دانشی — مناسب نوشتار رسمی |
| `varzesh3` | ورزش۳ | کامنت‌های ورزشی — زبان محاوره‌ای |
| `custom` (آینده) | متن من | paste متن شخصی کاربر |

- selector باید description کوتاه preset را نشان دهد
- تغییر preset → امتیاز و baseline دوباره محاسبه

### ۶.۲ Live Score

- **امتیاز کلی** prominent — جهت: **عدد بالاتر = چیدمان بهتر**
- هنگام debounce/recalculate: **عدد قبلی visible** با indication «در حال به‌روزرسانی» — بدون flicker
- **Delta badge گذرا** پس از هر ویرایش پایدار: «+۱۲» (بهبود) یا «−۸» (بدتر) — محو پس از ~۲ ثانیه
- در اولین محاسبه delta نشان داده نشود

### ۶.۳ Toggle: نمای ساده | نمای متخصص

| نمای ساده (پیش‌فرض) | نمای متخصص |
|---------------------|------------|
| Verdict gauge (قضاوت کیفی) | Breakdown کامل با اعداد |
| قوت‌ها و ضعف‌ها | unigramCost و متریک‌های debug |
| مقایسه با baseline | همه metric rowهای فنی |
| نمودار بار انگشت + تعادل دست | |
| Hotspots با زبان ساده | |
| Hint یک‌خطی | |

- toggle در بالای پنل
- preference کاربر persist شود (localStorage)

### ۶.۴ Verdict Gauge — قضاوت کلی

به‌جای عدد خام، کاربر باید **سریع** بفهمد وضعیت چیست:

- **سه باند کیفی:** ضعیف / متوسط / خوب (برچسب فارسی: مثلاً «نیازمند بهبود»، «قابل‌قبول»، «چیدمان خوب»)
- باندها **نسبت به چیدمان پیش‌فرض ۶۰٪** روی همان preset — نه absolute
- عدد خام total هم نمایش داده شود ولی **secondary** (کوچک‌تر، کم‌رنگ‌تر)
- screen reader: فقط تغییر برچسب کیفی announce شود

### ۶.۵ Baseline Compare — مقایسه با پیش‌فرض

- مرجع: امتیاز «چیدمان پیش‌فرض ۶۰٪» روی preset جاری
- نمایش delta نسبی: «+۱۸٪ بهتر از چیدمان پیش‌فرض» (رنگ مثبت/منفی)
- visualization مقایسه‌ای (مثلاً دو bar: شما vs پیش‌فرض) — فرم دقیق را خودت انتخاب کن

### ۶.۶ Ranking Hint — جملهٔ راهنمای یک‌خطی

یک جملهٔ concise فارسی زیر verdict — template-based، بدون AI:

نمونهٔ محتوا (اولین match برنده):
1. «برخی حروف پرکاربرد هنوز جایگاه ندارند — اول آن‌ها را بچینید.»
2. «بار روی کلیدهای دشوار (مثل انگشت کوچک) بالاست.»
3. «توالی‌های هم‌انگشتی زیاد است — حروف پرتکرار را از هم جدا کنید.»
4. «استفاده از ردیف home کم است — حروف پرتکرار را به مرکز ببرید.»
5. «بار بین دو دست نامتوازن است.»
6. «جابه‌جایی بین ردیف‌ها زیاد است.»
7. default: «چیدمان متعادل است — برای بهبود، نقاط پرهزینه را بررسی کنید.»

### ۶.۷ Strengths / Weaknesses — قوت‌ها و ضعف‌ها

- حداکثر **۳ قوت** + **۳ ضعف** برتر
- هر کارت: آیکن وضعیت + **عنوان فارسی ساده** + **یک جمله توصیه**
- نمونه ضعف: «بار انگشت کوچک بالاست — حروف پرتکرار را به انگشتان قوی‌تر منتقل کنید»
- نمونه قوت: «استفاده خوب از ردیف home»
- empty state (چیدمان ناقص): «اول چیدمان را کامل کنید»

**متریک‌هایی که insight از آن‌ها derive می‌شود:**
- homeRowUsage (درصد استفاده از ردیف home)
- handBalance (تعادل بار چپ/راست — ۱ = کاملاً متعادل)
- sameFingerBigrams (تعداد bigram هم‌انگشتی)
- weakKeyPenalty (بار روی کلیدهای دشوار)
- rowSwitching (جابه‌جایی بین ردیف‌ها)

### ۶.۸ Finger Load + Hand Balance — نمودارها

**بار انگشت** (`fingerLoad` — ۵ انگشت aggregate):
- thumb (شست), index (اشاره), middle (وسطی), ring (حلقه), pinky (کوچک)
- نمایش بصری (bar chart یا equivalent) — **ترجیح نمودار بر عدد خام**
- color coding: متعادل vs بیش‌بار (انگشت کوچک آستانهٔ پایین‌تر)

**تعادل دست** (`handBalance`):
- visualization دوسویه چپ/راست
- برچسب کیفی (مثلاً «متعادل» / «کمی نامتوازن»)

### ۶.۹ Hotspots — نقاط پرهزینه

- ranked list از **پرهزینه‌ترین حروف** (top 5 در panel؛ تا 10 در expand)
- هر ردیف: **حرف · هزینه/امتیاز · نام/موقعیت کلید**
- click → highlight key روی keyboard
- heat overlay روی keyboard فقط برای top 3

### ۶.۱۰ Breakdown — نمای متخصص (Accordion)

سه section — پیش‌فرض: اولی باز، بقیه بسته:

**الف) امتیاز n-gram**
| متریک | برچسب فارسی |
|-------|-------------|
| unigramScore | یونی‌گرام |
| bigramScore | بی‌گرام |
| trigramScore | تری‌گرام |

**ب) ارگونومی**
| متریک | برچسب فارسی | format |
|-------|-------------|--------|
| homeRowUsage | ردیف home | درصد |
| handBalance | تعادل دست | ۰–۱ |
| fingerLoad | بار انگشت | mini bars |
| sameFingerBigrams | بی‌گرام هم‌انگشتی | عدد صحیح |
| sameHandBigrams | بی‌گرام هم‌دست | عدد صحیح |
| handAlternation | تعویض دست | عدد صحیح |
| rowSwitching | تعویض ردیف | عدد صحیح |

**ج) جریمه‌ها (debug)**
| متریک | برچسب فارسی |
|-------|-------------|
| weakKeyPenalty | کلیدهای ضعیف |
| unigramCost | هزینه خام یونی‌گرام |

### ۶.۱۱ Metric Glossary — واژه‌نامه

هر متریک/اصطلاح فنی باید **آیکن info (i)** داشته باشد → popover/tooltip با توضیح ساده فارسی.

| اصطلاح | تعریف ساده برای کاربر |
|--------|----------------------|
| n-gram | الگوی چند حرف پشت‌سرهم در متن |
| یونی‌گرام | تک‌حرف و فراوانی آن در متن |
| بی‌گرام | دو حرف پشت‌سرهم (مثل ‹سل› در ‹سلام›) |
| تری‌گرام | سه حرف پشت‌سرهم |
| ردیف home | ردیف وسط صفحه‌کلید — جای استراحت انگشتان |
| بار انگشت | چقدر هر انگشت تایپ می‌کند |
| تعادل دست | توزیع بار بین دست چپ و راست |
| بی‌گرام هم‌انگشتی | دو حرف پشت‌سرهم با یک انگشت — کند و خسته‌کننده |
| کلید ضعیف | جایگاه دشوار (مثل گوشه / انگشت کوچک) |
| تعویض ردیف | جابه‌جایی بین ردیف بالا/وسط/پایین |

- بخش جمع‌وجور **«راهنمای امتیاز»** (collapsible یا modal) با همهٔ مفاهیم
- popover: keyboard accessible (Esc, focus trap)

---

## ۷. Leaderboard — جدول امتیازات (MVP)

### ۷.۱ لیست
- sort: **score نزولی** (بالاتر = بهتر)
- filter: بر اساس corpus preset
- pagination
- ستون‌ها: **رتبه · نام/alias · امتیاز · تاریخ · preset**

### ۷.۲ Submit Flow
- **بدون login**
- alias اختیاری (نام نمایشی)
- نمایش: layout فعلی + score + preset
- **Pre-submit preview:** «این layout از رتبه ۱ بهتر است» (اگر applicable)
- **Post-submit:** celebration UI
- **Reject states:** امتیاز پایین‌تر از threshold، duplicate layout
- rate limit feedback: «حداکثر ۵ submit در ساعت»

### ۷.۳ Empty States
- leaderboard خالی: «هنوز چیدمانی ثبت نشده — اولین نفر باشید»
- loading / error states

---

## ۸. Compare Mode — مقایسهٔ دو چیدمان (Roadmap)

### ۸.۱ Layout
- انتخاب Layout A و Layout B (از local saves یا template)
- **دو keyboard** side-by-side
- **دو score panel** (یا یک panel مقایسه‌ای)
- highlight تفاوت keys بین A و B

### ۸.۲ Comparison Summary Table
- جدول: metric × layout A × layout B
- winner indicator per metric
- overall winner (score بالاتر)

---

## ۹. مدیریت Layoutهای محلی (Roadmap)

- list layouts ذخیره‌شده در browser
- عملیات: create · rename · delete · duplicate · load
- هر layout: نام · تاریخ · score snapshot · preset
- load → بازگشت به editor

---

## ۱۰. Custom Corpus — Paste متن (Roadmap)

### UI
- textarea با placeholder راهنما (مثلاً «متن فارسی خود را اینجا paste کنید…»)
- preset «متن من» در selector
- نمایش char count
- **هشدار** در ۵۰KB
- **reject** در ۱۰۰KB با پیام واضح

### UX
- پس از paste → امتیاز سریع به‌روز (< 500ms برای 50KB)
- loading/processing state برای متن بزرگ

---

## ۱۱. پیشنهاد جایگذاری کاراکتر (Roadmap)

- برای هر حرف **بدون جایگاه (unassigned):** top 3 پیشنهاد key
- دکمه **«پیشنهاد خودکار»** → preview diff → confirm/cancel
- list کاراکترهای unassigned + completeness score (درصد پوشش charset)

---

## ۱۲. Export به سیستم‌عامل (آینده)

صفحه/modal export با:
- انتخاب پلتفرم: **Windows (.klc/MSKLC) · macOS (.keylayout) · Linux (XKB)**
- preview mappings (base + shift)
- download bundle + README نصب فارسی
- **در v1 لازم نیست کامل طراحی شود** — ولی placeholder/nav برای آینده مفید است

---

## ۱۳. Landing + Onboarding (Pre-launch)

### Landing
- عنوان: «آزمایشگاه چیدمان فارسی»
- توضیح کوتاه value proposition
- CTA: «شروع طراحی» → editor
- لینk leaderboard
- لینk docs/راهنما

### Quick Tour (۳ step)
1. «روی کلیدها کلیک کنید یا بکشید تا حروف را بچینید»
2. «امتیاز شما live به‌روز می‌شود — بالاتر بهتر است»
3. «قوت‌ها و ضعف‌ها می‌گویند چه چیزی را عوض کنید»

- skip tour
- dismiss + «دیگر نشان نده»

---

## ۱۴. Stateها و Edge Cases — طراحی همهٔ حالت‌ها

برای هر صفحه/کامپوننت اصلی، این stateها را طراحی کن:

| State | مثال |
|-------|------|
| **Default** | چیدمان کامل با score |
| **Loading** | اولین بارگذاری score / restore draft |
| **Stale/updating** | score در حال recalculate |
| **Empty** | چیدمان ناقص، leaderboard خالی، no local layouts |
| **Error** | save fail، API fail، invalid KLE import |
| **Disabled** | undo unavailable، reset key بدون selection |
| **Confirm** | reset all، auto-fill suggestions |
| **Success** | submit leaderboard، export download |
| **Drag active** | character/key در حال drag |
| **Selected key** | popover باز |
| **Hotspot linked** | key highlighted از panel |

### پیام‌های خطای نمونه (فارسی)
- «ذخیرهٔ پیش‌نویس ممکن نشد — فضای مرورگر پر است»
- «این کاراکتر در محدودهٔ مجاز نیست»
- «فایل KLE نامعتبر است»
- «متن بیش از حد مجاز (۱۰۰KB) است»

---

## ۱۵. Accessibility (الزامات)

- keyboard navigation کامل در editor (Tab, Enter, Esc, shortcuts)
- focus visible روی همه interactive elements
- contrast مناسب (WCAG AA هدف)
- `aria-live="polite"` برای verdict و save indicator
- `aria-pressed` برای toggles (layer, view mode)
- accordion: `aria-expanded`
- نمودارها: `role="img"` + `aria-label` فارسی
- popover: Esc برای بستن، focus management

---

## ۱۶. محتوا و Copy — زبان فارسی

- **همهٔ UI به فارسی**
- اعداد: پشتیبانی از ارقام فارسی در نمایش (locale fa-IR)
- از اصطلاحات انگلیسی در UI ساده پرهیز کن (به‌جز نام‌های فنی در نمای متخصص با tooltip)
- tone: **مستقیم، کمک‌کننده، غیر condescending** — مثل یک مربی تایپ، نه manual فنی
- نام محصول در header: PKBL — آزمایشگاه چیدمان فارسی

---

## ۱۷. محدودیت‌های نسخهٔ اول (Out of Scope)

این‌ها را **طراحی نکن** یا فقط as «Coming soon»:
- Login / signup / profile
- شبکهٔ اجتماعی (follow, comment, …)
- ویرایشگر geometry فیزیکی دلخواه (تغییر اندازه/جای کلیدها)
- پشتیبانی زبان غیرفارسی
- بهینه‌ساز خودکار عمیق (AI auto-layout)
- نمودار خطی تاریخچه امتیاز در طول زمان
- LLM-generated hints
- Mobile-first layout
- Moderation پیشرفته جامعه

---

## ۱۸. Deliverables مورد انتظار از Figma

لطفاً تحویل بده:

1. **Design System پایه** — tokens (خودت تعریف کن)، typography scale، spacing، component states
2. **Desktop frames (1440px و 1280px)** برای:
   - Editor — نمای ساده analytics
   - Editor — نمای متخصص analytics
   - Editor — حالت‌های drag, popover, hotspot
   - Leaderboard list + submit flow
3. **Tablet/Mobile frames (768px)** — editor stacked layout
4. **Component library:**
   - Keycap (default, selected, modifier, hotspot, drop target)
   - Character chip (assigned/unassigned)
   - Verdict gauge
   - Insight card (strength/weakness)
   - Metric row + info popover
   - Finger load chart + hand balance viz
   - Hotspot list item
   - Corpus preset selector
   - Confirm dialog
   - Draft save indicator states
5. **Prototype flows:**
   - assign char via click
   - assign via drag
   - swap keys
   - change preset → score update
   - hotspot click → key highlight
   - submit to leaderboard
6. **(اختیاری ولی مطلوب)** frames roadmap: Compare, Custom corpus, Layout manager, Landing

---

## ۱۹. خلاصهٔ یک پارagraph برای paste مستقیم در Figma AI

> **PKBL** is a Persian (RTL) desktop-first web app — an interactive laboratory for designing, scoring, and comparing **60% ANSI keyboard layouts** for Persian typing. The core experience is **keyboard-centric**: users see a realistic 60% keyboard, toggle Base/Shift layers, assign Persian letters and common symbols via click or drag-and-drop from a character palette, undo/redo, and reset keys. A live analytics panel updates in real time (higher score = better) based on corpus presets (Wikipedia FA, Varzesh3, future: custom pasted text). Non-expert users must instantly understand layout quality via a **qualitative verdict** (good/ok/poor), **strengths/weaknesses cards** with actionable advice, **baseline comparison vs default layout**, finger load and hand balance charts, and ranked **hotspots** linked to keys. Expert view exposes full n-gram/ergonomics breakdown. No login in v1. Also design: leaderboard submit/list, draft auto-save states, empty/error/loading states, accessibility, and roadmap screens (compare two layouts, local layout manager, custom corpus paste, OS export, landing + 3-step tour). **All visual decisions (colors, typography, layout, style) are yours — deliver excellent UX clarity for non-technical Persian typists.**

---

## ۲۰. Changelog

| نسخه | تاریخ | تغییر |
|------|-------|-------|
| 1.0 | ۱۴۰۵/۰۴/۱۰ | نسخهٔ اول — پرامپت کامل بر اساس PRD, epics, architecture |
