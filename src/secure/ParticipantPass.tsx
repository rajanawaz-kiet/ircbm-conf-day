import React,{useEffect,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {getMyPass} from './conferenceApi';

export function ParticipantPass() {
 const [data,setData]=useState<Awaited<ReturnType<typeof getMyPass>>|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{getMyPass().then(setData).catch(e=>setError(String(e?.message||e)));},[]);
 if(error) return <p role="alert">{error}</p>;
 if(!data) return <p>Loading your approved QR pass…</p>;
 return <section className="text-center space-y-4">
  <h2 className="text-xl font-bold">IRCBM 2026 Official QR Pass</h2>
  <p>{data.name} — {data.category}</p>
  <div className="flex justify-center"><QRCodeSVG value={data.qrToken} size={240} level="H" /></div>
  <p>{data.participantId}</p>
  <p className="text-sm">Present this pass to an authorized conference volunteer at registration.</p>
 </section>;
}
