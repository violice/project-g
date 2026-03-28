import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-4 pb-8 pt-14">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-800">Guitar Synth</h1>
        <p className="text-center mb-12 text-slate-500">
          Синтезатор гитарных звуков на основе алгоритма Karplus-Strong
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/tuner" className="block">
            <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl transition-all hover:scale-[1.02] hover:border-blue-400 cursor-pointer shadow-sm">
              <div className="text-4xl mb-4">🎸</div>
              <h2 className="text-xl font-bold mb-2 text-slate-800">Тюнер</h2>
              <p className="text-sm text-slate-500">Настройте гитару с помощью микрофона</p>
            </div>
          </Link>

          <Link to="/learn" className="block">
            <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl transition-all hover:scale-[1.02] hover:border-blue-400 cursor-pointer shadow-sm">
              <div className="text-4xl mb-4">🎵</div>
              <h2 className="text-xl font-bold mb-2 text-slate-800">Обучение</h2>
              <p className="text-sm text-slate-500">Играйте мелодии с визуализацией нот</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
