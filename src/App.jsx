import { useState, useEffect } from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import BottomNav from './components/BottomNav';
import ReminderModal from './components/ReminderModal';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { reminderScheduler } from './utils/reminderScheduler';
import { ACHIEVEMENTS } from './constants';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeReminder, setActiveReminder] = useState(null);
  const { state, dispatch, getTodayCount } = useHealth();

  useEffect(() => {
    if (state.isLoaded && state.reminders.length > 0) {
      reminderScheduler.init(
        state.reminders,
        state.settings,
        (reminder) => {
          setActiveReminder(reminder);
        }
      );
    }

    return () => {
      reminderScheduler.clearAll();
    };
  }, [state.isLoaded, state.reminders, state.settings]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
    }
  }, []);

  const checkAchievements = (reminderId, count) => {
    ACHIEVEMENTS.forEach((achievement) => {
      if (state.achievements.includes(achievement.id)) return;

      let unlocked = false;
      switch (achievement.type) {
        case 'water':
          if (reminderId === 'water' && count >= achievement.condition.count) {
            unlocked = true;
          }
          break;
        case 'stand':
          if (reminderId === 'stand' && count >= achievement.condition.count) {
            unlocked = true;
          }
          break;
        case 'streak':
          if (state.streak >= achievement.condition.days) {
            unlocked = true;
          }
          break;
        default:
          break;
      }

      if (unlocked) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
      }
    });
  };

  const handleComplete = (reminder) => {
    dispatch({
      type: 'ADD_RECORD',
      payload: { reminderId: reminder.id, amount: 1 },
    });

    setTimeout(() => {
      const newCount = getTodayCount(reminder.id) + 1;
      checkAchievements(reminder.id, newCount);
    }, 0);

    setActiveReminder(null);
  };

  const handleSnooze = (reminderId, minutes) => {
    reminderScheduler.snooze(reminderId, minutes);
    setActiveReminder(null);
  };

  const handleSkip = (reminderId) => {
    reminderScheduler.skip(reminderId);
    setActiveReminder(null);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {state.isLoaded ? (
        <>
          {renderPage()}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          <ReminderModal
            reminder={activeReminder}
            onComplete={handleComplete}
            onSnooze={handleSnooze}
            onSkip={handleSkip}
            onClose={() => setActiveReminder(null)}
          />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce-soft">💧</div>
            <p className="text-gray-500">加载中...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}

export default App;
