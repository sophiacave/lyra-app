import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home.html');
}
// Homepage is served as static HTML from public/home.html
