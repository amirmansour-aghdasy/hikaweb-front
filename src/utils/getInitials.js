// getInitials: خروجی -> "م ج" یا "A R" یا "A" (اگر فقط یک کلمه باشه)
// options.titles: لیست القاب/عنوان‌هایی که باید حذف شوند
export const getInitials = (fullName, options = {}) => {
    if (!fullName) return "";

    const titles = options.titles || ["سرکار خانم", "سرکارخانم", "آقای", "اقای", "دکتر", "مهندس", "استاد"];

    // تابعی برای پاک کردن علامت‌گذاری‌های اضافی از ابتدا/انتها
    const cleanPunc = (s) => s.replace(/^[\.,؛:!؟\-\—\(\)\[\]\"\'«»،]+|[\.,؛:!؟\-\—\(\)\[\]\"\'«»،]+$/g, "");

    // جدا کردن به توکن‌ها و پاک‌کردن توکن‌های خالی
    let tokens = fullName
        .trim()
        .split(/\s+/)
        .map((t) => cleanPunc(t))
        .filter(Boolean);
    let lowerTokens = tokens.map((t) => t.toLowerCase());

    // عناوین را بر اساس تعداد کلمات مرتب می‌کنیم (تا "سرکار خانم" درست match شود)
    const titlesSorted = [...titles].sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length || b.length - a.length);

    // حذف عناوین از ابتدای tokens (تا وقتی که عنوانی پیدا شود)
    let changed = true;
    while (changed && tokens.length) {
        changed = false;
        for (const title of titlesSorted) {
            const titleTokens = title.split(/\s+/).map((t) => t.toLowerCase());
            if (titleTokens.length <= lowerTokens.length && titleTokens.every((tt, i) => lowerTokens[i] === tt)) {
                tokens.splice(0, titleTokens.length);
                lowerTokens.splice(0, titleTokens.length);
                changed = true;
                break;
            }
        }
    }

    if (tokens.length === 0) return "";

    const firstChar = tokens[0][0] || "";
    const lastChar = tokens.length > 1 ? tokens[tokens.length - 1][0] : "";

    // اگر حرف لاتین بود بزرگ می‌کنیم، در غیر این صورت همان حرف را برمی‌گردانیم
    const formatChar = (ch) => (/[A-Za-z]/.test(ch) ? ch.toUpperCase() : ch);

    return lastChar ? `${formatChar(firstChar)} ${formatChar(lastChar)}` : `${formatChar(firstChar)}`;
};
