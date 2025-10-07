import Icon from './Icon';
import { emojiToIcon } from './iconMapping';

// Replace emoji with Icon component
export const replaceEmojiWithIcon = (emoji, props = {}) => {
  const iconName = emojiToIcon[emoji];
  if (iconName) {
    return <Icon name={iconName} {...props} />;
  }
  return emoji; // Return original emoji if no mapping found
};

// Get icon name from emoji
export const getIconName = (emoji) => {
  return emojiToIcon[emoji] || null;
};

// Check if emoji has icon mapping
export const hasIconMapping = (emoji) => {
  return emojiToIcon.hasOwnProperty(emoji);
};

// Common icon props for different contexts
export const iconProps = {
  small: { size: 16 },
  medium: { size: 20 },
  large: { size: 24 },
  xlarge: { size: 32 },
  navigation: { size: 20, color: 'currentColor' },
  button: { size: 18, color: 'currentColor' },
  card: { size: 24, color: '#666' },
  header: { size: 28, color: 'currentColor' }
};
