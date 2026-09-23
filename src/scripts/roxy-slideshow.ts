import { gallery } from '../config/roxy-gallery';
import { normalizeSlideshow, nextImage, shouldEnterScreensaver } from '../utils/roxy-slideshow.mjs';
import { t } from '../utils/roxy-i18n';

const key = 'roxy-slideshow-v1';
const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
let stored: unknown;
try { stored = JSON.parse(localStorage.getItem(key) || '{}'); } catch { stored = {}; }
let prefs = normalizeSlideshow(stored, gallery.map(image => image.id));
let current: string = prefs.selected[0];
let timer: ReturnType<typeof setTimeout> | undefined;
let lastInput = Date.now();
let revision = 0;
const failed = new Set<string>();
const saver = $<HTMLDialogElement>('#screensaver');
const staticBackground = document.body.dataset.staticBackground === 'true';
const article = document.body.dataset.article === 'true';
const normalSurfaces = Array.from(document.querySelectorAll<HTMLElement>('.hero-image,.wallpaper'));
const saverSurface = $('.screensaver-image');
type Surface = { element: HTMLElement; layers: HTMLImageElement[]; active: number };
const surfaces: Surface[] = [...normalSurfaces, saverSurface].map(element => {
  const layers = [0, 1].map(() => {
    const img = new Image(); img.alt = ''; img.className = 'background-slide'; img.decoding = 'async';
    element.append(img); return img;
  });
  return { element, layers, active: 0 };
});

function persist() { try { localStorage.setItem(key, JSON.stringify(prefs)); } catch {} }
function available(): string[] { return prefs.selected.filter((id: string) => !failed.has(id)); }
function sync() {
  $<HTMLInputElement>('#slideshow-enabled').checked = prefs.enabled;
  $<HTMLInputElement>('#slideshow-random').checked = prefs.random;
  $<HTMLInputElement>('#slideshow-interval').value = String(prefs.interval);
  $<HTMLInputElement>('#screensaver-auto').checked = prefs.auto;
  $<HTMLInputElement>('#screensaver-idle').value = String(prefs.idleMinutes);
  $<HTMLInputElement>('#screensaver-idle').disabled = !prefs.auto;
  document.querySelectorAll<HTMLButtonElement>('[data-slide-pause]').forEach(button => {
    button.textContent = prefs.enabled ? 'Ⅱ' : '▶';
    button.setAttribute('aria-label', t(prefs.enabled ? 'pause' : 'play'));
    button.setAttribute('aria-pressed', String(!prefs.enabled));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-slide-prev],[data-slide-next]').forEach(button => {
    button.disabled = available().length < 2 || (!saver.open && staticBackground);
  });
}

function schedule() {
  clearTimeout(timer);
  if (document.hidden || !prefs.enabled || available().length < 2) return;
  if (!saver.open && (staticBackground || document.documentElement.dataset.mode === 'none')) return;
  timer = setTimeout(() => { void step(1); }, prefs.interval * 1000);
}

async function paint(id: string) {
  const image = gallery.find(image => image.id === id);
  if (!image) return;
  const token = ++revision;
  const loaded = new Image();
  const ok = await new Promise<boolean>(resolve => {
    const timeout = setTimeout(() => resolve(false), 12000);
    loaded.onload = () => { clearTimeout(timeout); resolve(true); };
    loaded.onerror = () => { clearTimeout(timeout); resolve(false); };
    loaded.src = image.src;
  });
  if (token !== revision) return;
  if (!ok) {
    failed.add(id); sync();
    const fallback = available()[0];
    if (fallback) await paint(fallback);
    return;
  }
  current = id;
  for (const surface of surfaces) {
    if (surface.element === saverSurface ? !saver.open : staticBackground) continue;
    const next = 1 - surface.active;
    const layer = surface.layers[next];
    layer.src = image.src;
    layer.style.objectPosition = surface.element === saverSurface ? 'center' : image.position;
    surface.layers[surface.active].classList.remove('visible');
    layer.classList.add('visible');
    surface.active = next;
    surface.element.dataset.imageId = id;
  }
  schedule();
}

async function step(direction: number) {
  clearTimeout(timer);
  const id = nextImage(available(), current, direction, prefs.random);
  if (id) await paint(id);
}

function change() { persist(); sync(); schedule(); lastInput = Date.now(); }
for (const [id, field] of [['slideshow-enabled', 'enabled'], ['slideshow-random', 'random'], ['screensaver-auto', 'auto']] as const) {
  $<HTMLInputElement>(`#${id}`).onchange = e => { prefs[field] = (e.target as HTMLInputElement).checked; change(); };
}
for (const [id, field] of [['slideshow-interval', 'interval'], ['screensaver-idle', 'idleMinutes']] as const) {
  const input = $<HTMLInputElement>(`#${id}`);
  input.oninput = () => {
    if (!input.validity.valid || input.value === '') return;
    prefs[field] = Number(input.value); persist(); schedule(); lastInput = Date.now();
  };
  input.onchange = e => {
    prefs = normalizeSlideshow({ ...prefs, [field]: Number((e.target as HTMLInputElement).value) }, gallery.map(image => image.id)); change();
  };
}
document.querySelectorAll<HTMLButtonElement>('[data-slide-prev]').forEach(b => b.onclick = () => { void step(-1); });
document.querySelectorAll<HTMLButtonElement>('[data-slide-next]').forEach(b => b.onclick = () => { void step(1); });
document.querySelectorAll<HTMLButtonElement>('[data-slide-pause]').forEach(b => b.onclick = () => { prefs.enabled = !prefs.enabled; change(); });

let controlsTimer: ReturnType<typeof setTimeout> | undefined;
let returnFocus: HTMLElement | null = null;
let savedScroll = 0;
let savedOverflow = '';
function showControls() {
  saver.classList.add('controls-visible'); clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => saver.classList.remove('controls-visible'), 3000);
}
function enterScreensaver() {
  if (saver.open) return;
  savedScroll = window.scrollY;
  savedOverflow = document.body.style.overflow;
  returnFocus = document.activeElement as HTMLElement | null;
  $('#appearance').hidden = true; $('#appearance-open').setAttribute('aria-expanded', 'false');
  saver.showModal(); document.body.style.overflow = 'hidden';
  showControls(); sync(); void paint(current);
}
document.querySelectorAll<HTMLButtonElement>('[data-saver-open]').forEach(b => b.onclick = enterScreensaver);
$('#screensaver-close').onclick = () => saver.close();
saver.addEventListener('close', () => {
  ++revision; clearTimeout(controlsTimer);
  document.body.style.overflow = savedOverflow;
  returnFocus?.focus({ preventScroll: true });
  window.scrollTo({ top: savedScroll, behavior: 'instant' });
  lastInput = Date.now(); sync(); schedule();
});
saver.addEventListener('pointermove', showControls);
saver.addEventListener('pointerdown', showControls);
saver.addEventListener('keydown', e => {
  showControls();
  if (e.key === 'ArrowLeft') { e.preventDefault(); void step(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); void step(1); }
});
for (const event of ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']) {
  window.addEventListener(event, () => { lastInput = Date.now(); }, { passive: true });
}
document.addEventListener('visibilitychange', () => { lastInput = Date.now(); schedule(); });
// Settings and text input must not be interrupted by an idle transition.
setInterval(() => {
  const active = document.activeElement;
  const busy = !$('#appearance').hidden || !!document.querySelector('.drawer-open') || !!active?.matches('input,textarea,select,[contenteditable=true]') || Array.from(document.querySelectorAll('audio,video')).some(el => !(el as HTMLMediaElement).paused);
  if (shouldEnterScreensaver({ article, open: saver.open, visible: !document.hidden, busy, auto: prefs.auto, idleMinutes: prefs.idleMinutes, elapsed: Date.now() - lastInput })) enterScreensaver();
}, 1000);
new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
window.addEventListener('roxy:language', sync);

const list = document.querySelector<HTMLElement>('#gallery-list');
function renderGallery() {
  if (!list) return;
  const order = [...prefs.selected, ...gallery.map(image => image.id).filter(id => !prefs.selected.includes(id))];
  for (const id of order) {
    const card = list.querySelector<HTMLElement>(`[data-image-id="${id}"]`)!;
    const index = prefs.selected.indexOf(id);
    card.querySelector<HTMLInputElement>('input')!.checked = index >= 0;
    card.querySelector<HTMLElement>('.image-order')!.textContent = index >= 0 ? String(index + 1) : '—';
    card.querySelector<HTMLButtonElement>('[data-move="-1"]')!.disabled = index <= 0;
    card.querySelector<HTMLButtonElement>('[data-move="1"]')!.disabled = index < 0 || index === prefs.selected.length - 1;
    card.classList.toggle('selected', index >= 0); list.append(card);
  }
}
list?.addEventListener('change', e => {
  const input = e.target as HTMLInputElement;
  if (input.type !== 'checkbox') return;
  if (!input.checked && prefs.selected.length === 1) {
    input.checked = true; $('#gallery-status').textContent = t('keepOne'); return;
  }
  prefs.selected = input.checked ? [...prefs.selected, input.value] : prefs.selected.filter((id: string) => id !== input.value);
  $('#gallery-status').textContent = t('saved'); change(); renderGallery();
  if (!prefs.selected.includes(current)) void paint(prefs.selected[0]);
});
list?.addEventListener('click', e => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-move]');
  if (!button) return;
  const id = button.closest<HTMLElement>('[data-image-id]')!.dataset.imageId!;
  const index = prefs.selected.indexOf(id), next = index + Number(button.dataset.move);
  if (index < 0 || next < 0 || next >= prefs.selected.length) return;
  [prefs.selected[index], prefs.selected[next]] = [prefs.selected[next], prefs.selected[index]];
  change(); renderGallery(); button.focus(); $('#gallery-status').textContent = t('saved');
});
document.querySelector<HTMLButtonElement>('#gallery-reset')?.addEventListener('click', () => {
  prefs.selected = gallery.map(image => image.id); failed.clear(); change(); renderGallery(); void paint(prefs.selected[0]);
});
sync(); renderGallery(); if (!staticBackground) void paint(current);
