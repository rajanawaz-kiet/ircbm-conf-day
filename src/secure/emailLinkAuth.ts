/** Firebase Authentication email link sign-in (participant and volunteer).
 * Enable Email link authentication in the Firebase console, and authorize Netlify domain.
 */
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { secureAuth } from './firebaseClient';

export async function emailSignInLink(email:string) {
  const normalized=email.trim().toLowerCase();
  await sendSignInLinkToEmail(secureAuth!,normalized,{
    url: `${window.location.origin}/?finishEmailSignIn=1`, handleCodeInApp:true
  });
  // NOTE: localStorage here stores ONLY the entered email for completing a sign-in,
  // not programme data, passwords, QR secrets, or attendee lists.
  window.localStorage.setItem('ircbm_login_email',normalized);
}
export async function completeEmailSignIn() {
  if (!isSignInWithEmailLink(secureAuth!,window.location.href)) return null;
  const email=window.localStorage.getItem('ircbm_login_email') || window.prompt('Enter the email address that received this link:');
  if (!email) throw new Error('Email address required to complete sign-in.');
  const credential=await signInWithEmailLink(secureAuth!,email,window.location.href);
  window.localStorage.removeItem('ircbm_login_email');
  window.history.replaceState({},document.title,window.location.pathname);
  return credential.user;
}
