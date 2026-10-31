const illustrations: Record<string, string> = {
  'stage-02': '../assets/locations/route-30.png',
  'stage-03': '../assets/locations/route-31.png',
};

export function stageIllustration(stage: string): string | undefined {
  return illustrations[stage];
}
