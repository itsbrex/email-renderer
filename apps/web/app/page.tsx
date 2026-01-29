import DesktopLayout from '@/components/desktop-layout';
import MobileLayout from '@/components/mobile-layout';
import { Header } from '@/components/header';

export default function Page() {
  return (
    <div className="flex h-screen flex-col bg-zinc-900">
      <Header />
      <DesktopLayout />
      <MobileLayout />
    </div>
  );
}
