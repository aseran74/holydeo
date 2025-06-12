"use client";
import SidebarLogo from "./SidebarLogo";
// import HeaderLogo from "./HeaderLogo"; // Eliminado del header
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({ children, user, navItems = [] }: { children: React.ReactNode, user?: any, navItems?: { label: string, href: string }[] }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  // Renderiza el sidebar (drawer en móvil, fijo en desktop)
  const Sidebar = (
    <aside className="w-64 bg-white border-r flex flex-col h-full">
      <SidebarLogo />
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 font-medium"
            onClick={() => setOpenSidebar(false)} // Cierra el sidebar en móvil
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar fijo en desktop */}
      <div className="hidden md:block h-full">{Sidebar}</div>
      {/* Sidebar drawer en móvil */}
      {openSidebar && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setOpenSidebar(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white border-r z-50 shadow-lg animate-slideIn">
            {Sidebar}
          </div>
        </>
      )}
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b bg-white justify-between">
          {/* Botón hamburguesa solo en móvil */}
          <button
            className="md:hidden mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpenSidebar(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-4 ml-auto">
            {user && <span className="font-semibold text-gray-700">{user.display_name || user.email}</span>}
            <button className="bg-blue-600 text-white px-4 py-1 rounded">Logout</button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
} 