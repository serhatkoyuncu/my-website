import {template} from './template.js';
import {initCubeTransform} from './engine.js';

let instanceCounter = 0;
const getConfig = (block) => {
  const config = new Map();
  [...block.children].forEach((row) => {
    const cols=[...row.children];
    if(cols.length<2) return;
    const key=cols[0].textContent.trim().toLowerCase();
    const value=cols[1].textContent.trim();
    if(key) config.set(key,value);
  });
  return config;
};

/**
 * AEM Edge Delivery Services entry point.
 * Word/Google Docs content table header: Cube Transform
 * Fields: Başlık, Açıklama, Rozet, Projeksiyon.
 */
export default function decorate(block) {
  if (block.dataset.cubeInitialized === 'true') return;
  const config=getConfig(block);
  const prefix=`aem-cube-${++instanceCounter}`;
  // Prefix label targets, aria-labelledby references and IDs for multiple instances.
  const html=template
    .replace(/\b(id|for|aria-labelledby)="([^"]+)"/g, (_,attr,value)=>
      `${attr}="${value.split(' ').map(s=>`${prefix}-${s}`).join(' ')}"`)
    .replace(/\bname="(mirror-axis|shear-axis)"/g, (_,name)=>`name="${prefix}-${name}"`);
  block.replaceChildren();
  block.innerHTML=html;
  block.dataset.cubeInitialized='true';
  block.setAttribute('aria-label',config.get('başlık') || '3B Dönüşüm Laboratuvarı');
  const title=config.get('başlık');
  const subtitle=config.get('açıklama');
  const badge=config.get('rozet');
  if (title) block.querySelector('.brand-text strong').textContent=title;
  if (subtitle) block.querySelector('.panel-intro p').textContent=subtitle;
  if (badge) block.querySelector('.course-tag').textContent=badge;
  const proj=(config.get('projeksiyon') || '').toLowerCase();
  const initialProjection=['orthographic','ortografik'].includes(proj)?'orthographic':'perspective';
  const dispose=initCubeTransform(block,prefix,initialProjection);
  // Optional lifecycle hook for apps using client-side navigation.
  block.disposeCubeTransform=dispose;
}
