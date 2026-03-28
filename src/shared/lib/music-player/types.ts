export enum NoteFunctionType {
  BAND_UP = 'BAND_UP',
  BAND_DOWN = 'BAND_DOWN',
  BAND_UP_12 = 'BAND_UP_12',
  BAND_DOWN_12 = 'BAND_DOWN_12',
  VIBRATO = 'VIBRATO',
  SLIDE = 'SLIDE',
  HAMMER = 'HAMMER',
  DEFAULT = 'DEFAULT'
}

export enum MusicActionType {
  PLAY = 'PLAY',
  CONTINUE = 'CONTINUE',
  STOP = 'STOP',
  SUSPEND = 'SUSPEND'
}

export enum Instrument {
  GUITAR = 'GUITAR'
}

export enum NoteDuration {
  SIXTY_FOUR = 1,
  THIRTY_TWO = 2,
  SIXTEENTH = 4,
  EIGHTH = 8,
  HALF = 16,
  SEMIBREVE = 32
}
