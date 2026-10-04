// Shared by the color and shadow passes. Motion IDs use the existing material float.
uniform vec3 headMotion,armMotion,gestureMotion,plantMotion;
uniform float sprigMotion;
uniform vec3 headPivot,eyeCenter,shoulderPivot,elbowPivot,wristPivot,plantPivot,sprigPivot;
vec3 turnX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}
vec3 turnY(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}
vec3 turnZ(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z);}
void animateRoom(inout vec3 p,inout vec3 n,float id){
  if(id>.5&&id<2.5){
    if(id>1.5){float scale=max(.07,1.-headMotion.z);p.z=eyeCenter.z+(p.z-eyeCenter.z)*scale;n.z/=scale;}
    p=headPivot+turnZ(turnX(p-headPivot,headMotion.y),headMotion.x);
    n=turnZ(turnX(n,headMotion.y),headMotion.x);
  }else if(id>2.5&&id<5.5){
    // Distal transforms first, then parent joints: wrist -> elbow -> shoulder.
    if(id>4.5){p=wristPivot+turnX(turnY(p-wristPivot,gestureMotion.y),armMotion.z);n=turnX(turnY(n,gestureMotion.y),armMotion.z);}
    if(id>3.5){p=elbowPivot+turnX(p-elbowPivot,armMotion.y);n=turnX(n,armMotion.y);}
    p=shoulderPivot+turnY(turnX(p-shoulderPivot,armMotion.x),gestureMotion.x);
    n=turnY(turnX(n,armMotion.x),gestureMotion.x);
  }else if(id>9.5&&id<12.5){
    float a=id<10.5?plantMotion.x:(id<11.5?plantMotion.y:plantMotion.z);
    p=plantPivot+turnY(turnX(p-plantPivot,a*.35),a);n=turnY(turnX(n,a*.35),a);
  }else if(id>12.5&&id<13.5){p=sprigPivot+turnY(p-sprigPivot,sprigMotion);n=turnY(n,sprigMotion);}
}
