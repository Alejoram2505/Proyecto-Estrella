import { useEffect } from 'react';

export default function MessageModal({ open, message, isFinal, onClose }) {
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
        onClick={(event) => event.stopPropagation()}
      >
        <p className="message-kicker" id="message-title">
          {isFinal ? 'La estrella que faltaba' : 'Un mensaje del cielo'}
        </p>
        <p className="message-text">{message}</p>
        <button className="modal-close" type="button" aria-label="Cerrar mensaje" onClick={onClose}>
          Cerrar
        </button>
      </section>
    </div>
  );
}
