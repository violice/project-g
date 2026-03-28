# Audio Pitch Detector Library

Библиотека для определения высоты звука и нот с использованием Web Audio API и библиотеки pitchy.

## Установка

Библиотека уже включает pitchy как зависимость. Убедитесь, что пакет установлен:

```bash
npm install pitchy
```

## Быстрый старт

### Использование хука (рекомендуется)

```tsx
import { useAudioPitchDetector } from "#/shared/lib/audio-pitch";

function Tuner() {
  const { status, currentResult, isListening, isInTune, detuneAmount, start, stop } =
    useAudioPitchDetector({
      clarityThreshold: 0.92,
      onNoteDetected: result => console.log("Note:", result.note?.name),
      onNoteLost: () => console.log("Note lost"),
    });

  return (
    <div>
      <button onClick={isListening ? stop : start}>{isListening ? "Стоп" : "Начать"}</button>
      {currentResult?.note && (
        <div>
          <p>Нота: {currentResult.note.name}</p>
          <p>Частота: {currentResult.frequency} Hz</p>
          <p>Точность: {currentResult.note.cents} cents</p>
          <p>В строю: {isInTune ? "Да" : "Нет"}</p>
        </div>
      )}
    </div>
  );
}
```

### Использование класса напрямую

```tsx
import { AudioPitchDetector } from "#/shared/lib/audio-pitch";

const detector = new AudioPitchDetector({
  fftSize: 2048,
  clarityThreshold: 0.92,
  smoothingTimeConstant: 0.1,
});

await detector.start(result => {
  if (result) {
    console.log("Note:", result.note?.name);
    console.log("Frequency:", result.frequency);
    console.log("Clarity:", result.clarity);
    console.log("Cents:", result.note?.cents);
  }
});

// Для остановки
await detector.stop();
```

## API

### Типы

#### `NoteInfo`

```ts
interface NoteInfo {
  name: string; // Название ноты (например, "A4", "C#5")
  octave: number; // Октава (например, 4)
  frequency: number; // Точная частота ноты в Hz
  cents: number; // Отклонение в центах (-50 до +50)
}
```

#### `PitchDetectionResult`

```ts
interface PitchDetectionResult {
  frequency: number; // Определенная частота в Hz
  clarity: number; // Уверенность определения (0-1)
  note: NoteInfo | null; // Информация о ноте
}
```

#### `AudioPitchDetectorConfig`

```ts
interface AudioPitchDetectorConfig {
  fftSize?: number; // Размер FFT (по умолчанию: 2048)
  smoothingTimeConstant?: number; // Сглаживание (по умолчанию: 0.1)
  clarityThreshold?: number; // Порог уверенности (по умолчанию: 0.92)
  noteNames?: string[]; // Названия нот (по умолчанию: C, C#, D...)
}
```

### Класс `AudioPitchDetector`

#### Конструктор

```ts
new AudioPitchDetector(config?: AudioPitchDetectorConfig)
```

#### Методы

- **`start(onAnalysis: (result: PitchDetectionResult | null) => void): Promise<void>`**
  - Запускает захват аудио и начинает анализ
  - Коллбэк вызывается на каждом кадре с результатом или null

- **`stop(): Promise<void>`**
  - Останавливает захват и освобождает ресурсы

- **`isActive: boolean`** (только чтение)
  - Возвращает true если детектор запущен

### Хук `useAudioPitchDetector`

```ts
const {
  status, // 'inactive' | 'requesting' | 'listening' | 'error'
  currentResult, // Текущий результат или null
  error, // Сообщение об ошибке или null
  isListening, // true если идет прослушивание
  isInTune, // true если нота в строю (±5 центов)
  detuneAmount, // Отклонение в центах (0-50)
  start, // Функция запуска
  stop, // Функция остановки
} = useAudioPitchDetector(options);
```

#### Опции хука

```ts
interface UseAudioPitchDetectorOptions extends AudioPitchDetectorConfig {
  onNoteDetected?: (result: PitchDetectionResult) => void;
  onNoteLost?: () => void;
}
```

### Утилиты

#### `frequencyToNote(frequency: number, noteNames?: string[]): NoteInfo`

Конвертирует частоту в информацию о ноте.

```ts
const note = frequencyToNote(440); // { name: 'A4', octave: 4, frequency: 440, cents: 0 }
```

#### `isInTune(cents: number, threshold?: number): boolean`

Проверяет, находится ли нота в строю.

```ts
isInTune(3); // true (в пределах ±5 центов)
isInTune(-10); // false
```

#### `getDetuneDirection(cents: number): 'sharp' | 'flat' | 'in-tune'`

Возвращает направление отклонения.

```ts
getDetuneDirection(10); // 'sharp'
getDetuneDirection(-8); // 'flat'
getDetuneDirection(0); // 'in-tune'
```

## Настройка аудио

Для оптимальной работы рекомендуется отключить автоматические функции обработки звука браузером:

```ts
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
  },
});
```

## Примеры нот и частот

| Нота | Частота (Hz) |
| ---- | ------------ |
| A4   | 440.00       |
| A#4  | 466.16       |
| B4   | 493.88       |
| C5   | 523.25       |
| E5   | 659.25       |
| A5   | 880.00       |
