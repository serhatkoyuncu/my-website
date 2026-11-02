/**
 * Matematik çekirdeği: satır-major 4×4 matris, sütun vektör p = [x,y,z,1]^T.
 * Yeni dönüşüm D, önceki M'nin solundan uygulanır: M_new = D × M.
 */
export const identity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
export function multiply(a, b) {
  const m = new Array(16).fill(0);
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) {
    for (let k = 0; k < 4; k += 1) m[r * 4 + c] += a[r * 4 + k] * b[k * 4 + c];
  }
  return m;
}
export const translate = (x,y,z) => [1,0,0,x, 0,1,0,y, 0,0,1,z, 0,0,0,1];
export const scale = (x,y,z) => [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1];
const rad = (degrees) => degrees * Math.PI / 180;
export function rotate(ax, ay, az, pivot=[0,0,0]) {
  const [x,y,z] = [ax,ay,az].map(rad);
  const [cx,sx,cy,sy,cz,sz] = [Math.cos(x),Math.sin(x),Math.cos(y),Math.sin(y),Math.cos(z),Math.sin(z)];
  const rx=[1,0,0,0, 0,cx,-sx,0, 0,sx,cx,0, 0,0,0,1];
  const ry=[cy,0,sy,0, 0,1,0,0, -sy,0,cy,0, 0,0,0,1];
  const rz=[cz,-sz,0,0, sz,cz,0,0, 0,0,1,0, 0,0,0,1];
  // Sütun vektör kullanıldığı için dönüşüm sırası: önce Z, sonra Y, sonra X.
  const rotation = multiply(multiply(rx,ry),rz);
  return multiply(multiply(translate(...pivot), rotation), translate(...pivot.map(v=>-v)));
}
// X aynalama = YZ düzlemine göre yansıma (x işareti değişir).
export function mirror(axis) {
  if (!['x','y','z'].includes(axis)) throw Error('Geçersiz yansıma ekseni');
  return scale(axis==='x'?-1:1, axis==='y'?-1:1, axis==='z'?-1:1);
}
export function shear(axis,k1,k2) {
  const m=identity();
  if (axis==='x') {m[1]=k1;m[2]=k2;}
  else if (axis==='y') {m[4]=k1;m[6]=k2;}
  else if (axis==='z') {m[8]=k1;m[9]=k2;}
  else throw Error('Geçersiz kaydırma ekseni');
  return m;
}
export const transformPoint=(m,p) => [
  m[0]*p[0]+m[1]*p[1]+m[2]*p[2]+m[3],
  m[4]*p[0]+m[5]*p[1]+m[6]*p[2]+m[7],
  m[8]*p[0]+m[9]*p[1]+m[10]*p[2]+m[11],
];
export const formatNumber = (v) => (Math.abs(v)<0.0000005 ? 0 : Number(v.toFixed(3))).toString();
