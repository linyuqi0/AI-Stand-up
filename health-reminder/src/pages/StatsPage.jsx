import { useState, useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import { Card, Badge } from '../components/ui';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ACHIEVEMENTS } from '../constants';

const COLOR_MAP = {
  water: { primary: '#7EC8E3', light: '#E0F2FE' },
  stand: { primary: '#86EFAC', light: '#DCFCE7' },
  eye: { primary: '#C084FC', light: '#F3E8FF' },
  stretch: { primary: '#FDBA74', light: '#FFEDD5' },
  mood: { primary: '#FBBF24', light: '#FEF3C7' },
};

function BarChart({ data, color = '#FF9BB3', maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((item, index) => {
        const height = max > 0 ? (item.count / max) * 100 : 0;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end flex-1">
              {item.count > 0 && (
                <span className="text-xs font-semibold text-gray-600 mb-1">
                  {item.count}
                </span>
              )}
              <div
                className="w-full rounded-t-lg transition-all duration-700 ease-out"
                style={{
                  height: `${height}%`,
                  minHeight: item.count > 0 ? '8px' : '0',
                  background: `linear-gradient(to top, ${color}, ${color}88)`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function AchievementCard({ achievement, unlocked }) {
  return (
    <div
      className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50'
          : 'bg-gray-50 opacity-50'
      }`}
    >
      <span className={`text-3xl mb-1 ${unlocked ? '' : 'grayscale'}`}>
        {achievement.emoji}
      </span>
      <span className="text-xs font-semibold text-gray-700 text-center">
        {achievement.name}
      </span>
      <span className="text-[10px] text-gray-500 text-center mt-0.5">
        {achievement.description}
      </span>
    </div>
  );
}

export function StatsPage() {
  const { state, getWeeklyData, getTodayCount, getProgress, getOverallScore } = useHealth();
  const [activeTab, setActiveTab] = useState('week');
  const [selectedReminder, setSelectedReminder] = useState('water');

  const enabledReminders = state.reminders.filter((r) => r.enabled);
  const selectedReminderData = state.reminders.find((r) => r.id === selectedReminder);
  const weeklyData = getWeeklyData(selectedReminder);

  const stats = useMemo(() => {
    const todayCount = getTodayCount(selectedReminder);
    const weekTotal = weeklyData.reduce((sum, d) => sum + d.count, 0);
    const weekAverage = weeklyData.length > 0 ? Math.round(weekTotal / 7 * 10) / 10 : 0;
    const progress = getProgress(selectedReminder);

    return { todayCount, weekTotal, weekAverage, progress };
  }, [selectedReminder, weeklyData, getTodayCount, getProgress]);

  const colors = COLOR_MAP[selectedReminderData?.colorScheme] || COLOR_MAP.water;

  const unlockedCount = state.achievements.length;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">数据统计</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            {['week', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white shadow-md text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'week' ? '📊 周数据' : '🏆 成就'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'week' && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
              {enabledReminders.map((reminder) => (
                <button
                  key={reminder.id}
                  onClick={() => setSelectedReminder(reminder.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedReminder === reminder.id
                      ? 'bg-pink-400 text-white shadow-md'
                      : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span>{reminder.emoji}</span>
                  <span className="text-sm font-medium">{reminder.name}</span>
                </button>
              ))}
            </div>

            <Card className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">本周概览</h2>
                <Badge color={selectedReminderData?.colorScheme || 'pink'}>
                  {selectedReminderData?.name}
                </Badge>
              </div>

              <BarChart
                data={weeklyData}
                color={colors.primary}
                maxValue={selectedReminderData?.goal}
              />
            </Card>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="text-center">
                <p className="text-sm text-gray-500 mb-1">今日完成</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.todayCount}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    /{selectedReminderData?.goal}
                  </span>
                </p>
              </Card>
              <Card className="text-center">
                <p className="text-sm text-gray-500 mb-1">本周总计</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.weekTotal}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedReminderData?.unit}
                  </span>
                </p>
              </Card>
              <Card className="text-center">
                <p className="text-sm text-gray-500 mb-1">日均完成</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.weekAverage}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedReminderData?.unit}
                  </span>
                </p>
              </Card>
              <Card className="text-center">
                <p className="text-sm text-gray-500 mb-1">今日进度</p>
                <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {Math.round(stats.progress)}%
                </p>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">综合健康分</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {getOverallScore()}
                    <span className="text-base font-normal text-gray-500 ml-1">/100</span>
                  </p>
                  {state.streak > 0 && (
                    <p className="text-sm text-pink-500 mt-1">
                      🔥 连续 {state.streak} 天保持健康
                    </p>
                  )}
                </div>
                <CircularProgress
                  value={getOverallScore()}
                  size={100}
                  strokeWidth={8}
                  color="#FF9BB3"
                  bgColor="#FFE8EE"
                >
                  <span className="text-2xl font-bold text-gray-800">
                    {getOverallScore()}
                  </span>
                </CircularProgress>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 mb-1">成就收集</p>
                  <p className="text-3xl font-bold text-amber-800">
                    {unlockedCount}
                    <span className="text-base font-normal text-amber-600 ml-1">
                      / {ACHIEVEMENTS.length}
                    </span>
                  </p>
                </div>
                <span className="text-5xl">🏆</span>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={state.achievements.includes(achievement.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
