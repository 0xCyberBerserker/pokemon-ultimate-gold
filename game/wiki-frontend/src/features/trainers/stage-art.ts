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
  'stage-37': '../assets/locations/route-42.png',
  'stage-39': '../assets/locations/route-43.png',
  'stage-44': '../assets/locations/route-44.png',
  'stage-45': '../assets/locations/route-45.png',
  'stage-16': '../assets/locations/route-46.png',
  'stage-33': '../assets/locations/route-47.png',
  'stage-48': '../assets/locations/route-27.png',
  'stage-49': '../assets/locations/route-26.png',
};

export function stageIllustration(stage: string): string | undefined {
  return illustrations[stage];
}
