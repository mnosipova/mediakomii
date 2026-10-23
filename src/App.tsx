import { useState, useCallback, useEffect } from "react";
import { apartments, getRandomApartments, formatPrice, formatPriceFull, type Apartment } from "./data/apartments";
import { ApartmentImage } from "./components/ApartmentImage";

type GamePhase = "start" | "playing" | "revealed" | "result";

interface RoundResult {
  apartment: Apartment;
  userGuess: number;
  correctPrice: number;
  points: number;
  diff: number;
}

function calculatePoints(guess: number, correct: number): number {
  const ratio = Math.abs(guess - correct) / correct;
  if (ratio <= 0.02) return 100;
  if (ratio <= 0.05) return 90;
  if (ratio <= 0.1) return 75;
  if (ratio <= 0.15) return 60;
  if (ratio <= 0.2) return 45;
  if (ratio <= 0.3) return 25;
  if (ratio <= 0.5) return 10;
  return 5;
}

function getSliderRange(apartment: Apartment): { min: number; max: number; step: number } {
  const basePrice = apartment.price;
  const min = Math.max(500000, Math.floor((basePrice * 0.3) / 100000) * 100000);
  const max = Math.ceil((basePrice * 2.2) / 100000) * 100000;
  return { min, max, step: 100000 };
}

// ===== START SCREEN =====
function StartScreen({ onStart }: { onStart: () => void }) {
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0050cf]/5 to-white">
      {/* Header */}
      <div className="pt-8 pb-4 px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-[#0050cf] rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">МК</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Медиа<span className="text-[#0050cf]">Коми</span>
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
          Симулятор оценки недвижимости. Сможешь угадать цену квартиры в Республике Коми?
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="px-6 mb-6">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === galleryIndex ? 1 : 0 }}
            >
              <ApartmentImage index={i} rooms={i % 3 + 1} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {apartments.length} объявлений в базе
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === galleryIndex ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="px-6 mb-6 flex-1">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Как играть?</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-[#0050cf]/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#0050cf] text-sm font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">Вам показывают 10 квартир по очереди</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-[#0050cf]/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#00cf50]/10 text-[#0050cf] text-sm font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">Двигайте бегунок, чтобы назвать свою цену</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-[#0050cf]/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#0050cf] text-sm font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">Чем точнее угадали — тем больше баллов!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="px-6 pb-4">
        <button
          onClick={onStart}
          className="w-full py-4 bg-[#0050cf] hover:bg-[#0040a8] active:bg-[#003090] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#0050cf]/25 transition-all active:scale-[0.98]"
        >
          Начать игру
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          10 раундов • ~2 минуты
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">МедиаКоми © 2026</p>
      </div>
    </div>
  );
}

// ===== GAME SCREEN =====
function GameScreen({
  apartment,
  roundIndex,
  totalRounds,
  phase,
  onGuess,
  onNext,
  lastResult,
}: {
  apartment: Apartment;
  roundIndex: number;
  totalRounds: number;
  phase: "playing" | "revealed";
  onGuess: (price: number) => void;
  onNext: () => void;
  lastResult: RoundResult | null;
}) {
  const { min, max, step } = getSliderRange(apartment);
  const [sliderValue, setSliderValue] = useState(min);
  const [animated, setAnimated] = useState(false);


  // Animate slider on first load
  useEffect(() => {
    setSliderValue(min);
    setAnimated(false);
    const timer = setTimeout(() => {
      setSliderValue(Math.floor((min + max) / 2 / step) * step);
      setAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [apartment.id, min, max, step]);

  const progress = ((roundIndex) / totalRounds) * 100;

  const handleGuess = () => {
    onGuess(sliderValue);
  };

  const imgIndex = apartment.imageIndex;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Раунд {roundIndex + 1} из {totalRounds}
          </span>
          <span className="text-xs font-medium text-[#0050cf]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0050cf] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Apartment Card */}
      <div className="flex-1 flex flex-col px-5 pt-3 pb-4">
        {/* Image */}
        <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 shadow-sm">
          <ApartmentImage index={imgIndex} rooms={apartment.rooms} className="w-full h-full" />
        </div>

        {/* Info */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{apartment.title}</h2>
          <p className="text-sm text-gray-500 mb-2">{apartment.address}</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
              📐 {apartment.area} м²
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
              🏢 {apartment.floor}/{apartment.totalFloors} эт.
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
              🚪 {apartment.rooms} комн.
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2 italic">«{apartment.description}»</p>
        </div>

        {/* Slider / Result */}
        {phase === "playing" ? (
          <div className="flex-1 flex flex-col justify-end">
            <div className="mb-4">
              <div className="text-center mb-3">
                <span className="text-xs text-gray-400 uppercase tracking-wide">Ваша цена</span>
                <div className="text-3xl font-extrabold text-[#0050cf]">
                  {formatPriceFull(sliderValue)}
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className={`w-full h-3 rounded-full appearance-none cursor-pointer slider-custom ${
                    animated ? "slider-animated" : ""
                  }`}
                  style={{
                    background: `linear-gradient(to right, #0050cf 0%, #0050cf ${
                      ((sliderValue - min) / (max - min)) * 100
                    }%, #e5e7eb ${((sliderValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">{formatPrice(min)}</span>
                  <span className="text-xs text-gray-400">{formatPrice(max)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleGuess}
              className="w-full py-4 bg-[#0050cf] hover:bg-[#0040a8] active:bg-[#003090] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#0050cf]/25 transition-all active:scale-[0.98]"
            >
              Оценить
            </button>
          </div>
        ) : lastResult ? (
          <div className="flex-1 flex flex-col justify-end">
            {/* Result Card */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <span className="text-xs text-gray-400">Ваша цена</span>
                  <div className={`text-lg font-bold ${
                    lastResult.diff > 0 ? "text-red-500" : lastResult.diff < 0 ? "text-green-600" : "text-gray-900"
                  }`}>
                    {formatPriceFull(lastResult.userGuess)}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-400">Правильная цена</span>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPriceFull(lastResult.correctPrice)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div className="flex items-center gap-2">
                  {lastResult.diff > 0 ? (
                    <span className="text-lg">📈</span>
                  ) : lastResult.diff < 0 ? (
                    <span className="text-lg">📉</span>
                  ) : (
                    <span className="text-lg">🎯</span>
                  )}
                  <span className="text-sm text-gray-600">
                    {lastResult.diff > 0
                      ? `Больше на ${formatPriceFull(Math.abs(lastResult.diff))}`
                      : lastResult.diff < 0
                      ? `Меньше на ${formatPriceFull(Math.abs(lastResult.diff))}`
                      : "Точно в цель!"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#0050cf]">
                    +{lastResult.points}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">баллов</span>
                </div>
              </div>
            </div>
            <button
              onClick={onNext}
              className="w-full py-4 bg-[#0050cf] hover:bg-[#0040a8] active:bg-[#003090] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#0050cf]/25 transition-all active:scale-[0.98]"
            >
              {roundIndex < totalRounds - 1 ? "Следующая квартира →" : "Итоги →"}
            </button>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">МедиаКоми © 2026</p>
      </div>
    </div>
  );
}

// ===== RESULT SCREEN =====
function ResultScreen({
  results,
  onRestart,
}: {
  results: RoundResult[];
  onRestart: () => void;
}) {
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints = results.length * 100;
  const avgDiff = results.reduce((sum, r) => sum + r.diff, 0) / results.length;
  const totalOverpay = results.filter((r) => r.diff > 0).reduce((s, r) => s + r.diff, 0);
  const totalUnderpay = results.filter((r) => r.diff < 0).reduce((s, r) => s + Math.abs(r.diff), 0);

  let title: string;
  let subtitle: string;
  let emoji: string;
  let color: string;

  if (totalPoints >= 700) {
    title = "Опытный инвестор";
    subtitle = "Вы отлично чувствуете рынок недвижимости Коми!";
    emoji = "🏆";
    color = "text-green-600";
  } else if (avgDiff > 0) {
    title = "Щедрый инвестор";
    subtitle = "Вы склонны переплачивать за недвижимость";
    emoji = "💸";
    color = "text-orange-500";
  } else {
    title = "Скряга";
    subtitle = "Вы экономный инвестор, всегда торгуетесь!";
    emoji = "🤑";
    color = "text-blue-600";
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0050cf]/5 to-white">
      {/* Header */}
      <div className="pt-10 pb-6 px-6 text-center">
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className={`text-2xl font-extrabold mb-2 ${color}`}>{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Score */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl font-extrabold text-[#0050cf] mb-1">
            {totalPoints}
          </div>
          <div className="text-sm text-gray-400 mb-4">из {maxPoints} баллов</div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0050cf] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-red-500">
              {totalOverpay > 0 ? formatPrice(totalOverpay) : "—"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Переплата</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalUnderpay > 0 ? formatPrice(totalUnderpay) : "—"}
            </div>
            <div className="text-xs text-gray-400 mt-1">Недоплата</div>
          </div>
        </div>
      </div>

      {/* Round Details */}
      <div className="px-6 mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Детализация</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{r.apartment.title}</p>
                <p className="text-xs text-gray-400 truncate">{r.apartment.address}</p>
              </div>
              <div className="text-right ml-3 shrink-0">
                <span className={`text-sm font-bold ${r.points >= 75 ? "text-green-600" : r.points >= 45 ? "text-orange-500" : "text-red-500"}`}>
                  +{r.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart */}
      <div className="px-6 pb-8">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-[#0050cf] hover:bg-[#0040a8] active:bg-[#003090] text-white font-bold text-lg rounded-2xl shadow-lg shadow-[#0050cf]/25 transition-all active:scale-[0.98]"
        >
          Играть снова
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">МедиаКоми © 2026</p>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [phase, setPhase] = useState<GamePhase>("start");
  const [gameApartments, setGameApartments] = useState<Apartment[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  const startGame = useCallback(() => {
    const selected = getRandomApartments(10);
    setGameApartments(selected);
    setCurrentRound(0);
    setResults([]);
    setLastResult(null);
    setPhase("playing");
  }, []);

  const handleGuess = useCallback(
    (price: number) => {
      const apt = gameApartments[currentRound];
      const diff = price - apt.price;
      const points = calculatePoints(price, apt.price);
      const result: RoundResult = {
        apartment: apt,
        userGuess: price,
        correctPrice: apt.price,
        points,
        diff,
      };
      setLastResult(result);
      setResults((prev) => [...prev, result]);
      setPhase("revealed");
    },
    [gameApartments, currentRound]
  );

  const handleNext = useCallback(() => {
    if (currentRound >= gameApartments.length - 1) {
      setPhase("result");
    } else {
      setCurrentRound((prev) => prev + 1);
      setLastResult(null);
      setPhase("playing");
    }
  }, [currentRound, gameApartments.length]);

  const handleRestart = useCallback(() => {
    setPhase("start");
    setGameApartments([]);
    setCurrentRound(0);
    setResults([]);
    setLastResult(null);
  }, []);

  if (phase === "start") {
    return <StartScreen onStart={startGame} />;
  }

  if (phase === "result") {
    return <ResultScreen results={results} onRestart={handleRestart} />;
  }

  if (gameApartments.length > 0 && currentRound < gameApartments.length) {
    return (
      <GameScreen
        apartment={gameApartments[currentRound]}
        roundIndex={currentRound}
        totalRounds={gameApartments.length}
        phase={phase === "playing" ? "playing" : "revealed"}
        onGuess={handleGuess}
        onNext={handleNext}
        lastResult={lastResult}
      />
    );
  }

  return null;
}
