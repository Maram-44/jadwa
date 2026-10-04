import { sampleRoomMotion } from "./motion.js";
// The standalone preview and offline EGL check share these shaders and scene data.
export function createRoomRenderer(
  gl,
  scene,
  sources,
  logoImage,
  exteriorImage,
) {
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
  function program(v, f) {
    const p = gl.createProgram();
    for (const [type, src] of [
      [gl.VERTEX_SHADER, v],
      [gl.FRAGMENT_SHADER, f],
    ]) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(sh));
      gl.attachShader(p, sh);
      gl.deleteShader(sh);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(p));
    return p;
  }
  const main = program(sources.vertex, sources.fragment),
    shadow = program(sources.shadowVertex, sources.shadowFragment),
    values = [];
  scene.faces.forEach((f) => {
    const color = [1, 3, 5].map((i) => parseInt(f.c.slice(i, i + 2), 16) / 255);
    for (let i = 1; i < f.p.length - 1; i++)
      for (const j of [0, i, i + 1])
        values.push(
          ...f.p[j],
          ...(f.vn ? f.vn[j] : f.n),
          ...color,
          f.m + 100 * (f.motion || 0),
        );
  });
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
  const count = values.length / 10;
  const lightPosition = scene.lighting.key.position,
    lightForward = unit(sub(scene.lighting.key.target, lightPosition)),
    lightRight = unit(cross(lightForward, [0, 0, 1])),
    lightUp = cross(lightRight, lightForward),
    size = Math.min(
      scene.lighting.shadowResolution,
      gl.getParameter(gl.MAX_TEXTURE_SIZE),
    );
  let cradleSwing = 0,
    motion = sampleRoomMotion(0, false),
    previousMotionKey = null;
  function vec(p, name, v) {
    gl.uniform3fv(gl.getUniformLocation(p, name), v);
  }
  function bind(p) {
    gl.useProgram(p);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (let i = 0; i < 4; i++) gl.disableVertexAttribArray(i);
    for (const [name, n, offset] of [
      ["p", 3, 0],
      ["normal", 3, 12],
      ["color", 3, 24],
      ["material", 1, 36],
    ]) {
      const a = gl.getAttribLocation(p, name);
      if (a >= 0) {
        gl.enableVertexAttribArray(a);
        gl.vertexAttribPointer(a, n, gl.FLOAT, false, 40, offset);
      }
    }
    for (const [name, value] of Object.entries({
      lightPosition,
      lightRight,
      lightUp,
      lightForward,
      cradleLeft: scene.cradle?.leftPivot || [0, 0, 0],
      cradleRight: scene.cradle?.rightPivot || [0, 0, 0],
    }))
      vec(p, name, value);
    gl.uniform1f(gl.getUniformLocation(p, "cradleSwing"), cradleSwing);
    for (const [name, value] of Object.entries({
      ...scene.character.motion,
      ...scene.motion,
      headMotion: motion.head,
      armMotion: motion.arm,
      gestureMotion: motion.gesture,
      plantMotion: motion.plant,
    }))
      vec(p, name, value);
    gl.uniform1f(gl.getUniformLocation(p, "sprigMotion"), motion.sprig);
  }
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    size,
    size,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  for (const [p, v] of [
    [gl.TEXTURE_MIN_FILTER, gl.NEAREST],
    [gl.TEXTURE_MAG_FILTER, gl.NEAREST],
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
  ])
    gl.texParameteri(gl.TEXTURE_2D, p, v);
  const depth = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depth,
  );
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    throw Error("Shadow framebuffer unavailable");
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.DITHER);
  bind(shadow);
  gl.viewport(0, 0, size, size);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  const logoTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, logoTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    logoImage,
  );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  for (const [p, v] of [
    [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
    [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
  ])
    gl.texParameteri(gl.TEXTURE_2D, p, v);
  gl.activeTexture(gl.TEXTURE0);
  const exteriorTexture = gl.createTexture(),
    exteriorReady = !!(
      exteriorImage?.naturalWidth && exteriorImage?.naturalHeight
    );
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, exteriorTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  if (exteriorReady)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      exteriorImage,
    );
  else
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([204, 222, 231, 255]),
    );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  for (const [p, v] of [
    [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
    [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
  ])
    gl.texParameteri(gl.TEXTURE_2D, p, v);
  gl.activeTexture(gl.TEXTURE0);
  return {
    draw({
      eye,
      right,
      up,
      forward,
      focal,
      aspect,
      width,
      height,
      swing = 0,
      pose = sampleRoomMotion(0, false),
    }) {
      motion = pose;
      const motionKey = JSON.stringify(motion);
      if (
        Math.abs(cradleSwing - swing) > 0.000001 ||
        motionKey !== previousMotionKey
      ) {
        previousMotionKey = motionKey;
        cradleSwing = swing;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        bind(shadow);
        gl.viewport(0, 0, size, size);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, count);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      bind(main);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0.92, 0.91, 0.87, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      for (const [name, v] of Object.entries({
        eye,
        right,
        up,
        forward,
        fillPosition: scene.lighting.fill.position,
        ambientColor: scene.lighting.ambientColor,
        keyColor: scene.lighting.key.color,
        fillColor: scene.lighting.fill.color,
        covePosition: scene.lighting.cove.position,
        coveColor: scene.lighting.cove.color,
      }))
        vec(main, name, v);
      for (const [name, v] of Object.entries({
        focal,
        aspect,
        shadowSize: size,
        shadowSoftness: scene.lighting.shadowSoftness,
      }))
        gl.uniform1f(gl.getUniformLocation(main, name), v);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(gl.getUniformLocation(main, "shadowMap"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, logoTexture);
      gl.uniform1i(gl.getUniformLocation(main, "logoMap"), 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, exteriorTexture);
      gl.uniform1i(gl.getUniformLocation(main, "exteriorMap"), 2);
      gl.uniform1f(
        gl.getUniformLocation(main, "exteriorReady"),
        exteriorReady ? 1 : 0,
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    },
    dispose() {
      gl.deleteTexture(exteriorTexture);
      gl.deleteTexture(logoTexture);
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteRenderbuffer(depth);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(main);
      gl.deleteProgram(shadow);
    },
  };
}
