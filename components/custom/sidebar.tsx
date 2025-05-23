import Link from "next/link";
import Logo from "./Logo";

import { SidebarRoutes } from "./sidebar-routes";

export default function Sidebar() {
  return (
    <div className="h-full border-r flex flex-col  overflow-y-auto bg-white ">
      <div className="p-6 ">
        <Link href={"/"}>
          <Logo />
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
}
