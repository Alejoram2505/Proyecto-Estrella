import { useCallback, useMemo, useState } from 'react';
import StarCanvas from './components/StarCanvas.jsx';
import ShootingStars from './components/ShootingStars.jsx';
import InteractiveStars from './components/InteractiveStars.jsx';
import MessageModal from './components/MessageModal.jsx';
import { finalMessage, messages } from './data/messages.js';

export default function App() {
  const [started, setStarted] = useState(false);
  const [burstSignal, setBurstSignal] = useState(0);
  const [sparkleSignal, setSparkleSignal] = useState(0);
  const [openedMessages, setOpenedMessages] = useState(() => new Set());
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [finalOpened, setFinalOpened] = useState(false);

  const finalThreshold = Math.min(4, messages.length);
  const finalVisible = started && openedMessages.size >= finalThreshold;

  const statusText = useMemo(() => {
    if (!started) {
      return 'Hay mensajes escondidos en el cielo.';
    }

    if (messages.length === 0) {
      return 'Una luz especial apareció para ti.';
    }

    if (finalVisible) {
      return 'Hay una estrella distinta esperándote.';
    }

    const remaining = finalThreshold - openedMessages.size;
    return remaining === 1 ? 'Una estrella más puede cambiarlo todo.' : 'Las luces más intensas tienen algo que decir.';
  }, [finalThreshold, finalVisible, openedMessages.size, started]);

  const requestBurst = useCallback(() => {
    setBurstSignal((value) => value + 1);
  }, []);

  const handleStart = () => {
    setStarted(true);
    setBurstSignal((value) => value + 2);
    setSparkleSignal((value) => value + 1);
  };

  const handleSelectMessage = (index) => {
    setOpenedMessages((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
    setSelectedMessage({
      type: 'message',
      text: messages[index],
    });
    setSparkleSignal((value) => value + 1);
    setBurstSignal((value) => value + 1);
  };

  const handleSelectFinal = () => {
    setFinalOpened(true);
    setSelectedMessage({
      type: 'final',
      text: finalMessage,
    });
    setBurstSignal((value) => value + 3);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  return (
    <main className={`app-shell${selectedMessage ? ' app-shell--modal-open' : ''}`}>
      <StarCanvas active={started} burstSignal={burstSignal} sparkleSignal={sparkleSignal} />
      <div className="sky-vignette" aria-hidden="true" />
      <ShootingStars active={started} onBurst={requestBurst} />

      <section className={`intro${started ? ' intro--started' : ''}`} aria-live="polite">
        <p className="intro-eyebrow">Proyecto Estrella</p>
        <h1>{started ? 'Elige una estrella' : 'Las estrellas guardaron algo para ti...'}</h1>
        <p className="intro-copy">{statusText}</p>
        {!started && (
          <button className="primary-action" type="button" onClick={handleStart}>
            Descubrir mensaje
          </button>
        )}
      </section>

      <InteractiveStars
        messages={messages}
        active={started}
        openedMessages={openedMessages}
        onSelect={handleSelectMessage}
        finalVisible={finalVisible}
        finalOpened={finalOpened}
        onFinalSelect={handleSelectFinal}
      />

      <MessageModal
        open={Boolean(selectedMessage)}
        message={selectedMessage?.text ?? ''}
        isFinal={selectedMessage?.type === 'final'}
        onClose={handleCloseModal}
      />
    </main>
  );
}
