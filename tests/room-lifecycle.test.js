import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";
import { createRoomMotionClock } from "../src/features/meeting/renderer/motion.js";
test("room mount/dispose removes listeners, observer, GPU renderer and animation frame; StrictMode remount is isolated", async () => {
  class Target {
    listeners = new Map();
    addEventListener(k, fn) {
      if (!this.listeners.has(k)) this.listeners.set(k, new Set());
      this.listeners.get(k).add(fn);
    }
    removeEventListener(k, fn) {
      this.listeners.get(k)?.delete(fn);
    }
    count() {
      return [...this.listeners.values()].reduce((n, s) => n + s.size, 0);
    }
  }
  const canvas = new Target(),
    document = new Target(),
    window = new Target(),
    media = new Target();
  media.matches = false;
  document.hidden = false;
  const frames = new Map();
  let serial = 0,
    disposes = 0,
    draws = 0,
    disconnects = 0;
  canvas.getContext = () => ({ isContextLost: () => false });
  canvas.getBoundingClientRect = () => ({
    width: 800,
    height: 500,
    left: 0,
    top: 0,
  });
  const state = [];
  const scene = {
    camera: { location: [0, 0, 1], target: [0, 1, 1], fov: 58 },
    cradle: {
      duration: 12,
      amplitude: 0.3,
      bounds: [
        [-1, -1, -1],
        [1, 1, 1],
      ],
    },
  };
  const scope = {
    AbortController,
    console,
    document,
    window,
    devicePixelRatio: 1,
    performance: { now: () => 100 },
    matchMedia: () => media,
    createRoomMotionClock,
    createRoomRenderer: () => ({
      draw() {
        draws++;
      },
      dispose() {
        disposes++;
      },
    }),
    requestAnimationFrame: (fn) => {
      frames.set(++serial, fn);
      return serial;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class {
      observe() {}
      disconnect() {
        disconnects++;
      }
    },
    Image: class {
      decode() {
        return Promise.resolve();
      }
    },
    fetch: async () => ({
      ok: true,
      body: {
        pipeThrough() {
          return {};
        },
      },
    }),
    DecompressionStream: class {},
    Response: class {
      async text() {
        return JSON.stringify(scene);
      }
    },
    vertex: "",
    fragment: "",
    shadowVertex: "",
    shadowFragment: "",
    motion: "",
  };
  const source = readFileSync(
    new URL("../src/features/meeting/renderer/adapter.js", import.meta.url),
    "utf8",
  )
    .replace(/^import[\s\S]*?;\s*/gm, "")
    .replace("export function mountRoom", "function mountRoom");
  vm.createContext(scope);
  vm.runInContext(source + "\nthis.mountRoom=mountRoom;", scope);
  const options = {
    canvas,
    room: {},
    logo: { decode: () => Promise.resolve() },
    onState: (s) => state.push(s),
  };
  const first = scope.mountRoom(options);
  first.dispose();
  const second = scope.mountRoom(options);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(state.at(-1).ready, true);
  assert.ok(draws > 0);
  assert.ok(frames.size <= 1);
  second.setAngle(0.1);
  assert.equal(state.at(-1).angle, 0.1);
  second.toggleCradle();
  assert.equal(state.at(-1).cradle, true);
  second.dispose();
  assert.equal(disposes, 1);
  assert.equal(disconnects, 2);
  assert.equal(frames.size, 0);
  assert.equal(
    canvas.count() + document.count() + window.count() + media.count(),
    0,
  );
});
