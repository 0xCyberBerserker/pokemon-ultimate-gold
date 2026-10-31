import type { Language } from './types';

export type DisplayedMoveValue = { value: string; note?: string };

export function displayMovePower(power: number, language: Language): DisplayedMoveValue {
  if (power === 0) return { value: '—' };
  if (power === 1) return {
    value: language === 'es' ? 'Regla propia' : 'Move-specific',
    note: language === 'es'
      ? 'El daño sigue una regla propia del movimiento; el valor registrado no equivale a una potencia base comparable.'
      : 'Damage follows a move-specific rule; the recorded value is not a comparable base power.',
  };
  return { value: String(power) };
}

export function displayMoveAccuracy(accuracy: number, language: Language): DisplayedMoveValue {
  if (accuracy === 0) return {
    value: '—',
    note: language === 'es'
      ? 'El dato no contiene una precisión numérica; su interpretación depende del movimiento y no está verificada aquí.'
      : 'The data has no numeric accuracy; its meaning depends on the move and is not verified here.',
  };
  return { value: String(accuracy) };
}
