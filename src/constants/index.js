export const REMINDER_TYPES = {
  WATER: 'water',
  STAND: 'stand',
  EYE: 'eye',
  STRETCH: 'stretch',
  MOOD: 'mood',
};

export const REMINDER_CONFIG = {
  [REMINDER_TYPES.WATER]: {
    id: REMINDER_TYPES.WATER,
    name: '喝水提醒',
    emoji: '💧',
    description: '定时提醒补充水分',
    defaultInterval: 45,
    defaultGoal: 8,
    unit: '杯',
    colorScheme: 'water',
    startTime: '09:00',
    endTime: '18:00',
    enabled: true,
  },
  [REMINDER_TYPES.STAND]: {
    id: REMINDER_TYPES.STAND,
    name: '站立提醒',
    emoji: '🧍',
    description: '起身活动，伸展肢体',
    defaultInterval: 60,
    defaultGoal: 8,
    unit: '次',
    colorScheme: 'stand',
    startTime: '09:00',
    endTime: '18:00',
    enabled: true,
  },
  [REMINDER_TYPES.EYE]: {
    id: REMINDER_TYPES.EYE,
    name: '护眼提醒',
    emoji: '👀',
    description: '远眺放松，保护视力',
    defaultInterval: 90,
    defaultGoal: 6,
    unit: '次',
    colorScheme: 'eye',
    startTime: '09:00',
    endTime: '18:00',
    enabled: false,
  },
  [REMINDER_TYPES.STRETCH]: {
    id: REMINDER_TYPES.STRETCH,
    name: '拉伸提醒',
    emoji: '🧘',
    description: '简单拉伸，缓解疲劳',
    defaultInterval: 120,
    defaultGoal: 4,
    unit: '次',
    colorScheme: 'stretch',
    startTime: '09:00',
    endTime: '18:00',
    enabled: false,
  },
  [REMINDER_TYPES.MOOD]: {
    id: REMINDER_TYPES.MOOD,
    name: '心情打卡',
    emoji: '😊',
    description: '记录今日心情',
    defaultInterval: null,
    defaultGoal: 1,
    unit: '次',
    colorScheme: 'mood',
    startTime: '18:00',
    endTime: '18:00',
    fixedTime: '18:00',
    enabled: false,
  },
};

export const DEFAULT_WORKDAYS = [1, 2, 3, 4, 5];

export const WEEKDAYS = [
  { id: 0, name: '周日', short: '日' },
  { id: 1, name: '周一', short: '一' },
  { id: 2, name: '周二', short: '二' },
  { id: 3, name: '周三', short: '三' },
  { id: 4, name: '周四', short: '四' },
  { id: 5, name: '周五', short: '五' },
  { id: 6, name: '周六', short: '六' },
];

export const THEMES = {
  SAKURA: 'sakura',
  MINT: 'mint',
  CLOUD: 'cloud',
  NIGHT: 'night',
  ORANGE: 'orange',
  LAVENDER: 'lavender',
};

export const THEME_CONFIG = {
  [THEMES.SAKURA]: {
    id: THEMES.SAKURA,
    name: '樱花粉',
    emoji: '🌸',
    primary: '#FFB6C1',
    primaryLight: '#FFE8EE',
    gradient: 'from-pink-200 to-pink-100',
    isDark: false,
  },
  [THEMES.MINT]: {
    id: THEMES.MINT,
    name: '薄荷绿',
    emoji: '🌿',
    primary: '#B5EAD7',
    primaryLight: '#DCFCE7',
    gradient: 'from-green-200 to-emerald-100',
    isDark: false,
  },
  [THEMES.CLOUD]: {
    id: THEMES.CLOUD,
    name: '云朵白',
    emoji: '☁️',
    primary: '#A8DADC',
    primaryLight: '#F0F9FF',
    gradient: 'from-sky-100 to-blue-50',
    isDark: false,
  },
  [THEMES.NIGHT]: {
    id: THEMES.NIGHT,
    name: '夜间模式',
    emoji: '🌙',
    primary: '#C4B5FD',
    primaryLight: '#4C1D95',
    gradient: 'from-slate-800 to-slate-900',
    isDark: true,
  },
  [THEMES.ORANGE]: {
    id: THEMES.ORANGE,
    name: '暖阳橙',
    emoji: '🍊',
    primary: '#FDBA74',
    primaryLight: '#FFEDD5',
    gradient: 'from-orange-200 to-amber-100',
    isDark: false,
  },
  [THEMES.LAVENDER]: {
    id: THEMES.LAVENDER,
    name: '薰衣草紫',
    emoji: '💜',
    primary: '#E0BBE4',
    primaryLight: '#F3E8FF',
    gradient: 'from-purple-200 to-violet-100',
    isDark: false,
  },
};

export const ACHIEVEMENTS = [
  { id: 'first_water', name: '第一杯水', emoji: '💧', description: '完成第一次喝水打卡', type: 'water', condition: { count: 1 } },
  { id: 'first_stand', name: '首次站立', emoji: '🧍', description: '完成第一次站立打卡', type: 'stand', condition: { count: 1 } },
  { id: 'streak_3', name: '三天连胜', emoji: '🔥', description: '连续3天完成目标', type: 'streak', condition: { days: 3 } },
  { id: 'streak_7', name: '周冠军', emoji: '🏆', description: '连续7天完成目标', type: 'streak', condition: { days: 7 } },
  { id: 'water_100', name: '喝水小能手', emoji: '🥤', description: '累计喝水100杯', type: 'water_total', condition: { count: 100 } },
  { id: 'stand_50', name: '运动达人', emoji: '🏃', description: '累计站立50次', type: 'stand_total', condition: { count: 50 } },
  { id: 'streak_30', name: '月健康达人', emoji: '🥇', description: '连续30天完成目标', type: 'streak', condition: { days: 30 } },
  { id: 'streak_100', name: '百日坚持', emoji: '💯', description: '连续100天完成目标', type: 'streak', condition: { days: 100 } },
];

export const SOUND_EFFECTS = [
  { id: 'water_drop', name: '叮咚水声', emoji: '💧' },
  { id: 'bell', name: '可爱铃铛', emoji: '🔔' },
  { id: 'soft', name: '轻柔提示', emoji: '🎵' },
  { id: 'bird', name: '小鸟啾啾', emoji: '🐦' },
  { id: 'silent', name: '静音模式', emoji: '🔕' },
];

export const CHARACTERS = [
  { id: 'water_drop', name: '水滴宝宝', emoji: '💧', unlocked: true },
  { id: 'stand_bear', name: '站立小熊', emoji: '🧸', unlocked: false },
  { id: 'eye_cat', name: '护眼猫咪', emoji: '😺', unlocked: false },
  { id: 'stretch_bunny', name: '拉伸兔兔', emoji: '🐰', unlocked: false },
];
