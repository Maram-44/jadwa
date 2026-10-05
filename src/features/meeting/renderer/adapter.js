import { createRoomRenderer } from "./renderer.js";
import { createRoomMotionClock } from "./motion.js";
import vertex from "./room.vert?raw";
import fragment from "./room.frag?raw";
import shadowVertex from "./shadow.vert?raw";
import shadowFragment from "./shadow.frag?raw";
import motion from "./motion.glsl?raw";
const shaders = Object.fromEntries(
  Object.entries({ vertex, fragment, shadowVertex, shadowFragment }).map(
    ([k, v]) => [k, v.replace("__MOTION__", motion)],
  ),
);
// Canvas-only adapter. React owns every visible control, label and attachment.
export function mountRoom({ canvas, room, logo, onState }) {
  const abort = new AbortController(),
    cleanups = [];
  let alive = true,
    scene,
    gl,
    renderer,
    angle = 0,
    pitch = 0,
    queued = false,
    drag = null,
    lastCamera = null,
    cradleStart = null,
    frameId = null,
    lastDraw = -Infinity,
    viewDirty = true,
    generation = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
    clock = createRoomMotionClock(!reduced.matches);
  const emit = (state) => {
    if (alive) onState(state);
  },
    listen = (target, event, fn, options) => {
      target.addEventListener(event, fn, options);
      cleanups.push(() => target.removeEventListener(event, fn, options));
    };
  const sub = (a, b) => a.map((v, i) => v - b[i]),
    cross = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ],
    unit = (a) => {
      const n = Math.hypot(...a) || 1;
      return a.map((v) => v / n);
    };
  function fail() {
    clock.suspend();
    cancelAnimationFrame(frameId);
    queued = false;
    cradleStart = null;
    emit({
      loading: false,
      failed: true,
      ready: false,
      cradle: false,
      status: "معاينة ثابتة",
    });
  }
  function requestRender(force = true) {
    if (!alive) return;
    if (force) viewDirty = true;
    if (!queued && !document.hidden) {
      queued = true;
      frameId = requestAnimationFrame(render);
    }
  }
  function stopCradle() {
    cradleStart = null;
    emit({ cradle: false });
  }
  function render(now = performance.now()) {
    queued = false;
    if (!alive || document.hidden || !gl || gl.isContextLost() || !renderer) {
      clock.suspend();
      return;
    }
    if (!viewDirty && now - lastDraw < 1000 / 30) {
      requestRender(false);
      return;
    }
    lastDraw = now;
    viewDirty = false;
    const rect = canvas.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, 1.6),
      w = Math.round(rect.width * dpr),
      h = Math.round(rect.height * dpr);
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const eye = scene.camera.location,
      base = sub(scene.camera.target, eye),
      heading = unit([
        base[0] * Math.cos(angle) + base[1] * Math.sin(angle),
        base[1] * Math.cos(angle) - base[0] * Math.sin(angle),
        0,
      ]),
      elevation = Math.atan2(base[2], Math.hypot(base[0], base[1])) + pitch,
      forward = [
        heading[0] * Math.cos(elevation),
        heading[1] * Math.cos(elevation),
        Math.sin(elevation),
      ],
      right = unit(cross(forward, [0, 0, 1])),
      up = cross(right, forward);
    let fov = (scene.camera.fov * Math.PI) / 180;
    if (w / h < 1.1) fov = 2 * Math.atan((Math.tan(fov / 2) * 1.65) / (w / h));
    lastCamera = {
      eye,
      right,
      up,
      forward,
      focal: 1 / Math.tan(fov / 2),
      aspect: w / h,
      width: w,
      height: h,
    };
    let swing = 0;
    if (cradleStart !== null) {
      const elapsed = (performance.now() - cradleStart) / 1000,
        duration = scene.cradle.duration;
      if (elapsed >= duration) stopCradle();
      else
        swing =
          scene.cradle.amplitude *
          Math.exp(-elapsed / 7) *
          (1 - elapsed / duration) *
          Math.sin((elapsed * Math.PI * 2) / 1.2);
    }
    try {
      renderer.draw({ ...lastCamera, swing, pose: clock.sample(now) });
    } catch {
      fail();
      return;
    }
    if (cradleStart !== null || clock.enabled) requestRender(false);
  }
  async function setup() {
    const token = ++generation;
    gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) throw Error("WebGL unavailable");
    const exterior = new Image();
    exterior.src = "/room/exterior-view.jpg";
    await Promise.all([logo.decode(), exterior.decode().catch(() => { })]);
    if (!alive || token !== generation) return;
    if (gl.isContextLost()) throw Error("Context lost");
    renderer?.dispose();
    renderer = createRoomRenderer(gl, scene, shaders, logo, exterior);
    clock.suspend();
    viewDirty = true;
    render();
    emit({
      loading: false,
      failed: false,
      ready: true,
      hasCradle: !!scene.cradle,
      status: "إضاءة وخامات مفعّلة",
    });
  }
  function setAngle(value) {
    angle = Math.max(-0.21, Math.min(0.21, value));
    emit({ angle });
    requestRender();
  }
  function setPitch(value) {
    pitch = Math.max(-0.65, Math.min(0.18, value));
    requestRender();
  }
  function reset() {
    setPitch(0);
    setAngle(0);
  }
  function toggleCradle() {
    if (!renderer || !scene?.cradle || gl?.isContextLost()) return;
    if (cradleStart !== null) stopCradle();
    else {
      cradleStart = performance.now();
      emit({ cradle: true });
    }
    requestRender();
  }
  function toggleMotion() {
    clock.setEnabled(!clock.enabled);
    emit({ motion: clock.enabled });
    requestRender();
  }
  function hitCradle(clientX, clientY) {
    if (!lastCamera || !scene?.cradle) return false;
    const r = canvas.getBoundingClientRect(),
      c = lastCamera,
      x = ((((clientX - r.left) / r.width) * 2 - 1) * c.aspect) / c.focal,
      y = (1 - ((clientY - r.top) / r.height) * 2) / c.focal,
      direction = unit(
        c.forward.map((v, i) => v + c.right[i] * x + c.up[i] * y),
      ),
      bounds = scene.cradle.bounds;
    let near = 0,
      far = Infinity;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(direction[i]) < 1e-8) {
        if (c.eye[i] < bounds[0][i] || c.eye[i] > bounds[1][i]) return false;
        continue;
      }
      const a = (bounds[0][i] - c.eye[i]) / direction[i],
        b = (bounds[1][i] - c.eye[i]) / direction[i];
      near = Math.max(near, Math.min(a, b));
      far = Math.min(far, Math.max(a, b));
      if (near > far) return false;
    }
    return far >= near;
  }
  function release() {
    drag = null;
    emit({ dragging: false });
  }
  listen(canvas, "pointerdown", (e) => {
    if (!renderer || !gl || gl.isContextLost()) return;
    drag = { x: e.clientX, y: e.clientY, angle, pitch, moved: false };
    canvas.setPointerCapture(e.pointerId);
    emit({ dragging: true });
  });
  listen(canvas, "pointermove", (e) => {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6)
      drag.moved = true;
    if (drag.moved) {
      setAngle(drag.angle - (e.clientX - drag.x) * 0.0008);
      setPitch(drag.pitch - (e.clientY - drag.y) * 0.0008);
    }
  });
  listen(canvas, "pointerup", (e) => {
    const activate = drag && !drag.moved && hitCradle(e.clientX, e.clientY);
    release();
    if (activate) toggleCradle();
  });
  listen(canvas, "pointercancel", release);
  listen(canvas, "lostpointercapture", release);
  listen(canvas, "keydown", (e) => {
    if (
      !renderer ||
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "0",
        "Home",
      ].includes(e.key)
    )
      return;
    e.preventDefault();
    if (e.key === "ArrowUp" || e.key === "ArrowDown")
      setPitch(pitch + (e.key === "ArrowUp" ? 0.025 : -0.025));
    else if (e.key === "ArrowLeft" || e.key === "ArrowRight")
      setAngle(angle + (e.key === "ArrowLeft" ? -0.025 : 0.025));
    else reset();
  });
  listen(reduced, "change", (e) => {
    if (e.matches) {
      clock.setEnabled(false, true);
      stopCradle();
      emit({ motion: false });
      requestRender();
    }
  });
  listen(document, "visibilitychange", () => {
    clock.suspend();
    if (document.hidden) {
      stopCradle();
      cancelAnimationFrame(frameId);
      queued = false;
    } else requestRender();
  });
  listen(canvas, "webglcontextlost", (e) => {
    e.preventDefault();
    generation++;
    fail();
  });
  listen(canvas, "webglcontextrestored", () => {
    if (scene) setup().catch(fail);
  });
  const resize = new ResizeObserver(() => requestRender());
  resize.observe(room);
  listen(window, "pagehide", () => {
    clock.suspend();
    stopCradle();
    cancelAnimationFrame(frameId);
    queued = false;
  });
  listen(window, "pageshow", (e) => {
    if (e.persisted) {
      clock.suspend();
      requestRender();
    }
  });
  emit({ loading: true, failed: false, ready: false, motion: clock.enabled });
  (async () => {
    try {
      const response = await fetch("/room/scene.json.gz", {
        signal: abort.signal,
      });

      if (!response.ok) throw Error("Scene unavailable");

      let data;
      if (
        typeof DecompressionStream !== "undefined" &&
        response.body?.pipeThrough
      ) {
        const stream = response.body.pipeThrough(
          new DecompressionStream("gzip"),
        );
        const text = await new Response(stream).text();
        data = JSON.parse(text);
      } else {
        data = await response.json();
      }
      if (!alive) return;
      scene = data;
      await setup();
    } catch (e) {
      if (alive && e.name !== "AbortError") fail();
    }
  })();
  return {
    setAngle,
    reset,
    toggleCradle,
    toggleMotion,
    dispose() {
      alive = false;
      generation++;
      abort.abort();
      cancelAnimationFrame(frameId);
      clock.suspend();
      resize.disconnect();
      cleanups.forEach((fn) => fn());
      renderer?.dispose();
      renderer = null;
      drag = null;
    },
  };
}
