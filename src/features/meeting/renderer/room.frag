precision highp float;
varying vec3 vPosition,vNormal,vColor;
varying float vMaterial;
uniform vec3 eye,lightPosition,lightRight,lightUp,lightForward,fillPosition;
uniform sampler2D shadowMap,logoMap,exteriorMap;
uniform float exteriorReady;
uniform float shadowSize,shadowSoftness;
uniform vec3 ambientColor,keyColor,fillColor,covePosition,coveColor;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float plaster(vec3 p){return .975+.040*noise(p*3.)+.012*noise(p*95.);}
float unpackDepth(vec4 c){return dot(c,vec4(1./16777216.,1./65536.,1./256.,1.)*(255./256.));}
float visibility(vec3 N,vec3 L){
 vec3 d=vPosition-lightPosition;vec2 uv=vec2(dot(d,lightRight),dot(d,lightUp))/9.+.5;float z=dot(d,lightForward)/12.;
 if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.||z<0.||z>1.)return 1.;
 float bias=.0018+.0034*(1.-max(dot(N,L),0.));float sum=0.;
 for(int x=-2;x<=2;x++){for(int y=-2;y<=2;y++){vec2 offset=vec2(float(x),float(y))*shadowSoftness/shadowSize;float depth=unpackDepth(texture2D(shadowMap,uv+offset));sum+=step(z-bias,depth);}}
 return sum/25.;
}
void main(){
 vec3 N=normalize(vNormal),V=normalize(eye-vPosition);if(dot(N,V)<0.)N=-N;
 vec3 base=vColor;float roughness=.8;
 if(vMaterial>14.5&&vMaterial<15.5){
   vec2 p=vec2(vPosition.x,vPosition.y+.98),q=abs(p)-vec2(1.88,1.78);
   float edge=-(length(max(q,0.))+min(max(q.x,q.y),0.)-.17);
   float binding=1.-smoothstep(.012,.025,edge);
   float border=smoothstep(.055,.067,edge)*(1.-smoothstep(.080,.092,edge));
   float threads=noise(vec3(p.x*130.,p.y*14.,1.7))*.6+noise(vec3(p.x*18.,p.y*115.,3.1))*.4;
   base*=.92+.11*threads;
   base=mix(base,vec3(.64,.70,.75),border*.48);
   base*=1.-binding*.13;roughness=1.;
 }
 if(vMaterial>15.5&&vMaterial<16.5){
   base*=plaster(vPosition);roughness=.99;
   // A quiet painted base band and its fine upper junction ground the wall.
   float baseBand=1.-smoothstep(.070,.073,vPosition.z);
   base=mix(base,vec3(.80,.84,.85),baseBand*.62);
   float junction=smoothstep(.071,.073,vPosition.z)*(1.-smoothstep(.076,.079,vPosition.z));
   base*=1.-junction*.10;
 }

 if(vMaterial>13.5&&vMaterial<14.5){
   float sky=smoothstep(.6,2.9,vPosition.z);
   vec3 daylight=mix(vec3(.82,.87,.88),vec3(.68,.81,.89),sky);
   daylight+=.012*noise(vec3(vPosition.x*2.,vPosition.z*3.,0.));
   if(exteriorReady>.5){
     // Preserve the portrait image aspect while cropping centrally into the tall aperture.
     vec2 uv=vec2(.5-(vPosition.x-2.47)/(2.24*(2./3.)),(vPosition.z-.61)/2.24);
     vec3 exterior=texture2D(exteriorMap,clamp(uv,0.,1.)).rgb;
     float reflection=.07+.05*pow(1.-max(dot(N,V),0.),3.);
     daylight=mix(exterior,vec3(.83,.90,.94),reflection);
   }
   gl_FragColor=vec4(daylight,1.);return;
 }
 if(vMaterial>9.5&&vMaterial<10.5){gl_FragColor=vec4(min(vColor*1.08,vec3(1.)),1.);return;}
 if(vMaterial>7.5&&vMaterial<8.5){roughness=.16;base+=vec3(.035,.055,.08)*pow(1.-max(dot(N,V),0.),3.);}
 if(vMaterial>8.5&&vMaterial<9.5)roughness=.39;
 if(vMaterial>10.5&&vMaterial<11.5){
   vec2 uv=vec2((-.058-vPosition.x)/.056,(vPosition.z-.970)/.111);
   vec3 logo=texture2D(logoMap,vec2(.709+uv.x*.129,.376+uv.y*.305)).rgb;
   float ink=1.-smoothstep(.87,.98,min(logo.r,min(logo.g,logo.b)));
   base=mix(base,logo,ink);roughness=.4;
 }
 if(vMaterial>11.5&&vMaterial<12.5){
   vec3 R=reflect(-V,N);
   vec3 reflected=mix(vec3(.12,.18,.27),vec3(.81,.87,.94),smoothstep(-.2,.35,R.z));
   float window=pow(max(dot(R,normalize(vec3(-.7,.25,.7))),0.),22.);
   float edge=pow(1.-max(dot(N,V),0.),3.);
   base=mix(reflected,vec3(.94,.97,1.),.15*edge)+vec3(.28)*window;roughness=.13;
 }
 if(vMaterial>5.5&&vMaterial<6.5){
   vec2 uv=vec2(.5-vPosition.x/1.7,(vPosition.z-1.3825)/1.275);
   vec3 logo=texture2D(logoMap,uv).rgb;
   float ink=1.-smoothstep(.87,.98,min(logo.r,min(logo.g,logo.b)));
   base=mix(base*plaster(vPosition),logo,ink);
 }
 // Table-only satin oak: low-contrast elongated grain without repeated stripes.
 if(vMaterial>12.5&&vMaterial<13.5){
   float drift=noise(vec3(vPosition.x*.7,vPosition.y*3.,1.7));
   float broad=noise(vec3(vPosition.x*.65,(vPosition.y+drift*.025)*13.,2.3));
   float fibers=noise(vec3(vPosition.x*2.1,(vPosition.y+drift*.008)*115.,3.8));
   base*=.965+.055*broad+.025*fibers;roughness=.58;
 }
 if(vMaterial>.5&&vMaterial<1.5){
   float slow=noise(vec3(vPosition.x*.65,vPosition.y*7.,vPosition.z*8.));
   float grain=sin(vPosition.y*220.+slow*10.+sin(vPosition.x*2.1)*1.5);
   float fine=noise(vPosition*vec3(9.,950.,30.));
   base*=.94+.035*grain+.075*slow+.025*fine;roughness=.5;
 }else if(vMaterial>1.5&&vMaterial<2.5){
   float weave=sin(vPosition.x*1100.)*sin(vPosition.z*1100.);
   base*=.94+.065*noise(vPosition*550.)+.018*weave;roughness=.95;
 }else if(vMaterial>2.5&&vMaterial<3.5){roughness=.34;}
 else if(vMaterial>3.5&&vMaterial<4.5){gl_FragColor=vec4(base*.92+.05,1.);return;}
 else if(vMaterial>4.5&&vMaterial<5.5){base*=.98+.03*noise(vPosition*80.);roughness=.98;}
 if(vMaterial>6.5&&vMaterial<7.5){roughness=.57;base*=.97+.04*noise(vPosition*150.);}
 vec3 L=normalize(lightPosition-vPosition),F=normalize(fillPosition-vPosition);
 float shadow=visibility(N,L);float direct=max(dot(N,L),0.)*shadow;
 float skyBounce=.86+.14*max(N.z,0.);
 vec3 illumination=ambientColor*skyBounce+keyColor*direct+fillColor*max(dot(N,F),0.);
 float coveWash=exp(-abs(vPosition.y-covePosition.y)/.30-abs(vPosition.z-covePosition.z)/.17);
 illumination+=coveColor*coveWash;
 vec3 linear=pow(max(base,vec3(.001)),vec3(2.2))*illumination;
 vec3 H=normalize(L+V);float spec=pow(max(dot(N,H),0.),mix(100.,10.,roughness))*(1.-roughness)*.13*shadow;
 linear+=vec3(1.,.94,.80)*spec;
 // Gentle display exposure; keep navy readable and cream warm.
 vec3 mapped=clamp((linear*(2.51*linear+.03))/(linear*(2.43*linear+.59)+.14),0.,1.);
 gl_FragColor=vec4(pow(mapped,vec3(1./2.2)),1.);
}
