import * as THREE from 'three'

/** Fresnel atmosphere: additive rim glow on a slightly larger back-face sphere. */
export function atmosphereMaterial(color = '#22D3EE', power = 3.0, intensity = 1.0) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uIntensity: { value: intensity } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
      varying vec3 vNormal; varying vec3 vView;
      void main() {
        float f = pow(1.0 - abs(dot(vNormal, vView)), uPower);
        gl_FragColor = vec4(uColor, f * uIntensity);
      }`,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

/** Animated sun surface: layered simplex noise, hot core → cooler limb. */
export function sunMaterial(octaves = 3) {
  return new THREE.ShaderMaterial({
    defines: { OCTAVES: octaves },
    uniforms: { uTime: { value: 0 }, uHot: { value: new THREE.Color('#fff6d5') }, uMid: { value: new THREE.Color('#ffb347') }, uCool: { value: new THREE.Color('#ff6a1f') } },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      void main() {
        vPos = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uHot; uniform vec3 uMid; uniform vec3 uCool;
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      // --- simplex noise (Ashima) ---
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
      void main() {
        vec3 p = normalize(vPos);
        float t = uTime * 0.08;
        float n = snoise(p * 2.2 + t) * 0.6;
        #if OCTAVES > 1
        n += snoise(p * 5.0 - t * 1.3) * 0.3;
        #endif
        #if OCTAVES > 2
        n += snoise(p * 11.0 + t * 0.7) * 0.15;
        #endif
        n = n * 0.5 + 0.5;
        // granulation: bright cells, darker lanes
        float cells = smoothstep(0.35, 0.8, n);
        vec3 col = mix(uCool, uMid, cells);
        col = mix(col, uHot, pow(cells, 3.0) * 0.9);
        // limb darkening + rim heat
        float rim = 1.0 - abs(dot(vNormal, vView));
        col *= 1.0 - rim * 0.35;
        col += uMid * pow(rim, 4.0) * 0.6;
        gl_FragColor = vec4(col * 1.6, 1.0);
      }`,
    toneMapped: false,
  })
}
