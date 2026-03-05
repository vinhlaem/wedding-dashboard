import Link from "next/link";

import {
  LayoutDashboard,
  Images,
  CalendarDays,
  Video,
  Clock,
  Users,
  Quote,
  ArrowRight,
  Image,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/banner", label: "Banner", icon: Image },
  { href: "/dashboard/gallery", label: "Gallery", icon: Images },
  { href: "/dashboard/program", label: "Wedding Program", icon: CalendarDays },
  { href: "/dashboard/video", label: "Video", icon: Video },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/profile", label: "Profile", icon: Users },
  { href: "/dashboard/quote", label: "Quote", icon: Quote },
];

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Dashboard Overview
      </h2>
      <p className="text-gray-500 mb-8">
        Manage images for your wedding website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {links.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className="group flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <item.icon className="text-rose-500" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{item.label}</h3>
              <p className="text-sm text-gray-500">
                Manage the {item.label.toLowerCase()} content
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm text-rose-500 font-medium group-hover:gap-2 transition-all">
              Manage <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
