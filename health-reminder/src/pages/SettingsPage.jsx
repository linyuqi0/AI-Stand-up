import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Card, Switch, Button } from '../components/ui';
import { WEEKDAYS } from '../constants';

const COLOR_MAP = {
  water: { primary: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' },
  stand: { primary: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  eye: { primary: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  stretch: { primary: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  mood: { primary: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
};

function TimePicker({ value, onChange, label }) {
  const [hours, minutes] = value.split(':').map(Number);

  const handleChange = (type, val) => {
    let h = hours;
    let m = minutes;
    if (type === 'hour') h = val;
    else m = val;
    onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <select
        value={hours}
        onChange={(e) => handleChange('hour', Number(e.target.value))}
        className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
        ))}
      </select>
      <span className="text-gray-400">:</span>
      <select
        value={minutes}
        onChange={(e) => handleChange('minute', Number(e.target.value))}
        className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium"
      >
        {[0, 15, 30, 45].map((m) => (
          <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
        ))}
      </select>
    </div>
  );
}

function IntervalPicker({ value, onChange, options, label }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function GoalPicker({ value, onChange, max = 20, label }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-500">{label}</span>}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-lg font-medium"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-lg font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { state, dispatch } = useHealth();
  const [expandedId, setExpandedId] = useState(null);

  const toggleReminder = (id) => {
    dispatch({ type: 'TOGGLE_REMINDER', payload: id });
  };

  const updateReminder = (id, updates) => {
    dispatch({
      type: 'UPDATE_REMINDER',
      payload: { id, ...updates },
    });
  };

  const toggleWorkday = (dayId) => {
    const currentWorkdays = state.settings.workdays || [];
    const newWorkdays = currentWorkdays.includes(dayId)
      ? currentWorkdays.filter((d) => d !== dayId)
      : [...currentWorkdays, dayId].sort();
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { workdays: newWorkdays },
    });
  };

  const intervalOptions = [
    { value: 15, label: '每15分钟' },
    { value: 30, label: '每30分钟' },
    { value: 45, label: '每45分钟' },
    { value: 60, label: '每60分钟' },
    { value: 90, label: '每90分钟' },
    { value: 120, label: '每2小时' },
    { value: 180, label: '每3小时' },
  ];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">提醒设置</h1>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            工作日设置
          </h2>
          <Card className="p-2">
            <div className="flex justify-between gap-1">
              {WEEKDAYS.map((day) => {
                const isSelected = state.settings.workdays?.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => toggleWorkday(day.id)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-pink-400 text-white shadow-md'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            提醒类型
          </h2>
          <div className="space-y-3">
            {state.reminders.map((reminder) => {
              const colors = COLOR_MAP[reminder.colorScheme] || COLOR_MAP.water;
              const isExpanded = expandedId === reminder.id;

              return (
                <Card key={reminder.id} className="overflow-hidden p-0">
                  <button
                    className="w-full p-4 flex items-center justify-between"
                    onClick={() => setExpandedId(isExpanded ? null : reminder.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}>
                        {reminder.emoji}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">{reminder.name}</p>
                        <p className="text-xs text-gray-500">
                          {reminder.enabled
                            ? reminder.fixedTime
                              ? `每天 ${reminder.fixedTime}`
                              : `每${reminder.interval}分钟`
                            : '已关闭'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={reminder.enabled}
                        onChange={(v) => {
                          toggleReminder(reminder.id);
                        }}
                      />
                      <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className={`px-4 pb-4 border-t ${colors.border} border-opacity-50`}>
                      <div className="pt-4 space-y-4">
                        {!reminder.fixedTime && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">提醒间隔</span>
                            <IntervalPicker
                              value={reminder.interval}
                              onChange={(val) => updateReminder(reminder.id, { interval: val })}
                              options={intervalOptions}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">每日目标</span>
                          <GoalPicker
                            value={reminder.goal}
                            onChange={(val) => updateReminder(reminder.id, { goal: val })}
                          />
                        </div>

                        {reminder.fixedTime ? (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">提醒时间</span>
                            <TimePicker
                              value={reminder.fixedTime}
                              onChange={(val) => updateReminder(reminder.id, { fixedTime: val })}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">开始时间</span>
                              <TimePicker
                                value={reminder.startTime}
                                onChange={(val) => updateReminder(reminder.id, { startTime: val })}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">结束时间</span>
                              <TimePicker
                                value={reminder.endTime}
                                onChange={(val) => updateReminder(reminder.id, { endTime: val })}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            通知设置
          </h2>
          <Card className="p-0">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">声音提醒</p>
                <p className="text-xs text-gray-500">提醒时播放提示音</p>
              </div>
              <Switch
                checked={state.settings.soundEnabled ?? true}
                onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { soundEnabled: v } })}
              />
            </div>
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">震动反馈</p>
                <p className="text-xs text-gray-500">提醒时震动</p>
              </div>
              <Switch
                checked={state.settings.vibrationEnabled ?? true}
                onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { vibrationEnabled: v } })}
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">推送通知</p>
                <p className="text-xs text-gray-500">后台运行时也能收到提醒</p>
              </div>
              <Switch
                checked={state.settings.notificationEnabled ?? true}
                onChange={(v) => {
                  dispatch({ type: 'UPDATE_SETTINGS', payload: { notificationEnabled: v } });
                  if (v && 'Notification' in window && Notification.permission === 'default') {
                    Notification.requestPermission();
                  }
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
