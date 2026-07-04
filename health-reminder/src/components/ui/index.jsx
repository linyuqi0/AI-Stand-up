export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function GradientCard({ children, className = '', gradient = 'from-pink-100 to-pink-50', ...props }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-md p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-pink-400 text-white hover:bg-pink-500 focus:ring-pink-300 shadow-lg shadow-pink-200',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    water: 'bg-sky-400 text-white hover:bg-sky-500 focus:ring-sky-300 shadow-lg shadow-sky-200',
    stand: 'bg-emerald-400 text-white hover:bg-emerald-500 focus:ring-emerald-300 shadow-lg shadow-emerald-200',
    eye: 'bg-purple-400 text-white hover:bg-purple-500 focus:ring-purple-300 shadow-lg shadow-purple-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, className = '', size = 'md', ...props }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      className={`${sizes[size]} flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Switch({ checked, onChange, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 ${
        checked ? 'bg-pink-400' : 'bg-gray-200'
      } ${className}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function Badge({ children, color = 'pink', className = '', ...props }) {
  const colors = {
    pink: 'bg-pink-100 text-pink-600',
    water: 'bg-sky-100 text-sky-600',
    stand: 'bg-emerald-100 text-emerald-600',
    eye: 'bg-purple-100 text-purple-600',
    mood: 'bg-amber-100 text-amber-600',
    stretch: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.pink} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, color = 'pink', className = '', showLabel = false }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    pink: 'bg-pink-400',
    water: 'bg-sky-400',
    stand: 'bg-emerald-400',
    eye: 'bg-purple-400',
    mood: 'bg-amber-400',
    stretch: 'bg-orange-400',
  };

  const bgColors = {
    pink: 'bg-pink-100',
    water: 'bg-sky-100',
    stand: 'bg-emerald-100',
    eye: 'bg-purple-100',
    mood: 'bg-amber-100',
    stretch: 'bg-orange-100',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`h-2.5 rounded-full overflow-hidden ${bgColors[color] || bgColors.pink}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color] || colors.pink}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
