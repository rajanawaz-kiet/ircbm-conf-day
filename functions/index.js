/** IRCBM 2026 Cloud Functions. Server-side authorization and atomic check-in.
 * Setup: Firebase Authentication (email link) + Firestore + Secret Manager secret IRCBM_QR_SECRET.
 * Deploy via Firebase CLI. Never put the QR secret in frontend source, GitHub, or Netlify environment.
 */
import crypto from 'node:crypto';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore, FieldValue} from 'firebase-admin/firestore';
import {onCall, HttpsError} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';

initializeApp();
const db = getFirestore();
const qrSecret = defineSecret('IRCBM_QR_SECRET');
const region = 'asia-south1';
const validCategories = new Set(['Presenter', 'Faculty / Academic', 'Student', 'Industry Participant', 'Guest', 'Other']);
const idPattern = /^[A-Za-z0-9_-]{4,80}$/;

function fail(code, message) { throw new HttpsError(code, message); }
function requireLogin(request) { if (!request.auth?.uid) fail('unauthenticated', 'Sign in to continue.'); return request.auth; }
async function requireRole(request, allowed) {
 const auth = requireLogin(request);
 const snap = await db.collection('roles').doc(auth.uid).get();
 if (!snap.exists || !allowed.includes(snap.data().role) || snap.data().enabled !== true) {
   fail('permission-denied', 'Your account is not authorized for this action.');
 }
 return {uid:auth.uid, role:snap.data().role};
}
const lower = v => String(v ?? '').trim().toLowerCase();
const str = (v, max=1000) => String(v ?? '').trim().slice(0,max);
function qrCode(id, secret) {
 const signature = crypto.createHmac('sha256', secret).update(`IRCBM-2026:${id}`).digest('hex');
 return `IRCBM26:${id}:${signature}`;
}
function parseQR(code, secret) {
 const m = /^IRCBM26:([A-Za-z0-9_-]{4,80}):([a-f0-9]{64})$/.exec(String(code || '').trim());
 if (!m) fail('invalid-argument', 'Unrecognized QR pass format.');
 const expected = crypto.createHmac('sha256', secret).update(`IRCBM-2026:${m[1]}`).digest('hex');
 if (!crypto.timingSafeEqual(Buffer.from(m[2], 'hex'), Buffer.from(expected, 'hex'))) {
   fail('permission-denied', 'QR pass signature is invalid.');
 }
 return m[1];
}
const paperFields = ['date','startTime','endTime','title','presenterName','coAuthors','institution','track','room','abstractDescription'];
function normalizedPaper(raw) {
 const out = {};
 for (const field of paperFields) out[field] = str(raw?.[field], field === 'abstractDescription' ? 4000 : 350);
 if (!out.title || !out.presenterName || !out.date || !out.startTime || !out.endTime || !out.room) fail('invalid-argument', 'Paper requires date, times, title, presenter and room.');
 return out;
}
// Replace ALL programme entries with one verified approved CSV import. Never do this from a public client.
export const replaceProgramme = onCall({region, timeoutSeconds:120, maxInstances:3}, async request => {
 await requireRole(request, ['admin']);
 const incoming = request.data?.items;
 if (!Array.isArray(incoming) || incoming.length < 1 || incoming.length > 500) fail('invalid-argument', 'Upload 1–500 programme entries.');
 const docs = incoming.map((raw, i) => {
   const paper = normalizedPaper(raw);
   const id = str(raw.id || `paper-${i+1}`, 80);
   if (!idPattern.test(id)) fail('invalid-argument', 'Invalid paper ID.');
   return {id, paper};
 });
 if (new Set(docs.map(d=>d.id)).size !== docs.length) fail('invalid-argument', 'Repeated paper ID in upload.');
 const existing = await db.collection('programme').get();
 const writer = db.bulkWriter();
 for (const doc of existing.docs) writer.delete(doc.ref);
 for (const item of docs) writer.set(db.collection('programme').doc(item.id), item.paper);
 await writer.close();
 return {success:true, imported:docs.length, replaced:existing.size};
});
export const saveProgrammeItem = onCall({region}, async request => {
 await requireRole(request, ['admin']);
 const id = str(request.data?.id,80);
 if (!idPattern.test(id)) fail('invalid-argument','Invalid paper ID.');
 await db.collection('programme').doc(id).set(normalizedPaper(request.data?.item));
 return {success:true};
});
export const deleteProgrammeItem = onCall({region}, async request => {
 await requireRole(request, ['admin']);
 const id = str(request.data?.id,80);
 if (!idPattern.test(id)) fail('invalid-argument','Invalid paper ID.');
 await db.collection('programme').doc(id).delete();
 return {success:true};
});
// Import approved participants. Does not overwrite any existing checked-in status.
// CSV parsing is done by browser; individual rows are validated again on the server.
export const importParticipants = onCall({region, timeoutSeconds:120, maxInstances:3}, async request => {
 await requireRole(request, ['admin']);
 const rows = request.data?.items;
 if (!Array.isArray(rows) || rows.length < 1 || rows.length > 400) fail('invalid-argument', 'Upload 1–400 participants per batch.');
 const normalized = rows.map((raw,i)=>{
   const email = lower(raw.email), name = str(raw.name,180);
   const id = str(raw.participantId || `IRCBM-2026-${1001+i}`,80);
   if (!idPattern.test(id) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) fail('invalid-argument', `Invalid ID, name or email in row ${i+1}.`);
   const category = str(raw.participantCategory,90);
   return {id, name, email, institution:str(raw.institution,250), participantCategory:validCategories.has(category)?category:'Other'};
 });
 if (new Set(normalized.map(x=>x.id)).size !== normalized.length || new Set(normalized.map(x=>x.email)).size !== normalized.length) fail('invalid-argument','Duplicate participant IDs or emails in import.');
 const existingEmail = await Promise.all(normalized.map(x => db.collection('participants').where('emailLower','==',x.email).limit(2).get()));
 for(let i=0;i<normalized.length;i++) {
   if (existingEmail[i].docs.some(doc=>doc.id!==normalized[i].id)) fail('already-exists',`Email already belongs to another participant: row ${i+1}.`);
 }
 const existingDocs = await Promise.all(normalized.map(row => db.collection('participants').doc(row.id).get()));
 const writer=db.bulkWriter();
 for(let i=0;i<normalized.length;i++) {
   const row=normalized[i], ref=db.collection('participants').doc(row.id);
   const fields={name:row.name, emailLower:row.email, institution:row.institution, participantCategory:row.participantCategory, approved:true, importedAt:FieldValue.serverTimestamp()};
   // Preserve previously recorded attendance on re-import.
   if (!existingDocs[i].exists) Object.assign(fields,{checkedIn:false,checkedInAt:null});
   writer.set(ref,fields,{merge:true});
 }
 await writer.close();
 return {success:true, imported:normalized.length};
});

export const getMyPass = onCall({region, secrets:[qrSecret]}, async request => {
 const auth=requireLogin(request);
 const email = lower(auth.token.email);
 if (!auth.token.email_verified || !email) fail('permission-denied','Verify the approved email address first.');
 const snap=await db.collection('participants').where('emailLower','==',email).limit(2).get();
 if (snap.empty) fail('not-found','Your email is not on the approved participant list.');
 if (snap.size !== 1) fail('failed-precondition','Duplicate email records require administrator review.');
 const doc=snap.docs[0], data=doc.data();
 if (data.approved!==true) fail('permission-denied','Participant has not been approved.');
 return {participantId:doc.id, name:data.name, category:data.participantCategory, qrToken:qrCode(doc.id,qrSecret.value())};
});
export const checkInQR = onCall({region, secrets:[qrSecret], maxInstances:20}, async request => {
 const operator=await requireRole(request,['admin','volunteer']);
 const participantId=parseQR(request.data?.qrToken,qrSecret.value());
 const ref=db.collection('participants').doc(participantId);
 const result=await db.runTransaction(async tx=>{
   const snap=await tx.get(ref);
   if (!snap.exists || snap.data().approved!==true) fail('not-found','Participant not approved or not found.');
   const p=snap.data();
   if(p.checkedIn===true) return {status:'already_checked_in',participantId,name:p.name,checkedInAt:p.checkedInAt?.toDate?.()?.toISOString?.() || null};
   tx.update(ref,{checkedIn:true,checkedInAt:FieldValue.serverTimestamp(),checkedInBy:operator.uid});
   const audit=db.collection('checkin_audit').doc();
   tx.create(audit,{participantId,volunteerUid:operator.uid,checkedInAt:FieldValue.serverTimestamp(),method:'qr'});
   return {status:'checked_in',participantId,name:p.name};
 });
 return result;
});
export const listParticipants = onCall({region}, async request => {
 await requireRole(request,['admin']);
 const snap=await db.collection('participants').orderBy('name').limit(1000).get();
 return {participants:snap.docs.map(doc=>({participantId:doc.id,name:doc.data().name,email:doc.data().emailLower,institution:doc.data().institution,participantCategory:doc.data().participantCategory,checkedIn:doc.data().checkedIn===true,checkedInAt:doc.data().checkedInAt?.toDate?.()?.toISOString?.()||null}))};
});
export const createOrUpdateVolunteer = onCall({region},async request=>{
 await requireRole(request,['admin']);
 const email=lower(request.data?.email);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('invalid-argument','Invalid email.');
 const {getAuth}=await import('firebase-admin/auth');
 let user;
 try { user=await getAuth().getUserByEmail(email); }
 catch(e) { if(e.code==='auth/user-not-found') fail('failed-precondition','Volunteer must first create and verify a Firebase Authentication account.'); throw e; }
 if(user.emailVerified!==true) fail('failed-precondition','Volunteer must verify email first.');
 const enabled=request.data?.enabled===true;
 await db.collection('roles').doc(user.uid).set({role:'volunteer',enabled,emailLower:email,updatedAt:FieldValue.serverTimestamp()});
 return {success:true,email,enabled};
});
