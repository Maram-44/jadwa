// Local visual timeline. Conversation/audio states are intentionally not simulated.
export function sampleRoomMotion(seconds, animated = true) {
  const smooth = (a, b, t) => {
    const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return x * x * (3 - 2 * x);
  };
  const t = Math.max(0, seconds),
    greeting = animated ? smooth(0.35, 1.25, t) * (1 - smooth(3.1, 4.8, t)) : 0;
  const wave = animated
    ? smooth(1.25, 1.55, t) *
      (1 - smooth(2.7, 3.1, t)) *
      Math.sin(((t - 1.25) * Math.PI * 2) / 1.05)
    : 0;
  // Uneven deterministic intervals avoid a metronomic blink or per-frame randomness.
  let blink = 0;
  if (animated) {
    const cycle = t % 23.7;
    for (const start of [2.4, 6.9, 10.1, 16.4, 21.6]) {
      const dt = cycle - start;
      if (dt >= 0 && dt < 0.23)
        blink = Math.max(
          blink,
          dt < 0.075 ? smooth(0, 0.075, dt) : 1 - smooth(0.075, 0.23, dt),
        );
    }
  }
  return {
    head: animated
      ? [
          0.012 * Math.sin(t * 0.43) + 0.005 * Math.sin(t * 0.91),
          0.006 * Math.sin(t * 0.61) + greeting * 0.022,
          blink,
        ]
      : [0, 0, 0],
    arm: [
      -0.075 * (1 - greeting),
      -0.58 * (1 - greeting),
      -0.654 * (1 - greeting),
    ],
    gesture: [wave * 0.045, wave * 0.16, 0],
    plant: animated
      ? [
          0.008 * Math.sin(t * 0.72),
          0.0065 * Math.sin(t * 0.59),
          0.009 * Math.sin(t * 0.83),
        ]
      : [0, 0, 0],
    sprig: animated
      ? 0.02 * Math.sin(t * 0.65) * (0.65 + 0.35 * Math.cos(t * 0.13))
      : 0,
  };
}

// Advance only while visible and enabled; resuming never catches up hidden time.
export function createRoomMotionClock(enabled) {
  let time = 0,
    previous = null,
    pose = sampleRoomMotion(0, false);
  return {
    get enabled() {
      return enabled;
    },
    setEnabled(value, reduce = false) {
      enabled = value;
      previous = null;
      if (reduce) {
        time = 5;
        pose = sampleRoomMotion(0, false);
      }
    },
    suspend() {
      previous = null;
    },
    sample(now) {
      if (enabled) {
        if (previous !== null)
          time += Math.max(0, Math.min(0.1, (now - previous) / 1000));
        previous = now;
        pose = sampleRoomMotion(time);
      }
      return pose;
    },
  };
}
