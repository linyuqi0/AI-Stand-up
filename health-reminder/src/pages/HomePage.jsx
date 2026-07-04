import { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { CircularProgress, SmallCircularProgress } from '../components/ui/CircularProgress';
import { Card, GradientCard, Button, Badge } from '../components/ui';
import { REMINDER_TYPES } from '../constants';

const COLOR_MAP = {
  water: { primary: '#7EC8E3', light: '#E0F2FE', bg: 'from-sky-100 to-blue-50', text: 'text-sky-600' },
  stand: { primary: '#86EFAC', light: '#DCFCE7', bg: 'from-emerald-100 to-green-50', text: 'text-emerald-600' },
  eye: { primary: '#C084FC', light: '#F3E8FF', bg: 'from-purple-100 to-violet-50', text: 'text-purple-600' },
  stretch: { primary: '#FDBA74', light: '#FFEDD5', bg: 'from-orange-100 to-amber-50', text: 'text-orange-600' },
  mood: { primary: '#FBBF24', light: '#FEF3C7', bg: 'from-amber-100 to-yellow-50', text: 'text-amber-600' },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

function getTodayDate() {
  const now = new Date();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
}

export function HomePage() {
  const { state, dispatch, getProgress, getOverallScore, getTodayCount, isTodayWorkday } = useHealth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newScore = getOverallScore();
    const timer = setTimeout(() => setScore(newScore), 200);
    return () => clearTimeout(timer);
  }, [getOverallScore, state.records]);

  const enabledReminders = state.reminders.filter((r) => r.enabled);

  const handleQuickAdd = (reminderId) => {
    dispatch({
      type: 'ADD_RECORD',
      payload: { reminderId, amount: 1 },
    });
  };

  const isWorkday = isTodayWorkday();

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50 via-white to-pink-50/30">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">{getTodayDate()}</p>
            <h1 className="text-2xl font-bold text-gray-800">
              {getGreeting()}，{state.settings.userName || '朋友'} 👋
            </h1>
          </div>
          <div className="text-5xl animate-float">
            💧
          </div>
        </div>

        {!isWorkday && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="text-sm text-amber-700">今天是休息日，享受轻松时光吧～</span>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <CircularProgress
            value={score}
            size={220}
            strokeWidth={14}
            color="#FF9BB3"
            bgColor="#FFE8EE"
          >
            <div className="text-center">
              <span className="text-5xl font-bold text-gray-800">{score}</span>
              <p className="text-sm text-gray-500 mt-1">今日健康分</p>
              {state.streak > 0 && (
                <Badge color="pink" className="mt-2">
                  🔥 连续 {state.streak} 天
                </Badge>
              )}
            </div>
          </CircularProgress>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">今日进度</h2>
          <div className="grid grid-cols-2 gap-3">
            {enabledReminders.map((reminder) => {
              const colors = COLOR_MAP[reminder.colorScheme] || COLOR_MAP.water;
              const progress = getProgress(reminder.id);
              const count = getTodayCount(reminder.id);

              return (
                <Card
                  key={reminder.id}
                  className={`bg-gradient-to-br ${colors.bg} border-0 cursor-pointer hover:scale-[1.02] transition-transform`}
                  onClick={() => handleQuickAdd(reminder.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{reminder.emoji}</span>
                    <SmallCircularProgress
                      value={progress}
                      size={44}
                      strokeWidth={4}
                      color={colors.primary}
                      bgColor="rgba(255,255,255,0.5)"
                    />
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">{reminder.name}</p>
                  <p className="text-sm text-gray-500">
                    {count} / {reminder.goal} {reminder.unit}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">快速打卡</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {enabledReminders.map((reminder) => {
              const colors = COLOR_MAP[reminder.colorScheme] || COLOR_MAP.water;
              return (
                <button
                  key={reminder.id}
                  onClick={() => handleQuickAdd(reminder.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all active:scale-95 min-w-[80px]`}
                >
                  <span className="text-3xl">{reminder.emoji}</span>
                  <span className="text-xs font-medium text-gray-600">+1</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-100/50 to-purple-100/50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">今日小贴士</p>
              <p className="text-sm text-gray-600">
                每隔一小时起身活动一下，可以有效缓解久坐带来的疲劳哦～
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
