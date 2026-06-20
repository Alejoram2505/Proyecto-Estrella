import { useMemo } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function seededNoise(seed) {
  const value = Math.sin(seed * 91.345) * 10000;
  return value - Math.floor(value);
}

function createStarPositions(count) {
  if (count <= 0) {
    return [];
  }

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  return Array.from({ length: count }, (_, index) => {
    const progress = count === 1 ? 0.52 : (index + 0.5) / count;
    const radius = Math.sqrt(progress) * 42;
    const angle = index * goldenAngle + count * 0.31;
    const driftX = (seededNoise(index + count + 1) - 0.5) * 12;
    const driftY = (seededNoise(index + count + 8) - 0.5) * 12;
    const x = clamp(50 + Math.cos(angle) * radius + driftX, 9, 91);
    const y = clamp(52 + Math.sin(angle) * radius * 0.72 + driftY, 18, 82);

    return {
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      size: 48,
      delay: `${(index % 8) * 0.22}s`,
    };
  });
}

export default function InteractiveStars({
  messages,
  active,
  openedMessages,
  onSelect,
  finalVisible,
  finalOpened,
  onFinalSelect,
}) {
  const positions = useMemo(() => createStarPositions(messages.length), [messages.length]);

  if (!active) {
    return null;
  }

  return (
    <div className="interactive-stars" aria-label="Estrellas con mensajes escondidos">
      {messages.map((message, index) => {
        const position = positions[index];
        const isDiscovered = openedMessages.has(index);

        return (
          <button
            className={`interactive-star${isDiscovered ? ' interactive-star--discovered' : ''}`}
            key={`${message}-${index}`}
            type="button"
            style={{
              '--star-left': `${position.x}%`,
              '--star-top': `${position.y}%`,
              '--star-size': `${position.size}px`,
              '--star-delay': position.delay,
            }}
            aria-label={`Abrir mensaje ${index + 1}`}
            onClick={() => onSelect(index)}
          >
            <span className="interactive-star__sparkle" aria-hidden="true">
              <span className="interactive-star__core" />
              <span className="interactive-star__ray interactive-star__ray--vertical" />
              <span className="interactive-star__ray interactive-star__ray--horizontal" />
              <span className="interactive-star__ray interactive-star__ray--diagonal-a" />
              <span className="interactive-star__ray interactive-star__ray--diagonal-b" />
            </span>
          </button>
        );
      })}

      {finalVisible && (
        <button
          className={`interactive-star interactive-star--final${finalOpened ? ' interactive-star--discovered' : ''}`}
          type="button"
          style={{
            '--star-left': '50%',
            '--star-top': '62%',
            '--star-size': '58px',
            '--star-delay': '0s',
          }}
          aria-label="Abrir estrella especial"
          onClick={onFinalSelect}
        >
          <span className="interactive-star__sparkle" aria-hidden="true">
            <span className="interactive-star__core" />
            <span className="interactive-star__ray interactive-star__ray--vertical" />
            <span className="interactive-star__ray interactive-star__ray--horizontal" />
            <span className="interactive-star__ray interactive-star__ray--diagonal-a" />
            <span className="interactive-star__ray interactive-star__ray--diagonal-b" />
          </span>
        </button>
      )}
    </div>
  );
}
