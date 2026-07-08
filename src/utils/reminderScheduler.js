import { getDateKey, isWorkday, isWithinWorkHours } from './storage';

class ReminderScheduler {
  constructor() {
    this.timers = new Map();
    this.listeners = new Set();
  }

  init(reminders, settings, onReminder) {
    this.reminders = reminders;
    this.settings = settings;
    this.onReminder = onReminder;
    this.clearAll();
    this.scheduleAll();
  }

  scheduleAll() {
    if (!this.reminders || !this.settings) return;

    const enabledReminders = this.reminders.filter((r) => r.enabled);
    enabledReminders.forEach((reminder) => {
      this.scheduleReminder(reminder);
    });
  }

  scheduleReminder(reminder) {
    this.clearReminder(reminder.id);

    const nextTime = this.getNextReminderTime(reminder);
    if (!nextTime) return;

    const now = new Date();
    const delay = nextTime.getTime() - now.getTime();

    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => {
        this.triggerReminder(reminder);
        this.scheduleReminder(reminder);
      }, delay);
      this.timers.set(reminder.id, timer);
    }
  }

  getNextReminderTime(reminder) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (!isWorkday(this.settings.workdays || [])) {
      return null;
    }

    if (reminder.fixedTime) {
      const [hour, minute] = reminder.fixedTime.split(':').map(Number);
      const fixedMinutes = hour * 60 + minute;
      if (currentMinutes >= fixedMinutes) {
        return null;
      }
      const next = new Date();
      next.setHours(hour, minute, 0, 0);
      return next;
    }

    const [startHour, startMin] = reminder.startTime.split(':').map(Number);
    const [endHour, endMin] = reminder.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (currentMinutes >= endMinutes) {
      return null;
    }

    let nextMinutes;
    if (currentMinutes < startMinutes) {
      nextMinutes = startMinutes;
    } else {
      const elapsed = currentMinutes - startMinutes;
      const intervals = Math.floor(elapsed / reminder.interval) + 1;
      nextMinutes = startMinutes + intervals * reminder.interval;
    }

    if (nextMinutes > endMinutes) {
      return null;
    }

    const next = new Date();
    next.setHours(
      Math.floor(nextMinutes / 60),
      nextMinutes % 60,
      0,
      0
    );
    return next;
  }

  triggerReminder(reminder) {
    if (this.onReminder) {
      this.onReminder(reminder);
    }
    this.listeners.forEach((listener) => listener(reminder));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${reminder.emoji} ${reminder.name}`, {
        body: reminder.description,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
      });
    }
  }

  snooze(reminderId, minutes = 5) {
    const reminder = this.reminders.find((r) => r.id === reminderId);
    if (!reminder) return;

    this.clearReminder(reminderId);
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    const timer = setTimeout(() => {
      this.triggerReminder(reminder);
      this.scheduleReminder(reminder);
    }, minutes * 60 * 1000);
    this.timers.set(reminderId, timer);
  }

  skip(reminderId) {
    const reminder = this.reminders.find((r) => r.id === reminderId);
    if (!reminder) return;
    this.clearReminder(reminderId);
    this.scheduleReminder(reminder);
  }

  clearReminder(reminderId) {
    const timer = this.timers.get(reminderId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(reminderId);
    }
  }

  clearAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getNextReminderInfo(reminderId) {
    const reminder = this.reminders?.find((r) => r.id === reminderId);
    if (!reminder) return null;
    return this.getNextReminderTime(reminder);
  }

  static formatTimeUntil(date) {
    if (!date) return '';
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return '即将提醒';

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟后`;
    }
    return `${minutes}分钟后`;
  }
}

export const reminderScheduler = new ReminderScheduler();
export default reminderScheduler;
