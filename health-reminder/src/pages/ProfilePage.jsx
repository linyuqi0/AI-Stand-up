import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Card, Switch } from '../components/ui';
import { THEME_CONFIG, ACHIEVEMENTS, CHARACTERS, SOUND_EFFECTS } from '../constants';

function ThemeSelector({ currentTheme, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.values(THEME_CONFIG).map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
            currentTheme === theme.id
              ? 'ring-2 ring-pink-400 ring-offset-2 bg-white shadow-md'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div
            className="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-2xl"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})` }}
          >
            {theme.emoji}
          </div>
          <span className="text-xs font-medium text-gray-700">{theme.name}</span>
        </button>
      ))}
    </div>
  );
}

function SettingItem({ icon, title, subtitle, onClick, rightContent, border = true }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 text-left ${
        border ? 'border-b border-gray-100' : ''
      } hover:bg-gray-50 transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        {!rightContent && onClick && (
          <span className="text-gray-400">›</span>
        )}
      </div>
    </button>
  );
}

export function ProfilePage() {
  const { state, dispatch } = useHealth();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const currentTheme = THEME_CONFIG[state.settings.theme] || THEME_CONFIG.sakura;
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id));

  const handleThemeChange = (themeId) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: themeId } });
    setShowThemeModal(false);
  };

  const handleSoundChange = (soundId) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { defaultSound: soundId } });
    setShowSoundModal(false);
  };

  const handleCharacterChange = (characterId) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { character: characterId } });
    setShowCharacterModal(false);
  };

  const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">我的</h1>

        <Card className="bg-gradient-to-br from-pink-100/80 to-purple-100/80 border-0 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-4xl">
              {CHARACTERS.find((c) => c.id === state.settings.character)?.emoji || '💧'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {state.settings.userName || '健康达人'}
              </h2>
              <p className="text-sm text-gray-600">
                已坚持 {state.streak} 天 · 获得 {unlockedAchievements.length} 个成就
              </p>
            </div>
            <Badge color="pink">🔥 Lv.{Math.floor(state.streak / 7) + 1}</Badge>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            个性化
          </h2>
          <Card className="p-0 overflow-hidden">
            <SettingItem
              icon="🎨"
              title="主题设置"
              subtitle={currentTheme.name}
              onClick={() => setShowThemeModal(true)}
              rightContent={
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ background: currentTheme.primary }}
                />
              }
            />
            <SettingItem
              icon="🔔"
              title="提醒音效"
              subtitle={SOUND_EFFECTS.find((s) => s.id === (state.settings.defaultSound || 'water_drop'))?.name || '叮咚水声'}
              onClick={() => setShowSoundModal(true)}
              rightContent={<span className="text-gray-400">›</span>}
            />
            <SettingItem
              icon="🐰"
              title="可爱角色"
              subtitle={CHARACTERS.find((c) => c.id === state.settings.character)?.name || '水滴宝宝'}
              onClick={() => setShowCharacterModal(true)}
              border={false}
              rightContent={<span className="text-gray-400">›</span>}
            />
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            功能设置
          </h2>
          <Card className="p-0 overflow-hidden">
            <SettingItem
              icon="🌙"
              title="专注模式"
              subtitle="开启后暂停所有提醒"
              rightContent={
                <Switch
                  checked={state.settings.focusMode || false}
                  onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { focusMode: v } })}
                />
              }
            />
            <SettingItem
              icon="🎉"
              title="跳过周末"
              subtitle="周末自动暂停提醒"
              rightContent={
                <Switch
                  checked={state.settings.autoSkipWeekend !== false}
                  onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { autoSkipWeekend: v } })}
                />
              }
              border={false}
            />
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            数据与账号
          </h2>
          <Card className="p-0 overflow-hidden">
            <SettingItem
              icon="☁️"
              title="数据备份"
              subtitle="备份到云端"
              onClick={() => {}}
            />
            <SettingItem
              icon="📤"
              title="导出数据"
              subtitle="导出为JSON"
              onClick={() => {
                const data = {
                  reminders: state.reminders,
                  records: state.records,
                  settings: state.settings,
                  achievements: state.achievements,
                  streak: state.streak,
                  exportDate: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `health-reminder-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            />
            <SettingItem
              icon="🔄"
              title="重置数据"
              subtitle="清除所有记录"
              onClick={() => {
                if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              border={false}
            />
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
            关于
          </h2>
          <Card className="p-0 overflow-hidden">
            <SettingItem
              icon="💌"
              title="意见反馈"
              onClick={() => {}}
            />
            <SettingItem
              icon="📱"
              title="给我们评分"
              onClick={() => {}}
            />
            <SettingItem
              icon="📖"
              title="关于我们"
              subtitle="v1.0.0"
              onClick={() => {}}
              border={false}
            />
          </Card>
        </div>

        <div className="text-center text-xs text-gray-400 pb-4">
          <p>工作再忙，也要好好照顾自己 ♡</p>
          <p className="mt-1">Stretch & Sip v1.0.0</p>
        </div>
      </div>

      {showThemeModal && (
        <Modal title="选择主题" onClose={() => setShowThemeModal(false)}>
          <ThemeSelector
            currentTheme={state.settings.theme}
            onSelect={handleThemeChange}
          />
        </Modal>
      )}

      {showSoundModal && (
        <Modal title="选择提醒音效" onClose={() => setShowSoundModal(false)}>
          <div className="space-y-2">
            {SOUND_EFFECTS.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handleSoundChange(sound.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  state.settings.defaultSound === sound.id
                    ? 'bg-pink-50 ring-2 ring-pink-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{sound.emoji}</span>
                <span className="font-medium text-gray-800">{sound.name}</span>
                {state.settings.defaultSound === sound.id && (
                  <span className="ml-auto text-pink-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {showCharacterModal && (
        <Modal title="选择角色" onClose={() => setShowCharacterModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => char.unlocked && handleCharacterChange(char.id)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  state.settings.character === char.id
                    ? 'bg-pink-50 ring-2 ring-pink-300'
                    : char.unlocked
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-5xl mb-2">{char.emoji}</span>
                <span className="font-medium text-gray-800">{char.name}</span>
                {!char.unlocked && (
                  <span className="text-xs text-gray-500 mt-1">🔒 待解锁</span>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Badge({ children, color = 'pink' }) {
  const colors = {
    pink: 'bg-pink-100 text-pink-600',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

export default ProfilePage;
