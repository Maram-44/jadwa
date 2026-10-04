attribute vec3 p;
attribute vec3 normal;
attribute vec3 color;
attribute float material;
uniform vec3 eye,right,up,forward;
uniform float focal,aspect;
varying vec3 vPosition,vNormal,vColor;
varying float vMaterial;
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
void main(){
  float surface=mod(material,100.),motionId=floor(material/100.);
  vec3 position=p,norm=normal;
  animateRoom(position,norm,motionId);
  position=swingPoint(position,surface);
  if(surface>19.5&&surface<23.5){
    bool left=(surface<20.5)||(surface>21.5&&surface<22.5);
    float a=left?min(cradleSwing,0.):max(cradleSwing,0.);
    norm=vec3(normal.x*cos(a)-normal.z*sin(a),normal.y,normal.x*sin(a)+normal.z*cos(a));
  }

  vec3 d=position-eye;float z=dot(d,forward);float near=.03;float far=40.;
  gl_Position=vec4(dot(d,right)*focal/aspect,dot(d,up)*focal,(far+near)/(far-near)*z-2.*far*near/(far-near),z);
  vPosition=position;vNormal=norm;vColor=color;vMaterial=surface>19.5?(surface<21.5?12.:3.):surface;
}
