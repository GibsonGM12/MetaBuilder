import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navigation = [
  { name: "Inicio", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Entidades", href: "/entities", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", adminOnly: true },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const filteredNav = navigation.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">MetaBuilder</h1>
          </div>
          <nav className="mt-6 px-3">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 mb-1 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </aside>
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
