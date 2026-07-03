import { REMINDER_CONFIG, DEFAULT_WORKDAYS, THEMES } from '../constants';

const STORAGE_KEYS = {
  REMINDERS: 'health_reminder_reminders',
  RECORDS: 'health_reminder_records',
  SETTINGS: 'health_reminder_settings',
  ACHIEVEMENTS: 'health_reminder_achievements',
  STREAK: 'health_reminder_streak',
};

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

export function getDefaultReminders() {
  return Object.values(REMINDER_CONFIG).map((config) => ({
    id: config.id,
    name: config.name,
    emoji: config.emoji,
    description: config.description,
    enabled: config.enabled,
    interval: config.defaultInterval,
    goal: config.defaultGoal,
    unit: config.unit,
    startTime: config.startTime,
    endTime: config.endTime,
    fixedTime: config.fixedTime || null,
    colorScheme: config.colorScheme,
    sound: 'water_drop',
    vibration: true,
  }));
}

export function getDefaultSettings() {
  return {
    theme: THEMES.SAKURA,
    workdays: [...DEFAULT_WORKDAYS],
    soundEnabled: true,
    vibrationEnabled: true,
    notificationEnabled: true,
    focusMode: false,
    autoSkipWeekend: true,
    character: 'water_drop',
    userName: '',
  };
}

export function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDateKey(date) {
  const d = date || new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isWorkday(workdays) {
  const day = new Date().getDay();
  return workdays.includes(day);
}

export function isWithinWorkHours(startTime, endTime) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

export { STORAGE_KEYS };
