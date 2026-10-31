const illustrations: Record<string, string> = {
  'stage-01': '../assets/locations/cherrygrove-city.png',
  'stage-02': '../assets/locations/route-30.png',
  'stage-03': '../assets/locations/route-31.png',
  'stage-07': '../assets/locations/route-32.png',
  'stage-09': '../assets/locations/route-33.png',
  'stage-13': '../assets/locations/route-34.png',
  'stage-17': '../assets/locations/route-35.png',
  'stage-19': '../assets/locations/route-36.png',
  'stage-20': '../assets/locations/route-37.png',
  'stage-24': '../assets/locations/route-38.png',
  'stage-25': '../assets/locations/route-39.png',
  'stage-28': '../assets/locations/route-40.png',
  'stage-29': '../assets/locations/route-41.png',
};

export function stageIllustration(stage: string): string | undefined {
  return illustrations[stage];
}
