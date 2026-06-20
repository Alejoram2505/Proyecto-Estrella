import { useEffect } from 'react';

const FALLBACK_TITLE = 'Una estrella para ti';
const FALLBACK_TEXT = 'Este mensaje todavía está esperando ser escrito.';

export default function MessageModal({ open, title, text, isFinal, onClose }) {
  const safeTitle = typeof title === 'string' && title.trim() ? title : FALLBACK_TITLE;
  const safeText = typeof text === 'string' && text.trim() ? text : FALLBACK_TEXT;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`modal-backdrop${open ? ' modal-backdrop--open' : ''}`}
      role="presentation"
      aria-hidden={!open}
      onClick={onClose}
    >
      <section
        className={`message-card${isFinal ? ' message-card--final' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-title"
        aria-describedby="message-text"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="message-title" id="message-title">
          {safeTitle}
        </h2>
        <p className="message-text" id="message-text">
          {safeText}
        </p>
        <button className="modal-close" type="button" aria-label="Cerrar mensaje" onClick={onClose}>
          Cerrar
        </button>
      </section>
    </div>
  );
}
