"""Reproducible CC0 sample preparation. Requires ffmpeg, Python standard library only."""
from pathlib import Path
import array, hashlib, json, math, subprocess, tempfile, wave, zipfile

ROOT = Path(__file__).resolve().parents[1]
SAMPLES = {
    "mechanical": "click_001", "impact": "bong_001", "wood": "tick_004",
    "pluck": "pluck_001", "bubble": "drop_001", "confirm": "confirmation_001",
    "energy": "select_005", "arcade": "confirmation_004",
}
archive = ROOT / "assets/audio/interface-sounds/kenney_interface-sounds.zip"
output = ROOT / "public/audio/clicks"
output.mkdir(parents=True, exist_ok=True)
report = []
with zipfile.ZipFile(archive) as package, tempfile.TemporaryDirectory() as temp:
    for sound_id, source in SAMPLES.items():
        original = package.read(f"Audio/{source}.ogg")
        input_file = Path(temp) / f"{source}.ogg"
        input_file.write_bytes(original)
        pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(input_file), "-ac", "1", "-ar", "44100", "-f", "f32le", "-"], check=True, capture_output=True).stdout
        values = array.array("f", pcm)
        audible = [i for i,v in enumerate(values) if abs(v) > 0.003]
        if not audible: raise ValueError(f"Silent sample: {source}")
        values = values[max(0,audible[0]-88):min(len(values),audible[-1]+442)]
        # Preserve each recording's timbre; only trim silence, soften boundaries and match RMS.
        for i in range(len(values)):
            values[i] *= min(1, i / 88, (len(values)-1-i) / 220)
        rms = math.sqrt(sum(v*v for v in values)/len(values))
        gain = min(10**(-20/20)/rms, 10**(-3/20)/max(map(abs,values)))
        result = array.array("h", [round(max(-1,min(1,v*gain))*32767) for v in values])
        target=output/f"{sound_id}.wav"
        with wave.open(str(target), "wb") as wav:
            wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(44100); wav.writeframes(result.tobytes())
        report.append({"id":sound_id,"source":f"Audio/{source}.ogg","durationMs":round(len(values)/44.1,1),"rmsDb":round(20*math.log10(rms*gain),2),"peakDb":round(20*math.log10(max(map(abs,values))*gain),2),"sha256":hashlib.sha256(target.read_bytes()).hexdigest()})
(ROOT/"assets/audio/interface-sounds/processing.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
print(json.dumps(report,indent=2))
