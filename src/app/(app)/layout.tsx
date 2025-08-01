import Sidebar from "@/components/layout/SideBar";
import TopRibbon from "@/components/layout/TopRibbon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <TopRibbon />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
