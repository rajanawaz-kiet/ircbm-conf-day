/** Server-verified calls; these are intentionally asynchronous. Do not call old localStorage methods. */
import { httpsCallable } from 'firebase/functions';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { publicDb, server } from './firebaseClient';

export type Paper = {id:string; date:string; startTime:string; endTime:string; title:string;
  presenterName:string; coAuthors:string; institution:string; track:string; room:string;
  abstractDescription:string};
export function watchProgramme(onData:(items:Paper[])=>void,onError:(error:Error)=>void) {
 return onSnapshot(query(collection(publicDb!,'programme')),
   snapshot => onData(snapshot.docs.map(doc => ({id:doc.id,...doc.data()} as Paper))), onError);
}
export async function replaceProgramme(items:Paper[]) {
 const call=httpsCallable(server!,'replaceProgramme');
 return (await call({items})).data;
}
export async function saveProgrammeItem(id:string,item:Omit<Paper,'id'>) {
 return (await httpsCallable(server!,'saveProgrammeItem')({id,item})).data;
}
export async function deleteProgrammeItem(id:string) {
 return (await httpsCallable(server!,'deleteProgrammeItem')({id})).data;
}
export type ImportedParticipant = {participantId:string;name:string;email:string;institution:string;participantCategory:string};
export async function importParticipants(items:ImportedParticipant[]) {
 return (await httpsCallable(server!,'importParticipants')({items})).data;
}
export async function getMyPass() {
 return (await httpsCallable(server!,'getMyPass')({})).data as {participantId:string;name:string;category:string;qrToken:string};
}
export async function checkInQR(qrToken:string) {
 return (await httpsCallable(server!,'checkInQR')({qrToken})).data as
  {status:'checked_in'|'already_checked_in'; participantId:string;name:string;checkedInAt?:string};
}
export async function listParticipants() {
 return (await httpsCallable(server!,'listParticipants')({})).data;
}
export async function authorizeVolunteer(email:string, enabled:boolean) {
 return (await httpsCallable(server!,'createOrUpdateVolunteer')({email,enabled})).data;
}

export async function setCheckInClosed(closed:boolean) {
 return (await httpsCallable(server!,'setCheckInClosed')({closed})).data;
}
export async function getCheckInStatus() {
 return (await httpsCallable(server!,'getCheckInStatus')({})).data as {closed:boolean};
}
export async function loadApprovedProgramme() {
 return (await httpsCallable(server!,'loadApprovedProgramme')({})).data;
}
