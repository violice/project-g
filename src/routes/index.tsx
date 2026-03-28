import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Music,
  Mic2,
  Trophy,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-500 mb-4">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="text-lg font-bold text-slate-800 leading-tight">{value}</div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 mb-4 group-hover:bg-blue-600 transition-colors">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  features,
  recommended = false,
}: {
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        recommended
          ? "bg-blue-500 text-white border-2 border-blue-500"
          : "bg-white border border-slate-200 hover:border-blue-300"
      }`}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
            Рекомендуем
          </span>
        </div>
      )}
      <h3 className={`text-lg font-bold mb-2 ${recommended ? "text-white" : "text-slate-800"}`}>
        {title}
      </h3>
      <div
        className={`text-2xl font-extrabold mb-4 ${recommended ? "text-white" : "text-blue-500"}`}
      >
        {price}
      </div>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 text-sm ${recommended ? "text-blue-50" : "text-slate-600"}`}
          >
            <Sparkles
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${recommended ? "text-blue-200" : "text-blue-500"}`}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700">
                Интерактивный тренажер гитары
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              CrazyTunes
            </h1>

            <p className="text-xl text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
              Интерактивный тренажер гитары с распознаванием нот и ритма в реальном времени
            </p>

            <p className="text-lg text-blue-600 font-medium mb-10">
              Инструмент, а не курс: открыл и сразу играешь
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/learn"
                className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Начать обучение
              </Link>
              <Link
                to="/tuner"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <Mic2 className="w-5 h-5" />
                Настроить гитару
              </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <MetricCard label="MVP" value="4-6 месяцев" icon={Clock} />
              <MetricCard label="Core" value="Ноты + тайминг" icon={Music} />
              <MetricCard label="ЦА" value="Новички 12-35" icon={Target} />
              <MetricCard label="Рынок" value="150-200 млн гитаристов" icon={TrendingUp} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Основные функции</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                title="Анализ игры"
                description="Распознавание нот, тайминг (рано/вовремя/поздно), точность звучания в реальном времени"
                icon={Mic2}
              />
              <FeatureCard
                title="Работа с мелодией"
                description="Сравнение оригинала с вашим исполнением, таймлайн прогресса, выбор темпа и сложности"
                icon={Music}
              />
              <FeatureCard
                title="Геймификация"
                description="Звезды и рейтинг, игровые режимы (классика/выживание/дневные челленджи), достижения"
                icon={Trophy}
              />
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Аудитория и ценность</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">
                      Кто наши пользователи
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Новички (до 60% аудитории)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Казуальные гитаристы</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Геймеры и любители челленджей</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>Преподаватели для учеников</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Почему это зайдет</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Ощущение игры, а не скучных уроков</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Мгновенный фидбек по каждой ноте</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>Быстрые маленькие победы и прогресс</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Монетизация</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mb-4" />
              <p className="text-slate-600">Гибкая модель для разных сегментов пользователей</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <PricingCard
                title="Freemium"
                price="$5-10/мес"
                features={[
                  "Базовая библиотека бесплатно",
                  "Расширенные мелодии",
                  "Загрузка своих треков",
                  "PDF табулатуры",
                  "Или $40-60/год (-17%)",
                ]}
              />
              <PricingCard
                title="Premium+"
                price="$15-20/мес"
                features={[
                  "Все функции Freemium",
                  "AI-ментор персональный план",
                  "Детальный анализ ошибок",
                  "Отслеживание прогресса",
                  "Или $80-120/год (-33%)",
                ]}
                recommended
              />
              <PricingCard
                title="B2B / Pro"
                price="$5/ученик"
                features={[
                  "Лицензии для школ",
                  "Челленджи и турниры",
                  "Маркетплейс для преподавателей",
                  "$1-3 вход, 30% комиссия",
                  "Аналитика для учителей",
                ]}
              />
            </div>
          </div>
        </section>

        {/* MVP Economics Section */}
        <section className="px-4 py-16 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">MVP: экономика и прогноз</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">Команда</div>
                      <div className="text-slate-600 text-sm">
                        3 dev (2 BE, 1 FE), дизайнер, тестировщик, аналитик
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">Срок разработки</div>
                      <div className="text-slate-600 text-sm">4-6 месяцев до запуска MVP</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="font-semibold text-slate-800 mb-2">Сценарии выручки / мес</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Пессимистичный:</span>
                        <span className="font-semibold text-rose-600">$500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Реалистичный:</span>
                        <span className="font-semibold text-blue-600">$3,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Успешный:</span>
                        <span className="font-semibold text-emerald-600">$15,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-500" />
                  Ключевые риски
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-rose-50 rounded-lg p-3 text-sm text-rose-800">
                    Переоценка спроса
                  </div>
                  <div className="bg-rose-50 rounded-lg p-3 text-sm text-rose-800">
                    Сложность аудио-части
                  </div>
                  <div className="bg-rose-50 rounded-lg p-3 text-sm text-rose-800">
                    Удержание мотивации
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Начните прямо сейчас</h2>
              <p className="text-slate-600">Два инструмента для мгновенного старта</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/tuner" className="group block">
                <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:shadow-xl cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <Mic2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-800">Тюнер</h2>
                    <p className="text-slate-600 mb-4">
                      Настройте гитару с помощью микрофона. Точное распознавание частот в реальном
                      времени.
                    </p>
                    <div className="flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                      Открыть{" "}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/learn" className="group block">
                <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:shadow-xl cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-800">Обучение</h2>
                    <p className="text-slate-600 mb-4">
                      Играйте мелодии с визуализацией нот. Отслеживайте прогресс и получайте фидбек.
                    </p>
                    <div className="flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                      Начать{" "}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-slate-200">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800">CrazyTunes</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <span>Web-first UX</span>
              <span>•</span>
              <span>Fast Feedback Loop</span>
              <span>•</span>
              <span>Interactive Learning</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
