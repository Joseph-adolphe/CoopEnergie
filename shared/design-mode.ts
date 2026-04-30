export type GetStyleInfo = (resolved: { element: any }) => { className: string; styles: any };

export function initDesignMode(getStyleInfo: GetStyleInfo) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'sandbox:web:design-mode:inspect') {
      const el = document.elementFromPoint(event.data.x, event.data.y);
      if (el) {
        const info = getStyleInfo({ element: el });
        window.parent.postMessage({
          type: 'sandbox:web:design-mode:info',
          ...info
        }, '*');
      }
    }
  };

  window.addEventListener('message', handleMessage);
  return () => {
    // reselect logic could go here if needed
  };
}
