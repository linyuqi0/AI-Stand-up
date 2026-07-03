import { useState, useEffect } from 'react';
import { Button } from './ui';

const COLOR_MAP = {
  water: {
    bg: 'from-sky-100 to-blue-50',
    button: 'water',
    text: 'text-sky-600',
    border: 'border-sky-200',
  },
  stand: {
    bg: 'from-emerald-100 to-green-50',
    button: 'stand',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  eye: {
    bg: 'from-purple-100 to-violet-50',
    button: 'eye',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  stretch: {
    bg: 'from-orange-100 to-amber-50',
    button: 'stretch',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  mood: {
    bg: 'from-amber-100 to-yellow-50',
    button: 'mood',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
};

export function ReminderModal({ reminder, onComplete, onSnooze, onSkip, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (reminder) {
      setTimeout(() => setIsVisible(true), 50);
      setTimeout(() => setBounce(true), 200);
    }
  }, [reminder]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const handleComplete = () => {
    onComplete?.(reminder);
    handleClose();
  };

  const handleSnooze = (minutes) => {
    onSnooze?.(reminder.id, minutes);
    handleClose();
  };

  const handleSkip = () => {
    onSkip?.(reminder.id);
    handleClose();
  };

  if (!reminder) return null;

  const colors = COLOR_MAP[reminder.colorScheme] || COLOR_MAP.water;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-sm bg-gradient-to-br ${colors.bg} rounded-3xl p-6 shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/80 transition-colors"
        >
          <span className="text-gray-500 text-lg">✕</span>
        </button>

        <div className="text-center">
          <div
            className={`text-7xl mb-4 inline-block transition-transform duration-500 ${
              bounce ? 'animate-bounce' : ''
            }`}
            style={{ animationDuration: '1s' }}
          >
            {reminder.emoji}
          </div>

          <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
            {reminder.name}
          </h2>
          <p className="text-gray-600 mb-6">
            {reminder.description}
          </p>

          <div className="space-y-3">
            <Button
              variant={colors.button}
              size="lg"
              className="w-full"
              onClick={handleComplete}
            >
              ✓ 已完成
            </Button>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => handleSnooze(5)}
              >
                5分钟后
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => handleSnooze(15)}
              >
                15分钟后
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="flex-1"
                onClick={handleSkip}
              >
                跳过
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReminderModal;
