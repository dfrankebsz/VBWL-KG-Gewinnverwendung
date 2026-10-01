import { getStore } from '@netlify/blobs';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const TOTAL_TASKS = 36;
const SESSION_DAYS = 45;

function store(){ return getStore({ name:'kg-gewinnverwendung-course', consistency:'strong' }); }
function norm(v=''){ return String(v).normalize('NFKC').trim().toLocaleLowerCase('de-DE'); }
function keyPart(v=''){ return encodeURIComponent(norm(v)); }
function userKey(className,nickname){ return `user/${keyPart(className)}/${keyPart(nickname)}`; }
function json(data,status=200){ return Response.json(data,{status,headers:{'Cache-Control':'no-store'}}); }
function cleanText(v,max=64){ return String(v??'').normalize('NFKC').trim().slice(0,max); }
function validName(v,min,max){ const s=cleanText(v,max); return s.length>=min && s.length<=max && /^[\p{L}\p{N} ._-]+$/u.test(s); }
function hashPassword(password,salt=randomBytes(16).toString('hex')){ return { salt, hash:scryptSync(String(password),salt,64).toString('hex') }; }
function verifyPassword(password,salt,hash){
  try { const a=Buffer.from(scryptSync(String(password),salt,64).toString('hex'),'hex'); const b=Buffer.from(hash,'hex'); return a.length===b.length && timingSafeEqual(a,b); } catch { return false; }
}
function defaultState(){ return { progress:{completed:{},solutionViews:{},attempts:{},drafts:{}}, cosmetics:{purchased:[],activeTheme:'classic',accessory:'',pet:''}, xpSpent:0 }; }
function sanitizeState(state){
  const s=state && typeof state==='object'?state:{};
  const progress=s.progress&&typeof s.progress==='object'?s.progress:{};
  const cosmetics=s.cosmetics&&typeof s.cosmetics==='object'?s.cosmetics:{};
  return {
    progress:{
      completed: progress.completed&&typeof progress.completed==='object'?progress.completed:{},
      solutionViews: progress.solutionViews&&typeof progress.solutionViews==='object'?progress.solutionViews:{},
      attempts: progress.attempts&&typeof progress.attempts==='object'?progress.attempts:{},
      drafts: progress.drafts&&typeof progress.drafts==='object'?progress.drafts:{}
    },
    cosmetics:{
      purchased:Array.isArray(cosmetics.purchased)?cosmetics.purchased.slice(0,50):[],
      activeTheme:cleanText(cosmetics.activeTheme||'classic',30),
      accessory:cleanText(cosmetics.accessory||'',20),
      pet:cleanText(cosmetics.pet||'',20)
    },
    xpSpent:Math.max(0,Math.min(100000,Number(s.xpSpent)||0))
  };
}
function publicUser(u){ return { nickname:u.nickname,className:u.className,role:u.role,createdAt:u.createdAt }; }
function extractToken(req){ const h=req.headers.get('authorization')||''; return h.startsWith('Bearer ')?h.slice(7).trim():''; }

async function createSession(st,userK,user){
  const token=randomBytes(32).toString('hex');
  const expiresAt=Date.now()+SESSION_DAYS*24*60*60*1000;
  await st.setJSON(`session/${token}`,{userKey:userK,version:Number(user.sessionVersion||1),expiresAt});
  return token;
}

async function requireAuth(req){
  const token=extractToken(req); if(!token) throw Object.assign(new Error('Bitte melden Sie sich an.'),{status:401});
  const st=store(); const sess=await st.get(`session/${token}`,{type:'json'});
  if(!sess || Number(sess.expiresAt)<Date.now()){ if(sess) await st.delete(`session/${token}`); throw Object.assign(new Error('Die Sitzung ist abgelaufen. Bitte erneut anmelden.'),{status:401}); }
  const user=await st.get(sess.userKey,{type:'json'});
  if(!user || Number(user.sessionVersion||1)!==Number(sess.version)){ throw Object.assign(new Error('Die Sitzung ist nicht mehr gültig.'),{status:401}); }
  return {st,token,sess,user,userKey:sess.userKey};
}

function progressStats(state){
  const completed=Object.values(state?.progress?.completed||{});
  const earnedXP=completed.reduce((sum,r)=>sum+Number(r?.awardedXP||0),0);
  return {completed:completed.length,earnedXP,progressPct:Math.round(completed.length/TOTAL_TASKS*100)};
}

async function register(body){
  const role=body.role==='teacher'?'teacher':'student';
  const nickname=cleanText(body.nickname,24), className=cleanText(body.className,32), password=String(body.password||'');
  if(!validName(nickname,2,24)) return json({error:'Nickname: 2–24 Zeichen; erlaubt sind Buchstaben, Zahlen, Leerzeichen, Punkt, Unterstrich und Bindestrich.'},400);
  if(!validName(className,2,32)) return json({error:'Bitte eine gültige Klasse angeben.'},400);
  if(password.length<6 || password.length>128) return json({error:'Das Passwort muss mindestens 6 Zeichen lang sein.'},400);
  if(role==='teacher'){
    const teacherCode=process.env.TEACHER_CODE;
    if(!teacherCode) return json({error:'Der Lehrer-Code ist in Netlify noch nicht eingerichtet.'},503);
    if(String(body.teacherCode||'')!==teacherCode) return json({error:'Der Lehrer-Code ist nicht korrekt.'},403);
  }
  const st=store(); const uKey=userKey(className,nickname);
  if(await st.get(uKey,{type:'json'})) return json({error:'Dieser Nickname existiert in der angegebenen Klasse bereits.'},409);
  const pw=hashPassword(password), now=new Date().toISOString();
  const user={nickname,className,nicknameNorm:norm(nickname),classNorm:norm(className),role,passwordSalt:pw.salt,passwordHash:pw.hash,createdAt:now,lastSeen:now,lastLoginAt:now,sessionVersion:1,state:defaultState()};
  const result=await st.setJSON(uKey,user,{onlyIfNew:true});
  if(result?.modified===false) return json({error:'Dieser Nickname existiert in der angegebenen Klasse bereits.'},409);
  const token=await createSession(st,uKey,user);
  return json({token,user:publicUser(user),state:user.state});
}

async function login(body){
  const nickname=cleanText(body.nickname,24), className=cleanText(body.className,32), password=String(body.password||'');
  const st=store(), uKey=userKey(className,nickname), user=await st.get(uKey,{type:'json'});
  if(!user || !verifyPassword(password,user.passwordSalt,user.passwordHash)) return json({error:'Klasse, Nickname oder Passwort ist nicht korrekt.'},401);
  user.lastLoginAt=new Date().toISOString(); user.lastSeen=user.lastLoginAt; await st.setJSON(uKey,user);
  const token=await createSession(st,uKey,user);
  return json({token,user:publicUser(user),state:sanitizeState(user.state)});
}

async function saveState(req,body){
  const {st,user,userKey:uKey}=await requireAuth(req);
  user.state=sanitizeState(body.state); user.lastSeen=new Date().toISOString(); await st.setJSON(uKey,user);
  return json({ok:true});
}

async function getSession(req){ const {user}=await requireAuth(req); return json({user:publicUser(user),state:sanitizeState(user.state)}); }
async function logout(req){ const token=extractToken(req); if(token){try{await store().delete(`session/${token}`);}catch{}} return json({ok:true}); }

async function requireTeacher(req){ const auth=await requireAuth(req); if(auth.user.role!=='teacher') throw Object.assign(new Error('Lehrerzugang erforderlich.'),{status:403}); return auth; }
async function getTargetTeacherClass(st,teacher,targetKey){
  if(!String(targetKey||'').startsWith(`user/${keyPart(teacher.className)}/`)) throw Object.assign(new Error('Dieser Nutzer gehört nicht zu Ihrer Klasse.'),{status:403});
  const target=await st.get(targetKey,{type:'json'}); if(!target) throw Object.assign(new Error('Nutzer nicht gefunden.'),{status:404});
  if(target.classNorm!==teacher.classNorm) throw Object.assign(new Error('Dieser Nutzer gehört nicht zu Ihrer Klasse.'),{status:403});
  return target;
}

async function listClass(req){
  const {st,user}=await requireTeacher(req); const prefix=`user/${keyPart(user.className)}/`; const {blobs}=await st.list({prefix});
  const users=[];
  for(const b of blobs){
    const u=await st.get(b.key,{type:'json'}); if(!u)continue; const stats=progressStats(sanitizeState(u.state));
    users.push({key:b.key,nickname:u.nickname,role:u.role,...stats,lastSeen:u.lastSeen?new Date(u.lastSeen).toLocaleString('de-DE'):'–'});
  }
  users.sort((a,b)=>a.role.localeCompare(b.role)||a.nickname.localeCompare(b.nickname,'de'));
  return json({users});
}

async function resetUserProgress(req,body){
  const {st,user}=await requireTeacher(req); const target=await getTargetTeacherClass(st,user,body.userKey); if(target.role==='teacher') return json({error:'Lehrerkonten werden hier nicht zurückgesetzt.'},400);
  target.state=defaultState(); target.lastSeen=new Date().toISOString(); await st.setJSON(body.userKey,target); return json({ok:true});
}
async function resetClassProgress(req){
  const {st,user}=await requireTeacher(req); const prefix=`user/${keyPart(user.className)}/`; const {blobs}=await st.list({prefix}); let count=0;
  for(const b of blobs){ const u=await st.get(b.key,{type:'json'}); if(!u||u.role==='teacher')continue; u.state=defaultState(); await st.setJSON(b.key,u); count++; }
  return json({ok:true,count});
}
async function deleteUser(req,body){
  const {st,user}=await requireTeacher(req); const target=await getTargetTeacherClass(st,user,body.userKey); if(target.role==='teacher') return json({error:'Lehrerkonten können nicht über diese Funktion gelöscht werden.'},400); await st.delete(body.userKey); return json({ok:true});
}
async function resetPassword(req,body){
  const {st,user}=await requireTeacher(req); const target=await getTargetTeacherClass(st,user,body.userKey); if(target.role==='teacher') return json({error:'Passwortänderungen anderer Lehrerkonten sind hier nicht vorgesehen.'},400);
  const newPassword=String(body.newPassword||''); if(newPassword.length<6||newPassword.length>128) return json({error:'Das neue Passwort muss mindestens 6 Zeichen lang sein.'},400);
  const pw=hashPassword(newPassword); target.passwordSalt=pw.salt; target.passwordHash=pw.hash; target.sessionVersion=Number(target.sessionVersion||1)+1; target.lastSeen=new Date().toISOString(); await st.setJSON(body.userKey,target); return json({ok:true});
}

export default async (req) => {
  if(req.method==='OPTIONS') return new Response(null,{status:204});
  if(req.method!=='POST') return json({error:'Nur POST-Anfragen werden unterstützt.'},405);
  let body={}; try{body=await req.json();}catch{return json({error:'Ungültige Anfrage.'},400);}
  try{
    switch(body.action){
      case 'register': return await register(body);
      case 'login': return await login(body);
      case 'session': return await getSession(req);
      case 'saveState': return await saveState(req,body);
      case 'logout': return await logout(req);
      case 'listClass': return await listClass(req);
      case 'resetUserProgress': return await resetUserProgress(req,body);
      case 'resetClassProgress': return await resetClassProgress(req);
      case 'deleteUser': return await deleteUser(req,body);
      case 'resetPassword': return await resetPassword(req,body);
      default: return json({error:'Unbekannte Aktion.'},400);
    }
  }catch(err){ console.error(err); return json({error:err.message||'Interner Fehler.'},err.status||500); }
};
