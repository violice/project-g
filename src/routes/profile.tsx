import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Music,
  Sparkles,
  Trophy,
  Clock,
  Target,
  Flame,
  Star,
  Settings,
  Edit3,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <div className="text-xl font-bold text-slate-800 text-center">{value}</div>
    </div>
  );
}

function AchievementCard({
  title,
  description,
  icon: Icon,
  unlocked = false,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 border-2 transition-all duration-300 ${
        unlocked
          ? "bg-white border-blue-500 shadow-lg shadow-blue-500/10"
          : "bg-slate-50 border-slate-200 opacity-60"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            unlocked ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-400"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">На главную</span>
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">Личный кабинет</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Профиль
              </h1>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Отслеживайте свой прогресс, достижения и статистику обучения
              </p>
            </div>
          </div>

          {/* Profile Info Card */}
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">А</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Александр</h2>
                  <p className="text-slate-500 mb-3">Гитарист-новичок</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Flame className="w-4 h-4" />7 дней подряд
                    </span>
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4" />
                      1,250 XP
                    </span>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
                  <Settings className="w-5 h-5" />
                  Настройки
                </button>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Статистика</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Песен сыграно" value="12" icon={Music} />
              <StatCard label="Часов практики" value="24.5" icon={Clock} />
              <StatCard label="Точность нот" value="78%" icon={Target} />
              <StatCard label="Достижений" value="5/20" icon={Trophy} />
            </div>
          </section>

          {/* Achievements */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Достижения</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <AchievementCard
                title="Первые шаги"
                description="Сыграйте свою первую песню"
                icon={Music}
                unlocked
              />
              <AchievementCard
                title="Неделя практики"
                description="Занимайтесь 7 дней подряд"
                icon={Flame}
                unlocked
              />
              <AchievementCard
                title="Мастер точности"
                description="Достигните 95% точности нот"
                icon={Target}
              />
              <AchievementCard
                title="Коллекционер"
                description="Сыграйте 50 разных песен"
                icon={Trophy}
              />
              <AchievementCard
                title="Марафонец"
                description="Практикуйтесь 30 дней подряд"
                icon={Clock}
              />
              <AchievementCard title="Звезда" description="Наберите 5000 XP" icon={Star} />
            </div>
          </section>

          {/* Recent Activity */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Недавняя активность</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Music className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Smoke on the Water</p>
                    <p className="text-sm text-slate-500">Точность: 82% • Время: 3:24</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">Сегодня</span>
              </div>

              <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Music className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Seven Nation Army</p>
                    <p className="text-sm text-slate-500">Точность: 91% • Время: 2:45</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">Вчера</span>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Music className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Come as You Are</p>
                    <p className="text-sm text-slate-500">Точность: 76% • Время: 3:12</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">2 дня назад</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Быстрые действия</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/learn"
                className="group bg-white border-2 border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Продолжить обучение</h4>
                    <p className="text-sm text-slate-500">Выберите новую песню для практики</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/tuner"
                className="group bg-white border-2 border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Настроить гитару</h4>
                    <p className="text-sm text-slate-500">Проверьте настройку инструмента</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-slate-200">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800">CrazyTunes</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-slate-500 text-center">
              <span>Интерактивное обучение</span>
              <span className="hidden sm:inline">•</span>
              <span>Распознавание нот</span>
              <span className="hidden sm:inline">•</span>
              <span>Мгновенный фидбек</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
