// Regenerate React runtime assets from the preserved procedural room source.
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
const root = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  original = resolve(process.argv[2] || resolve(root, "../project")),
  room = resolve(original, "design/meeting-room"),
  runtime = resolve(root, "src/features/meeting/renderer"),
  assets = resolve(root, "public/room");
await mkdir(assets, { recursive: true });
for (const f of [
  "room.vert",
  "room.frag",
  "shadow.vert",
  "shadow.frag",
  "motion.glsl",
])
  await copyFile(resolve(room, "source", f), resolve(runtime, f));
for (const f of ["motion.js", "renderer.js"]) {
  let source = (await readFile(resolve(room, "source", f), "utf8")).replace(
    /^function /gm,
    "export function ",
  );
  if (f === "renderer.js")
    source = "import {sampleRoomMotion} from './motion.js';\n" + source;
  await writeFile(resolve(runtime, f), source);
}
await writeFile(
  resolve(assets, "scene.json.gz"),
  gzipSync(await readFile(resolve(room, "source/scene.json"))),
);
for (const [from, to] of [
  ["renders/layout-camera.jpg", "layout-camera.jpg"],
  ["images/exterior-view.jpg", "exterior-view.jpg"],
])
  await copyFile(resolve(room, from), resolve(assets, to));
console.log(
  "Room geometry, shaders, motion and textures synchronized. Run npm test && npm run build.",
);
