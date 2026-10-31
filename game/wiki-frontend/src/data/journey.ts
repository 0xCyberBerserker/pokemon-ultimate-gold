import type { Trainer, WikiData } from './types';

export function orderTrainers(trainers: Trainer[], stages: WikiData['trainer_journey']['stages']): Trainer[] {
  const positions = new Map(stages.map((stage, index) => [stage.id, index]));
  return [...trainers].sort((left, right) => {
    const leftStage = positions.get(left.journey?.stage_id || '') ?? stages.length;
    const rightStage = positions.get(right.journey?.stage_id || '') ?? stages.length;
    return leftStage - rightStage || (left.journey?.order ?? Infinity) - (right.journey?.order ?? Infinity);
  });
}
