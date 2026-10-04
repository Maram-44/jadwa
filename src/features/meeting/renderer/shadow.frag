precision highp float;
varying highp float vDepth;
void main(){vec4 enc=fract(vDepth*vec4(16777216.,65536.,256.,1.));enc-=enc.xxyz*vec4(0.,1./256.,1./256.,1./256.);gl_FragColor=enc*(256./255.);}
