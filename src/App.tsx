import React,{useState,useEffect} from 'react';
import {onSnapshot,collection,query} from 'firebase/firestore';
import {ActivePage,ProgrammeItem,Participant} from './types';
import {store} from './services/store';
import {Header} from './components/Header';
import {OfficialLogo} from './components/OfficialLogo';
import {HomeView} from './views/HomeView';
import {ProgrammeView} from './views/ProgrammeView';
import {MyScheduleView} from './views/MyScheduleView';
import {VenueView} from './views/VenueView';
import {AnnouncementsView} from './views/AnnouncementsView';
import {firebaseConfigured,publicDb} from './secure/firebaseClient';
import {useSecureUser,EmailAccess} from './secure/SecureAccess';
import {SecureAdmin} from './secure/SecureAdmin';
import {ParticipantPass} from './secure/ParticipantPass';
import {VolunteerScanner} from './secure/VolunteerScanner';
import verifiedProgramme from './data/programme_verified_58.json';

/** Secure production routes replace the legacy localStorage admin, password, and tracker pages.
 * Conference branding and public presentation views stay as in the supplied GitHub source.
 */
export default function App(){
 const [activePage,setActivePage]=useState<ActivePage>('home');
 const [programmeItems,setProgrammeItems]=useState<ProgrammeItem[]>(verifiedProgramme as ProgrammeItem[]);
 const [programmeError,setProgrammeError]=useState('');
 const [announcements]=useState(()=>store.getAnnouncements());
 const [venueInfo]=useState(()=>store.getVenueInfo());
 const [assets]=useState(()=>store.getAssets());
 const [savedScheduleIds,setSavedScheduleIds]=useState<string[]>(()=>store.getScheduleItemIds());
 const [selectedProgrammeItem,setSelectedProgrammeItem]=useState<ProgrammeItem|null>(null);
 const {user,role,ready,signOut}=useSecureUser();
 const [localRev,setLocalRev]=useState(0);
 useEffect(()=>store.subscribe(()=>{setSavedScheduleIds(store.getScheduleItemIds());setLocalRev(v=>v+1)}),[]);
 useEffect(()=>{
   if(!firebaseConfigured || !publicDb) return;
   return onSnapshot(query(collection(publicDb,'programme')),snapshot=>{
     // Once connected, show ONLY actual centrally stored records; do not silently show demo data.
     setProgrammeItems(snapshot.docs.map(d=>({id:d.id,...d.data()} as ProgrammeItem)));
     setProgrammeError('');
   },error=>{setProgrammeError(`Could not load shared programme: ${error.message}`)});
 },[]);
 useEffect(()=>{
   const params=new URLSearchParams(window.location.search);
   // Setup link is navigation only. It NEVER authenticates a volunteer.
   if(params.get('gate')==='tracker'||params.get('mode')==='tracker')setActivePage('tracker');
   if(params.get('finishEmailSignIn'))setActivePage('sign-in');
 },[]);
 const currentUser:Participant|null=user?{
  participantId:user.uid,title:'',firstName:user.displayName||user.email?.split('@')[0]||'Participant',lastName:'',
  email:user.email||'',mobile:'',institution:'',designation:'',city:'',country:'',
  participantCategory:'Presenter',qrToken:'',checkedIn:false,createdAt:'',role:role==='volunteer'?'tracker':role==='admin'?'admin':'participant'
 }:null;
 const handleNavigate=(page:ActivePage)=>{setActivePage(page);window.scrollTo({top:0,behavior:'smooth'})};
 const requireAccess=(page:'admin'|'tracker'|'my-qr-pass')=>{
  if(!firebaseConfigured)return <EmailAccess user={user} role={role} onSignOut={signOut}/>;
  if(!ready)return <p className="text-center p-10">Verifying account access…</p>;
  if(!user)return <EmailAccess user={user} role={role} onSignOut={signOut}/>;
  if(page==='admin')return role==='admin'?<SecureAdmin papers={programmeItems}/>:<p role="alert" className="text-center p-10">Your account is not authorized as an administrator.</p>;
  if(page==='tracker')return role==='admin'||role==='volunteer'?<div className="max-w-3xl mx-auto p-6"><VolunteerScanner/></div>:<p role="alert" className="text-center p-10">Only individually authorized conference volunteers may operate the scanner.</p>;
  return <div className="max-w-3xl mx-auto p-6"><ParticipantPass/></div>;
 };
 return <div className="min-h-screen flex flex-col bg-[#E0DCD5] text-[#262B37] font-sans antialiased selection:bg-[#F3F2F0] selection:text-[#262B37]">
 <Header activePage={activePage} onNavigate={handleNavigate} currentUser={currentUser} onSignOut={()=>{void signOut();handleNavigate('home')}}/>
 <main className="flex-1 pb-16">
 {programmeError&&<div role="alert" className="bg-amber-100 p-3 text-center">{programmeError}</div>}
 {activePage==='home'&&<HomeView onNavigate={handleNavigate} programmeItems={programmeItems} announcements={announcements} venueInfo={venueInfo} assets={assets} onViewProgrammeDetail={item=>{setSelectedProgrammeItem(item);handleNavigate('programme')}}/>}
 {activePage==='programme'&&<ProgrammeView programmeItems={programmeItems} currentUser={currentUser} savedItemIds={savedScheduleIds} onToggleSchedule={id=>store.toggleScheduleItem(id)} onRequireSignIn={()=>handleNavigate('sign-in')} selectedDetailItem={selectedProgrammeItem} setSelectedDetailItem={setSelectedProgrammeItem}/>}
 {activePage==='my-schedule'&&<MyScheduleView currentUser={currentUser} savedItems={programmeItems.filter(p=>savedScheduleIds.includes(p.id))} onRemoveFromSchedule={id=>store.toggleScheduleItem(id)} onViewProgrammeDetail={item=>{setSelectedProgrammeItem(item);handleNavigate('programme')}} onNavigateToProgramme={()=>handleNavigate('programme')} onNavigateToSignIn={()=>handleNavigate('sign-in')}/>}
 {activePage==='venue'&&<VenueView venueInfo={venueInfo} onNavigateToProgramme={()=>handleNavigate('programme')}/>}
 {activePage==='announcements'&&<AnnouncementsView announcements={announcements}/>}
 {activePage==='sign-in'&&<div className="max-w-2xl mx-auto p-4"><EmailAccess user={user} role={role} onSignOut={signOut}/></div>}
 {activePage==='register'&&<div className="max-w-xl mx-auto p-8 bg-white rounded mt-10"><h2 className="font-bold text-xl">Approved conference presenters</h2><p className="mt-2">Registration is managed through the conference administrator's approved participant CSV. Use your approved email address to sign in and access your personal QR pass.</p><button onClick={()=>handleNavigate('sign-in')} className="mt-4 bg-slate-800 text-white px-4 py-2 rounded">Secure sign-in</button></div>}
 {activePage==='my-profile'&&<div className="max-w-2xl mx-auto p-6"><EmailAccess user={user} role={role} onSignOut={signOut}/></div>}
 {(activePage==='admin'||activePage==='tracker'||activePage==='my-qr-pass')&&requireAccess(activePage)}
 </main>
      {/* Section 29: FOOTER
          Contains the official IRCBM 2026 logo on every page, with clean conference credentials and admin gateway.
          Features TWO distinct color shades as observed in the image footer palette.
      */}
      <footer id="conference-footer" className="print:hidden">
        {/* Upper Footer Shade: Deep Midnight Ocean Navy (#091B2E) */}
        <div className="bg-[#091B2E] border-t border-[#122A44] py-10 px-4 text-center text-xs text-[#96A9BD]">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
            <button
              id="footer-logo-btn"
              onClick={() => handleNavigate('home')}
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#1793D1] rounded-md p-1 transition-opacity hover:opacity-90"
              aria-label="IRCBM 2026 Home"
            >
              <OfficialLogo size="md" light={true} className="h-9 md:h-10" />
            </button>
            <div className="space-y-1.5 text-center max-w-xl">
              <p className="font-bold text-white text-sm tracking-tight">
                International Research Conference on Business &amp; Management (IRCBM 2026)
              </p>
              <p className="text-[#96A9BD] text-xs leading-relaxed">
                Faculty of Management Sciences (FoMS), Karachi Institute of Economics and Technology (KIET)
              </p>
              <div className="flex items-center justify-center gap-3 pt-2 text-[11px] text-[#788DA2]">
                <span>Official Conference Portal</span>
                <span>•</span>
                <button
                  id="footer-admin-link"
                  onClick={() => handleNavigate('admin')}
                  className="text-white hover:text-slate-200 font-medium underline underline-offset-2 transition-colors"
                >
                  Organizer Administration Area
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Footer Shade: Darker Midnight Shade (#050E1A) */}
        <div className="bg-[#050E1A] border-t border-[#0F2236] py-4 px-4 text-center text-[11px] text-[#63788E]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026 IRCBM • Faculty of Management Sciences (FoMS), Karachi Institute of Economics and Technology (KIET). All Rights Reserved.
            </p>
            <p className="text-[#7D93AA]">
              Official Conference Companion
            </p>
          </div>
        </div>
      </footer>
 </div>;
}
