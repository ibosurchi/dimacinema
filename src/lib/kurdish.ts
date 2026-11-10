/**
 * Kurdish Sorani formatting & digit helpers
 */

const kurdishIndicDigits: { [key: string]: string } = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
};

/**
 * Converts Western Arabic digits (0-9) to Eastern/Kurdish-Indic digits (٠-٩)
 */
export function toKurdishDigits(val: number | string | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  return str.replace(/[0-9]/g, (w) => kurdishIndicDigits[w] || w);
}

/**
 * Format movie/episode duration to Kurdish (e.g., ٢ کاتژمێر و ١٥ خولەک or ٤٥ خولەک)
 */
export function formatKurdishDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "دیاری نەکراوە";
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;

  if (hours > 0 && remainingMins > 0) {
    return `${toKurdishDigits(hours)} کاتژمێر و ${toKurdishDigits(remainingMins)} خولەک`;
  }
  if (hours > 0) {
    return `${toKurdishDigits(hours)} کاتژمێر`;
  }
  return `${toKurdishDigits(remainingMins)} خولەک`;
}

/**
 * Format rating to one decimal with Kurdish digits, e.g. 8.4 -> ٨.٤
 */
export function formatKurdishRating(rating: number): string {
  if (!rating || rating <= 0) return toKurdishDigits("0.0");
  const rounded = Number(rating).toFixed(1);
  return toKurdishDigits(rounded);
}

/**
 * Format view counts cleanly, e.g. 15400 -> "١٥.٤ هەزار بینەر"
 */
export function formatKurdishViews(views: number): string {
  if (!views || views <= 0) return `${toKurdishDigits(0)} بینین`;
  if (views >= 1000000) {
    return `${toKurdishDigits((views / 1000000).toFixed(1))} ملیۆن بینەر`;
  }
  if (views >= 1000) {
    return `${toKurdishDigits((views / 1000).toFixed(1))} هەزار بینەر`;
  }
  return `${toKurdishDigits(views)} بینەر`;
}

/**
 * Transliterate or slugify Kurdish & English text for clean URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
