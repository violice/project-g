# Music Player Library

Библиотека для воспроизведения музыкальных композиций с использованием Web Audio API и синтеза звука по алгоритму Karplus-Strong.

## Установка

```typescript
import { MusicPlayer, MusicActionType, Composition } from './lib/music-player';
```

## Быстрый старт

```typescript
import { MusicPlayer, MusicActionType, Composition } from './lib/music-player';

const player = new MusicPlayer();
player.loadComposition(myComposition);
player.handleAction(MusicActionType.PLAY);
```

## Структура данных

### Composition
Основная структура песни.

```typescript
interface Composition {
  id?: number;
  staves: StaveInfo[];    // Партии инструментов
  name: string;           // Название
  complexity: number;     // Сложность (1-10)
  description: string;    // Описание
  bpm: number;            // Темп (ударов в минуту)
  videoLink: string;      // Ссылка на видео
}
```

### StaveInfo
Партия одного инструмента.

```typescript
interface StaveInfo {
  instrument: Instrument;
  tacts: TactInfo[];       // Такты
  sliderContext?: SliderContext;
}
```

### TactInfo
Информация о такте.

```typescript
interface TactInfo {
  sizeStr: string;        // Размер (напр. "4/4")
  notes: NoteDto[][];     // Ноты [номер_ноты][номер_струны]
  serialNumber: number;   // Порядковый номер
  topLeftCorner?: number;
  width?: number;
  height?: number;
}
```

### NoteDto
Нота.

```typescript
interface NoteDto {
  value: string;          // Номер лада (напр. "0" - открытая, "5" - 5-й лад)
  duration: number;       // Длительность (1-32)
  functionType: NoteFunctionType;
}
```

## Enums

### MusicActionType
```typescript
enum MusicActionType {
  PLAY = 'PLAY',      // Начать воспроизведение
  CONTINUE = 'CONTINUE', // Продолжить после паузы
  STOP = 'STOP',      // Остановить
  SUSPEND = 'SUSPEND' // Приостановить (пауза)
}
```

### Instrument
```typescript
enum Instrument {
  GUITAR = 'GUITAR'
}
```

### NoteFunctionType
```typescript
enum NoteFunctionType {
  BAND_UP = 'BAND_UP',
  BAND_DOWN = 'BAND_DOWN',
  BAND_UP_12 = 'BAND_UP_12',
  BAND_DOWN_12 = 'BAND_DOWN_12',
  VIBRATO = 'VIBRATO',
  SLIDE = 'SLIDE',
  HAMMER = 'HAMMER',
  DEFAULT = 'DEFAULT'
}
```

### NoteDuration
```typescript
enum NoteDuration {
  SIXTY_FOUR = 1,
  THIRTY_TWO = 2,
  SIXTEENTH = 4,
  EIGHTH = 8,
  HALF = 16,
  SEMIBREVE = 32
}
```

## Классы

### MusicPlayer

Основной класс для управления воспроизведением.

#### Конструктор
```typescript
const player = new MusicPlayer();
```

#### Методы

**loadComposition(composition: Composition)**
Загружает композицию для воспроизведения.
```typescript
player.loadComposition({
  name: 'My Song',
  bpm: 120,
  complexity: 5,
  description: 'A cool song',
  videoLink: '',
  staves: [...]
});
```

**handleAction(action: MusicActionType)**
Обрабатывает действие (play, pause, stop, continue).
```typescript
player.handleAction(MusicActionType.PLAY);
player.handleAction(MusicActionType.SUSPEND);  // Пауза
player.handleAction(MusicActionType.CONTINUE); // Продолжить
player.handleAction(MusicActionType.STOP);     // Стоп
```

**setEvents(events: MusicPlayerEvents)**
Устанавливает колбэки для событий.
```typescript
player.setEvents({
  onPlay: () => console.log('Playing'),
  onPause: () => console.log('Paused'),
  onStop: () => console.log('Stopped'),
  onNote: (frequencies, tact, note) => console.log(frequencies),
  onTick: (position) => console.log(position),
  onEnd: () => console.log('Song ended')
});
```

**getPlaybackState(): PlaybackState**
Возвращает текущее состояние воспроизведения.
```typescript
player.getPlaybackState(); // 'stopped' | 'playing' | 'paused'
```

**isPlaying(): boolean**
Проверяет, идёт ли воспроизведение.

**isPaused(): boolean**
Проверяет, на паузе ли воспроизведение.

**getCurrentPosition(): { stave: number; left: number; top: number }[]**
Возвращает текущие позиции курсора для каждой партии.

**destroy()**
Очищает все ресурсы и останавливает воспроизведение.
```typescript
player.destroy();
```

### FrequencyService

Расчёт частот для нот гитары.

#### Конструктор
```typescript
const freqService = new FrequencyService();
```

#### Методы

**calculateFrequency(stringIndex: number, fret: number): number**
Рассчитывает частоту для струны и лада.
```typescript
// 1-я струна (E), 5-й лад
freqService.calculateFrequency(0, 5); // ~784 Hz
```

**setTuning(tuning: Tuning[])**
Устанавливает альтернативный строй.
```typescript
freqService.setTuning([
  { note: 'E', frequency: 330 },
  { note: 'B', frequency: 247 },
  { note: 'G', frequency: 196 },
  { note: 'D', frequency: 147 },
  { note: 'A', frequency: 110 },
  { note: 'E', frequency: 82 },
]);
```

**getTuning(): Tuning[]**
Возвращает текущий строй.

### SoundService

Синтезатор звука гитары по алгоритму Karplus-Strong.

#### Методы

**karplusStrong(rate: number): number[]**
Генерирует аудиосемплы для заданной частоты.
```typescript
const samples = soundService.karplusStrong(440);
```

### PlaySoundService

Воспроизведение звуков через Web Audio API.

#### Конструктор
```typescript
const playService = new PlaySoundService();
```

#### Методы

**playSound(rates: number[])**
Воспроизводит массив частот одновременно.
```typescript
playService.playSound([330, 247, 196]); // Аккорд
```

**clear()**
Останавливает текущее воспроизведение.

### MusicPositionService

Расчёт таймингов для анимации воспроизведения.

#### Конструктор
```typescript
const posService = new MusicPositionService();
```

#### Методы

**calculateTime(tacts: TactInfo[], bpm: number): SliderMovementInfo[]**
Рассчитывает массив интервалов движения для каждой ноты.
```typescript
const movements = posService.calculateTime(tacts, 120);
```

## Константы

```typescript
VERTICAL_TACT_MARGIN = 120;      // Вертикальный отступ между тактами
NOTE_LENGTH = 32;                // Длина ноты
START_TACT_LENGTH = 100;         // Начальная длина такта
TACTS_WIDTH = 880;              // Ширина такта
SLIDER_NORMALIZATION = 5;       // Нормализация слайдера
START_LEFT_OFFSET = 0;          // Начальное смещение слева
START_TOP_OFFSET = 133;         // Начальное смещение сверху
```

## Пример полного использования

```typescript
import { 
  MusicPlayer, 
  MusicActionType, 
  Composition,
  Instrument,
  NoteFunctionType,
  NoteDuration
} from './lib/music-player';

// Создаём тестовую композицию
const composition: Composition = {
  name: 'Test Song',
  bpm: 120,
  complexity: 5,
  description: 'A test composition',
  videoLink: '',
  staves: [
    {
      instrument: Instrument.GUITAR,
      tacts: [
        {
          sizeStr: '4/4',
          serialNumber: 0,
          notes: [
            // Нота на 1-й струне, 0-й лад (E), длительность целая
            [{ value: '0', duration: NoteDuration.SEMIBREVE, functionType: NoteFunctionType.DEFAULT }]
          ]
        }
      ]
    }
  ]
};

// Создаём плеер
const player = new MusicPlayer();

// Подписываемся на события
player.setEvents({
  onPlay: () => console.log('Started'),
  onPause: () => console.log('Paused'),
  onStop: () => console.log('Stopped'),
  onNote: (freqs, tact, note) => {
    console.log(`Note at tact ${tact}, beat ${note}: ${freqs}Hz`);
  },
  onEnd: () => console.log('Finished!')
});

// Загружаем и играем
player.loadComposition(composition);
player.handleAction(MusicActionType.PLAY);

// Через 5 секунд - пауза
setTimeout(() => {
  player.handleAction(MusicActionType.SUSPEND);
}, 5000);

// Через 7 секунд - продолжить
setTimeout(() => {
  player.handleAction(MusicActionType.CONTINUE);
}, 7000);

// Через 12 секунд - стоп
setTimeout(() => {
  player.handleAction(MusicActionType.STOP);
  player.destroy();
}, 12000);
```
