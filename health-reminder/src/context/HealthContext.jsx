import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  storage,
  STORAGE_KEYS,
  getDefaultReminders,
  getDefaultSettings,
  getTodayKey,
  getDateKey,
  isWorkday,
} from '../utils/storage';

const HealthContext = createContext(null);

const initialState = {
  reminders: [],
  records: {},
  settings: {},
  achievements: [],
  streak: 0,
  lastActiveDate: null,
  isLoaded: false,
  activeReminder: null,
};

function healthReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        reminders: action.payload.reminders,
        records: action.payload.records,
        settings: action.payload.settings,
        achievements: action.payload.achievements,
        streak: action.payload.streak,
        lastActiveDate: action.payload.lastActiveDate,
        isLoaded: true,
      };

    case 'UPDATE_REMINDER': {
      const updatedReminders = state.reminders.map((r) =>
        r.id === action.payload.id ? { ...r, ...action.payload } : r
      );
      storage.set(STORAGE_KEYS.REMINDERS, updatedReminders);
      return { ...state, reminders: updatedReminders };
    }

    case 'TOGGLE_REMINDER': {
      const updatedReminders = state.reminders.map((r) =>
        r.id === action.payload ? { ...r, enabled: !r.enabled } : r
      );
      storage.set(STORAGE_KEYS.REMINDERS, updatedReminders);
      return { ...state, reminders: updatedReminders };
    }

    case 'ADD_RECORD': {
      const today = getTodayKey();
      const reminderId = action.payload.reminderId;
      const currentRecords = state.records[today] || {};
      const reminderRecords = currentRecords[reminderId] || [];
      const newRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        amount: action.payload.amount || 1,
      };

      const updatedRecords = {
        ...state.records,
        [today]: {
          ...currentRecords,
          [reminderId]: [...reminderRecords, newRecord],
        },
      };

      storage.set(STORAGE_KEYS.RECORDS, updatedRecords);
      return { ...state, records: updatedRecords };
    }

    case 'UPDATE_SETTINGS': {
      const updatedSettings = { ...state.settings, ...action.payload };
      storage.set(STORAGE_KEYS.SETTINGS, updatedSettings);
      return { ...state, settings: updatedSettings };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.achievements.includes(action.payload)) {
        return state;
      }
      const updatedAchievements = [...state.achievements, action.payload];
      storage.set(STORAGE_KEYS.ACHIEVEMENTS, updatedAchievements);
      return { ...state, achievements: updatedAchievements };
    }

    case 'UPDATE_STREAK': {
      storage.set(STORAGE_KEYS.STREAK, action.payload);
      return { ...state, streak: action.payload };
    }

    case 'SET_ACTIVE_REMINDER':
      return { ...state, activeReminder: action.payload };

    case 'CHECK_STREAK': {
      const today = getTodayKey();
      if (state.lastActiveDate === today) {
        return state;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = getDateKey(yesterday);
      const hadActivityYesterday = state.records[yesterdayKey] && 
        Object.values(state.records[yesterdayKey]).some(arr => arr.length > 0);

      let newStreak = state.streak;
      if (hadActivityYesterday) {
        newStreak = state.streak;
      } else {
        newStreak = 0;
      }

      return { ...state, streak: newStreak, lastActiveDate: today };
    }

    default:
      return state;
  }
}

export function HealthProvider({ children }) {
  const [state, dispatch] = useReducer(healthReducer, initialState);

  useEffect(() => {
    const reminders = storage.get(STORAGE_KEYS.REMINDERS, null) || getDefaultReminders();
    const records = storage.get(STORAGE_KEYS.RECORDS, {});
    const settings = storage.get(STORAGE_KEYS.SETTINGS, null) || getDefaultSettings();
    const achievements = storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    const streak = storage.get(STORAGE_KEYS.STREAK, 0);
    const lastActiveDate = storage.get('health_reminder_last_active', null);

    dispatch({
      type: 'LOAD_DATA',
      payload: { reminders, records, settings, achievements, streak, lastActiveDate },
    });
  }, []);

  const getTodayRecords = useCallback(
    (reminderId) => {
      const today = getTodayKey();
      const todayRecords = state.records[today] || {};
      return todayRecords[reminderId] || [];
    },
    [state.records]
  );

  const getTodayCount = useCallback(
    (reminderId) => {
      const records = getTodayRecords(reminderId);
      return records.reduce((sum, r) => sum + (r.amount || 1), 0);
    },
    [getTodayRecords]
  );

  const getProgress = useCallback(
    (reminderId) => {
      const reminder = state.reminders.find((r) => r.id === reminderId);
      if (!reminder) return 0;
      const count = getTodayCount(reminderId);
      return Math.min(100, (count / reminder.goal) * 100);
    },
    [state.reminders, getTodayCount]
  );

  const getOverallScore = useCallback(() => {
    const enabledReminders = state.reminders.filter((r) => r.enabled);
    if (enabledReminders.length === 0) return 0;
    const totalProgress = enabledReminders.reduce((sum, r) => sum + getProgress(r.id), 0);
    return Math.round(totalProgress / enabledReminders.length);
  }, [state.reminders, getProgress]);

  const getWeeklyData = useCallback(
    (reminderId) => {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = getDateKey(date);
        const dayRecords = state.records[dateKey]?.[reminderId] || [];
        const count = dayRecords.reduce((sum, r) => sum + (r.amount || 1), 0);
        data.push({
          date: dateKey,
          day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
          count,
        });
      }
      return data;
    },
    [state.records]
  );

  const isTodayWorkday = useCallback(() => {
    return isWorkday(state.settings.workdays || []);
  }, [state.settings.workdays]);

  const value = {
    state,
    dispatch,
    getTodayRecords,
    getTodayCount,
    getProgress,
    getOverallScore,
    getWeeklyData,
    isTodayWorkday,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
