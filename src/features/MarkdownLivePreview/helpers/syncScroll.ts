export function scrollRatio(el: HTMLElement) {
  const max = el.scrollHeight - el.clientHeight;
  return max <= 0 ? 0 : el.scrollTop / max;
}

export function setScrollRatio(el: HTMLElement, ratio: number) {
  const max = el.scrollHeight - el.clientHeight;
  el.scrollTop = max <= 0 ? 0 : ratio * max;
}

export function createScrollSync() {
  let syncing = false;

  return function syncFrom(source: HTMLElement, target: HTMLElement | null) {
    if (!target || syncing) return;
    syncing = true;
    setScrollRatio(target, scrollRatio(source));
    requestAnimationFrame(() => {
      syncing = false;
    });
  };
}
