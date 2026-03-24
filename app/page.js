// Root page — middleware rewrites / to /home.html (static)
// This component is a fallback if middleware doesn't catch it
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home.html');
}
