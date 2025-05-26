export const parseWorkMode = (requirement: string): string[] => {
  return requirement.toLowerCase()
    .split(/[\/,\s]+/)
    .filter(mode => mode)
    .map(mode => {
      if (mode === 'wfh' || mode.includes('home')) return 'remote';
      if (mode === 'onsite' || mode.includes('office')) return 'onsite';
      return mode;
    });
};
