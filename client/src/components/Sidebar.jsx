import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  icons,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navItems = [
    {
      to: "/ai",
      label: "Dashboard",
      Icon: House,
      activeColor: "from-[#3588F2] to-[#0BB0D7]",
    },
    {
      to: "/ai/write-article",
      label: "Write Article",
      Icon: SquarePen,

      activeColor: "from-blue-500 to-blue-700",
    },
    {
      to: "/ai/blog-titles",
      label: "Blog Titles",
      Icon: Hash,
      activeColor: "from-pink-400 to-pink-600",
    },
    {
      to: "/ai/generate-images",
      label: "Generate Images",
      Icon: Image,
      activeColor: "from-green-500 to-green-700",
    },
    {
      to: "/ai/remove-background",
      label: "Remove Background",
      Icon: Eraser,
      activeColor: "from-orange-500 to-orange-700",
    },
    {
      to: "/ai/remove-object",
      label: "Remove Object",
      Icon: Scissors,
      activeColor: "from-amber-500 to-orange-300",
    },
    {
      to: "/ai/review-resume",
      label: "Review Resume",
      Icon: FileText,
      activeColor: "from-purple-500 to-indigo-700",
    },
    {
      to: "/ai/community",
      label: "Community",
      Icon: Users,
      activeColor: "from-gray-500 to-gray-700",
    },
  ];
  return (
    <div
      className={`bg-white/60 backdrop-blur-xl border-r border-white/20 shadow-lg flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          alt="User Avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center">{user.fullName}</h1>
        <div className="px-6 mt-5 text-sm text-black font-medium">
          {navItems.map(({ to, label, Icon, activeColor }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors ${
                  isActive
                    ? `bg-gradient-to-r ${activeColor} text-white`
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={
                      isActive ? "text-white font-medium" : "text-gray-700"
                    }
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-white/30 p-4 px-7 flex items-center justify-between">
        <div
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer"
        >
          <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
          <div>
            <h1 className="font-medium text-sm">{user.fullName}</h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </p>
          </div>
          <LogOut
            onClick={signOut}
            className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
