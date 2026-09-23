export const slideshowDefaults = { enabled: true, interval: 15, random: false, auto: true, idleMinutes: 5 };

/** Sanitize stale or damaged browser settings against the hosted catalog. */
export function normalizeSlideshow(value, ids) {
  const s = value && typeof value === 'object' ? value : {};
  const bool = (key) => typeof s[key] === 'boolean' ? s[key] : slideshowDefaults[key];
  const number = (key, min, max) => Number.isFinite(s[key]) ? Math.min(max, Math.max(min, s[key])) : slideshowDefaults[key];
  const selected = Array.isArray(s.selected) ? [...new Set(s.selected.filter(id => ids.includes(id)))] : [];
  return { enabled: bool('enabled'), interval: number('interval', 3, 300), random: bool('random'), auto: bool('auto'), idleMinutes: number('idleMinutes', 1, 60), selected: selected.length ? selected : [...ids] };
}

export function nextImage(ids, current, direction = 1, random = false, roll = Math.random()) {
  if (ids.length < 2) return ids[0];
  if (random && direction > 0) {
    const choices = ids.filter(id => id !== current);
    return choices[Math.min(choices.length - 1, Math.floor(Math.max(0, roll) * choices.length))];
  }
  const index = Math.max(0, ids.indexOf(current));
  return ids[(index + direction + ids.length) % ids.length];
}

export function shouldEnterScreensaver({ article, open, visible, busy, auto, idleMinutes, elapsed }) {
  return !article && !open && visible && !busy && auto && elapsed >= idleMinutes * 60000;
}

export function hexToHsl(hex) {
  const rgb = /^#[\da-f]{6}$/i.test(hex) ? hex : '#8a72ee';
  const [r, g, b] = [1, 3, 5].map(i => parseInt(rgb.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  let h = 250, s = 0;
  if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return { hue: Math.round(h), saturation: Math.round(s * 100), lightness: Math.round(l * 100) };
}

export function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}
