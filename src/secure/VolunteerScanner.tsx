/** Volunteer scanner component, to replace the insecure ?gate=tracker mode.
 * Requires: npm install html5-qrcode firebase
 * A Firebase Authentication login MUST occur before opening this component.
 * The server refuses scans unless the signed-in account is an enabled volunteer/admin.
 */
import React, {useEffect,useRef,useState} from 'react';
import {Html5Qrcode} from 'html5-qrcode';
import {checkInQR} from './conferenceApi';

export function VolunteerScanner() {
 const scanner=useRef<Html5Qrcode|null>(null);
 const busy=useRef(false);
 const [status,setStatus]=useState('Point your camera at a participant QR pass.');
 useEffect(()=>{
   let live=true;
   const reader=new Html5Qrcode('ircbm-volunteer-camera');
   scanner.current=reader;
   reader.start({facingMode:'environment'},{fps:8,qrbox:{width:230,height:230}},async text=>{
     if(busy.current||!live) return;
     busy.current=true;
     try {
       const result=await checkInQR(text);
       if(live) setStatus(result.status==='checked_in' ? `Checked in: ${result.name}` : `Already checked in: ${result.name}`);
     } catch(e) {
       if(live) setStatus(`Scan rejected: ${e instanceof Error?e.message:'Unknown error'}`);
     } finally {
       // Prevent repeated scan of the same visible pass; volunteer can scan another pass after a short cooldown.
       setTimeout(()=>{busy.current=false;},1800);
     }
   },()=>{}).catch(err=>{if(live)setStatus(`Camera could not start: ${String(err)}`);});
   return ()=>{live=false; if(reader.isScanning) reader.stop().catch(()=>{});};
 },[]);
 return <section className="space-y-4"><h2 className="text-xl font-bold">Volunteer QR Check-In</h2>
   <div id="ircbm-volunteer-camera" className="w-full max-w-md" />
   <p role="status" aria-live="polite" className="font-semibold">{status}</p>
   <p className="text-sm">Only authorized volunteers can record attendance. Invalid and duplicate scans are rejected by the server.</p>
 </section>;
}
