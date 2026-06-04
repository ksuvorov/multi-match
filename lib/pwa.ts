export function isStandalone() {
    return typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
}