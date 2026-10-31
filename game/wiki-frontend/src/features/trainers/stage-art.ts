const illustrations: Record<string, string> = {
  'stage-01': '../assets/locations/cherrygrove-city.png',
  'stage-02': '../assets/locations/route-30.png',
  'stage-03': '../assets/locations/route-31.png',
  'stage-07': '../assets/locations/route-32.png',
};

export function stageIllustration(stage: string): string | undefined {
  return illustrations[stage];
}
