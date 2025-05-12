import Navbar from "@/components/custom/navbar";
import Sidebar from "@/components/custom/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {/* header */}
      <header className="h-20 md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </header>
      {/* sidebar */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="pt-20 md:pl-56 h-full">{children}</main>{" "}
    </div>
  );
};

export default DashboardLayout;
