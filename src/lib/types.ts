export type Category =
  | 'health'
  | 'fitness'
  | 'learning'
  | 'mindfulness'
  | 'productivity'
  | 'social'
  | 'creative'
  | 'other';

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'health', label: 'Health', emoji: '❤️' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'learning', label: 'Learning', emoji: '📚' },
  { id: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { id: 'productivity', label: 'Productivity', emoji: '⚡' },
  { id: 'social', label: 'Social', emoji: '🤝' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export const HABIT_COLORS = [
  { id: 'violet', label: 'Violet', value: '#8B5CF6' },
  { id: 'pink', label: 'Pink', value: '#EC4899' },
  { id: 'cyan', label: 'Cyan', value: '#06B6D4' },
  { id: 'emerald', label: 'Emerald', value: '#10B981' },
  { id: 'amber', label: 'Amber', value: '#F59E0B' },
  { id: 'red', label: 'Red', value: '#EF4444' },
  { id: 'blue', label: 'Blue', value: '#3B82F6' },
  { id: 'indigo', label: 'Indigo', value: '#6366F1' },
  { id: 'rose', label: 'Rose', value: '#F43F5E' },
  { id: 'teal', label: 'Teal', value: '#14B8A6' },
];

export const EMOJI_OPTIONS = [
  '💧', '🏃', '📚', '🧘', '💊', '🥗', '😴', '✍️',
  '🎵', '🎨', '💪', '🧠', '☕', '🌿', '🙏', '💼',
  '🌅', '🚴', '🏊', '🎯', '📝', '🔥', '⭐', '🌟',
  '🍎', '🥦', '💤', '📖', '🎸', '🖊️', '🏋️', '🌙',
];

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: Category;
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
}
