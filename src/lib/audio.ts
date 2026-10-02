// ───────────────────────────────────────────────────────────────
// Audio 100 % sintetizado con Web Audio API (sin archivos de audio):
//   · drone submarino grave que se oscurece con la profundidad,
//   · ping de sonar con eco,
//   · burbujas al hacer click.
// Empieza silenciado: los navegadores exigen un gesto del usuario.
// ───────────────────────────────────────────────────────────────

type Listener = () => void;

class AbyssAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscs: OscillatorNode[] = [];
  private echo: DelayNode | null = null;
  private subs = new Set<Listener>();
  enabled = false;

  subscribe = (fn: Listener) => {
    this.subs.add(fn);
    return () => {
      this.subs.delete(fn);
    };
  };
  private emit() {
    this.subs.forEach((f) => f());
  }

  /** Crea el grafo de audio la primera vez. */
  private init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    // Eco para el sonar
    this.echo = ctx.createDelay(1.5);
    this.echo.delayTime.value = 0.38;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    this.echo.connect(fb).connect(this.echo);
    this.echo.connect(this.master);

    // Drone: tres osciladores graves desafinados → paso bajo
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 520;
    this.filter.Q.value = 3;
    this.filter.connect(this.master);

    const defs: Array<[OscillatorType, number, number]> = [
      ["sine", 38, 0.5],
      ["triangle", 57.3, 0.22],
      ["sawtooth", 76.2, 0.05],
    ];
    defs.forEach(([type, freq, gain]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = gain;
      o.connect(g).connect(this.filter!);
      o.start();
      this.oscs.push(o);
    });

    // LFO lento que «respira» sobre el filtro
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain).connect(this.filter.frequency);
    lfo.start();
  }

  /** Activa/desactiva el sonido (requiere gesto del usuario). */
  async toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      await this.ctx?.resume();
      this.master?.gain.setTargetAtTime(0.32, this.ctx!.currentTime, 0.8);
      this.ping();
    } else {
      this.master?.gain.setTargetAtTime(0, this.ctx?.currentTime ?? 0, 0.3);
    }
    this.emit();
  }

  /** El drone se hace más grave y cerrado al bajar. */
  setDepth(depth: number) {
    if (!this.ctx || !this.filter) return;
    const k = Math.min(1, depth / 11000);
    this.filter.frequency.setTargetAtTime(560 - k * 430, this.ctx.currentTime, 0.4);
    this.oscs.forEach((o, i) => {
      const base = [38, 57.3, 76.2][i];
      o.frequency.setTargetAtTime(base * (1 - k * 0.35), this.ctx!.currentTime, 0.6);
    });
  }

  /** Ping de sonar con eco. */
  ping(freq = 1180) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.82, t + 1.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 1.8);
    o.connect(g);
    g.connect(this.master);
    if (this.echo) g.connect(this.echo);
    o.start(t);
    o.stop(t + 2);
  }

  /** Pequeña burbuja (glissando ascendente muy corto). */
  bubble() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    const f = 280 + Math.random() * 520;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.1, t + 0.09);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + 0.16);
  }
}

export const audio = new AbyssAudio();
