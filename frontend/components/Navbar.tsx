import { Link, useLocation } from "react-router-dom";
import { Coins } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-purple-500/30 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
              منشئ عملات MEME
            </span>
          </Link>

          <div className="flex gap-6">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-purple-400"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/create"
              className={`transition-colors ${
                isActive("/create")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-purple-400"
              }`}
            >
              إنشاء عملة
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors ${
                isActive("/dashboard")
                  ? "text-purple-400 font-semibold"
                  : "text-slate-300 hover:text-purple-400"
              }`}
            >
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
