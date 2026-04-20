"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Image,
  LayoutDashboard,
  Images,
  CalendarDays,
  Video,
  Clock,
  Users,
  Quote,
  GiftIcon,
  LogOut,
} from "lucide-react";
import { removeToken, getUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth";

export const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/banner", label: "Banner", icon: Image },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images },
  { href: "/dashboard/program", label: "Wedding Program", icon: CalendarDays },
  { href: "/dashboard/video", label: "Video", icon: Video },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/profile", label: "Profile", icon: Users },
  { href: "/dashboard/quote", label: "Quote", icon: Quote },
  { href: "/dashboard/gift", label: "Gift", icon: GiftIcon },
  { href: "/dashboard/slide", label: "Slide", icon: Image },
  { href: "/dashboard/footer", label: "Footer", icon: Image },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-rose-500">💒 Wedding Admin</h1>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-rose-50 text-rose-600 border-r-2 border-rose-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        {user && (
          <div className="flex items-center gap-3">
            {user.picture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
        <p className="text-xs text-gray-400">Wedding Dashboard v1.0</p>
      </div>
    </aside>
  );
}
