import { RefObject } from 'react';

type Handler = (event: MouseEvent) => void;
type EventType = 'mousedown' | 'mouseup';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: EventType = 'mousedown',
): void {
  window.addEventListener(mouseEvent, event => {
    const el = ref?.current;

    if (!el || el.contains(event.target as Node)) return;

    handler(event);
  });
}
