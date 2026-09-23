export function formatMusicTime(seconds) {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** Placeholders never enter the playback queue. Explicit skip also leaves single repeat mode. */
export function nextTrack(tracks, currentId, { direction = 1, mode = 'list', ended = false, roll = Math.random() } = {}) {
  const ids = tracks.filter(track => track.src).map(track => track.id);
  if (!ids.length) return null;
  if (!ids.includes(currentId)) return ids[0];
  if (ids.length === 1 || (ended && mode === 'single')) return currentId;
  if (mode === 'shuffle' && direction > 0) {
    const choices = ids.filter(id => id !== currentId);
    return choices[Math.min(choices.length - 1, Math.floor(Math.max(0, roll) * choices.length))];
  }
  return ids[(ids.indexOf(currentId) + direction + ids.length) % ids.length];
}

export function readMusicPreferences(value, tracks, defaults) {
  const s = value && typeof value === 'object' ? value : {};
  const id = tracks.some(track => track.id === s.id && track.src) ? s.id : tracks.find(track => track.src)?.id || null;
  return {
    id,
    time: id === s.id && Number.isFinite(s.time) && s.time >= 0 ? s.time : 0,
    volume: Number.isFinite(s.volume) ? Math.max(0, Math.min(1, s.volume)) : defaults.volume,
    muted: s.muted === true,
    mode: ['list', 'single', 'shuffle'].includes(s.mode) ? s.mode : defaults.mode,
  };
}
