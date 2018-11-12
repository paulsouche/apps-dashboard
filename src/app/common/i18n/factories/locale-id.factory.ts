export function localeIdFactory(navigator: Navigator) {
  return navigator.language || 'en';
}
