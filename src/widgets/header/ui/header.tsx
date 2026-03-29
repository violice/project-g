import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Music, Menu, X } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">CrazyTunes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/learn"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Обучение
          </Link>
          <Link
            to="/tuner"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Тюнер
          </Link>
          <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Хаб песен
          </button>
          <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
            О команде
          </button>
        </nav>

        <div className="hidden md:flex">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">А</span>
            </div>
            <span className="font-medium text-slate-700">Александр</span>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/learn"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Обучение
            </Link>
            <Link
              to="/tuner"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Тюнер
            </Link>
            <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-left py-2">
              Хаб песен
            </button>
            <button className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-left py-2">
              О команде
            </button>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors w-fit"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">А</span>
              </div>
              <span className="font-medium text-slate-700">Александр</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
