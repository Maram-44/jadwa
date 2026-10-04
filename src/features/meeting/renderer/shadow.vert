attribute vec3 p;
attribute float material;
uniform vec3 lightPosition,lightRight,lightUp,lightForward;
varying highp float vDepth;
uniform vec3 cradleLeft,cradleRight;
uniform float cradleSwing;
__MOTION__
vec3 swingPoint(vec3 point,float m){
 if(m<19.5||m>23.5)return point;
 bool left=(m<20.5)||(m>21.5&&m<22.5);
 vec3 pivot=left?cradleLeft:cradleRight;
 float a=left?min(cradleSwing,0.):max(cradleSwing,0.);
 vec3 q=point-pivot;float c=cos(a),s=sin(a);
 return pivot+vec3(q.x*c-q.z*s,q.y,q.x*s+q.z*c);
}
void main(){vec3 position=p,norm=vec3(0,0,1);animateRoom(position,norm,floor(material/100.));vec3 d=swingPoint(position,mod(material,100.))-lightPosition;vDepth=dot(d,lightForward)/12.;gl_Position=vec4(dot(d,lightRight)/4.5,dot(d,lightUp)/4.5,dot(d,lightForward)/6.-1.,1.);}
