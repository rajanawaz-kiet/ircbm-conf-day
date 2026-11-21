import React,{useEffect,useState} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import type {User} from 'firebase/auth';
import {doc,getDoc} from 'firebase/firestore';
import {secureAuth,publicDb,firebaseConfigured} from './firebaseClient';
import {completeEmailSignIn,emailSignInLink} from './emailLinkAuth';
export type SecureRole='admin'|'volunteer'|'participant';
export function useSecureUser(){
 const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[role,setRole]=useState<SecureRole>('participant');
 useEffect(()=>{if(!firebaseConfigured||!secureAuth){setReady(true);return;}
   let mounted=true;
   completeEmailSignIn().catch(e=>{if(mounted)console.error('Email sign-in failed',e);});
   const unsub=onAuthStateChanged(secureAuth,async u=>{
    if(!mounted)return;
    setUser(u);setRole('participant');
    if(u){try{const snap=await getDoc(doc(publicDb!,'roles',u.uid));if(mounted&&snap.exists()&&snap.data().enabled===true&&['admin','volunteer'].includes(snap.data().role))setRole(snap.data().role as SecureRole);}catch(e){console.error('Role verification failed',e)}}
    if(mounted)setReady(true);
   });return ()=>{mounted=false;unsub()};
 },[]);
 return {user,role,ready,signOut:()=>secureAuth?signOut(secureAuth):Promise.resolve()};
}
export function EmailAccess({user,role,onSignOut}:{user:User|null;role:SecureRole;onSignOut:()=>Promise<void>}){
 const [email,setEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 if(!firebaseConfigured)return <div className="max-w-xl mx-auto bg-white rounded-xl p-8 mt-10 shadow-sm"><h2 className="font-bold text-xl">Secure access is not configured</h2><p className="mt-2">The programme remains publicly readable. The administrator must complete Firebase configuration before sign-in, QR passes or attendance scanning are enabled. No temporary shared password is available.</p></div>;
 if(user)return <div className="bg-white rounded-xl p-6 space-y-3"><p><b>Signed in:</b> {user.email}</p><p><b>Role:</b> {role}</p><p className="text-sm">An account must be approved as an administrator or volunteer before restricted actions are available.</p><button className="bg-slate-800 text-white rounded p-2" onClick={onSignOut}>Sign out</button></div>;
 return <form onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage('');try{await emailSignInLink(email);setMessage('Sign-in link sent. Check your email and open the link on this device, or enter the same email on another device.');}catch(e){setMessage(`Sign-in could not be sent: ${String((e as Error).message||e)}`)}finally{setBusy(false)}}} className="max-w-lg mx-auto bg-white rounded-xl p-8 my-10 space-y-4"><h1 className="text-xl font-bold">Conference Companion — Secure Sign-in</h1><p className="text-sm">Use the approved email address associated with your registration or volunteer authorization.</p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your approved email" className="border rounded w-full p-3"/><button disabled={busy} className="bg-slate-800 text-white px-5 py-3 rounded">{busy?'Sending…':'Email me a secure sign-in link'}</button><p role="status" className="text-sm">{message}</p></form>;
}
