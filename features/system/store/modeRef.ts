// features/system/store/modeRef.ts

export const modeRef = {
  current: {
    silent: false,
    batterySaver: false,
    driving: true,
  },
};

export function updateMode(next: any) {
  modeRef.current = { ...modeRef.current, ...next };
}
