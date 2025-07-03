import Sidebar from "@/components/layout/SideBar";
import TopRibbon from "@/components/layout/TopRibbon";
import Navbar from "@/components/shared/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TopRibbon />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body> 
    </html>
  );
}
