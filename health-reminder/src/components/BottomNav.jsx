import { useHealth } from '../context/HealthContext';

const NAV_ITEMS = [
  { id: 'home', label: '首页', emoji: '🏠' },
  { id: 'stats', label: '统计', emoji: '📊' },
  { id: 'settings', label: '提醒', emoji: '⏰' },
  { id: 'profile', label: '我的', emoji: '👤' },
];

export function BottomNav({ activeTab, onTabChange }) {
  const { state } = useHealth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className={`text-2xl transition-transform duration-200 ${
              activeTab === item.id ? 'scale-110' : ''
            }`}>
              {item.emoji}
            </span>
            <span className={`text-xs mt-1 font-medium ${
              activeTab === item.id ? 'font-semibold' : ''
            }`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="w-1 h-1 bg-pink-400 rounded-full mt-1" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
