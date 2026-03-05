import Link from "next/link";
import { Image, Images, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Dashboard Overview
      </h2>
      <p className="text-gray-500 mb-8">
        Manage images for your wedding website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          href="/dashboard/banner"
          className="group flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
            <Image className="text-rose-500" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Banner</h3>
            <p className="text-sm text-gray-500">
              Manage the hero banner image
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm text-rose-500 font-medium group-hover:gap-2 transition-all">
            Manage <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/dashboard/gallery"
          className="group flex flex-col gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Images className="text-purple-500" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Gallery</h3>
            <p className="text-sm text-gray-500">Manage gallery images</p>
          </div>
          <span className="flex items-center gap-1 text-sm text-purple-500 font-medium group-hover:gap-2 transition-all">
            Manage <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </div>
  );
}
