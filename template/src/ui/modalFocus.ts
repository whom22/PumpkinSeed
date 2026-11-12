export function activateModalFocus(dialog: HTMLElement, onClose: () => void): () => void {
  let restoreFocusTo: HTMLElement | null = null;

  const getTabbables = (container: HTMLElement): HTMLElement[] => {
    const candidates = container.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );
    const tabbables: HTMLElement[] = [];
    for (const el of candidates) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') continue;
      if (el.closest('[inert]') || el.matches(':disabled') || el.tabIndex < 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const tabIndex = el.getAttribute('tabindex');
      if (tabIndex !== null && parseInt(tabIndex, 10) < 0) continue;
      tabbables.push(el);
    }
    return tabbables;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      const tabbables = getTabbables(dialog);
      if (tabbables.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = tabbables[0];
      const last = tabbables[tabbables.length - 1];
      const isShift = event.shiftKey;
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (isShift ? last : first).focus();
      } else if (isShift && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!isShift && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault();
        first.focus();
      }
    } else if (event.key === 'Escape' && !event.repeat) {
      event.preventDefault();
      onClose();
    }
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!dialog.contains(event.target as Node)) {
      const tabbables = getTabbables(dialog);
      (tabbables[0] || dialog).focus();
    }
  };

  const activate = () => {
    if (document.activeElement instanceof HTMLElement) {
      restoreFocusTo = document.activeElement;
    }
    const tabbables = getTabbables(dialog);
    if (tabbables.length > 0) {
      tabbables[0].focus();
    } else {
      dialog.focus();
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('focusin', handleFocusIn);
  };

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('focusin', handleFocusIn);
    if (restoreFocusTo && restoreFocusTo.ownerDocument.body.contains(restoreFocusTo)) {
      restoreFocusTo.focus();
    }
  };

  if (dialog.isConnected) {
    activate();
  }

  return cleanup;
}

