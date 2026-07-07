import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-700/10 bg-white py-10">
      <div className="premium-container flex flex-col justify-between gap-6 text-sm text-navy-700/70 md:flex-row md:items-center">
        <Link href="/" className="flex items-center gap-3 text-navy-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy-700 text-gold"><GraduationCap className="h-5 w-5" /></div>
          <div><p className="font-black">EBH Training Academy</p><p>Workspace • Training Room • Meeting Room</p></div>
        </Link>
        <p>© {new Date().getFullYear()} EBH Group Sdn Bhd. All rights reserved.</p>
      </div>
    </footer>
  );
}
