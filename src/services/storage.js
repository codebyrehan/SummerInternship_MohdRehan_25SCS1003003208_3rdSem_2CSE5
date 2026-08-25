const K = { RESUMES:'qh_resumes', DRAFT:'qh_draft', COVER_LETTERS:'qh_cls', SETTINGS:'qh_settings' };
const get = (k,fb=null) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch { return fb; } };
const set = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); return true; } catch { return false; } };

export const getResumes = () => get(K.RESUMES, []);
export const saveResume = (r) => {
  const all=getResumes(); const id=r.id||'r_'+Date.now();
  const item={...r,id,updatedAt:new Date().toISOString()};
  const idx=all.findIndex(x=>x.id===id);
  if(idx>=0) all[idx]=item; else all.unshift(item);
  set(K.RESUMES,all); return item;
};
export const deleteResume = (id) => set(K.RESUMES, getResumes().filter(r=>r.id!==id));
export const getDraft = () => get(K.DRAFT, null);
export const setDraft = (d) => set(K.DRAFT, d);
export const clearDraft = () => localStorage.removeItem(K.DRAFT);
export const getCoverLetters = () => get(K.COVER_LETTERS, []);
export const saveCoverLetter = (cl) => {
  const all=getCoverLetters();
  const item={...cl,id:'cl_'+Date.now(),createdAt:new Date().toISOString()};
  set(K.COVER_LETTERS,[item,...all].slice(0,20)); return item;
};
export const getSettings = () => get(K.SETTINGS, { template:'modern' });
export const saveSettings = (s) => set(K.SETTINGS, { ...getSettings(), ...s });