// colors.js

const Colors = {
  // Primary Colors
  primaryGreen: '#4CAF50',     // Used for headers and buttons
  lightGreen: '#75B565',       // Secondary green elements
  darkGreen: '#388E3C',        // Hover states and emphasis
  forestGreen: '#2E7D32',      // Additional green variant
  
  // Neutral Colors
  white: '#FFFFFF',            // Used for backgrounds and text input fields
  black: '#000000',            // Used for text and icons
  gray: '#BDBDBD',            // Used for borders and placeholder text
  lightGray: '#F5F5F5',       // Background of input fields or inactive components
  darkGray: '#757575',        // Used for labels or secondary text
  
  // Accent Colors
  ratingYellow: '#FFEB3B',    // Star ratings color
  linkBlue: '#2196F3',        // For links like "website"
  
  // Feedback Colors
  success: '#66BB6A',         // Success messages and confirmations
  error: '#F44336',           // Error states and alerts
  warning: '#FFC107',         // Warning messages
  info: '#03A9F4',           // Information messages
  
  // State Colors
  hover: '#5CBC60',          // Hover state for primary buttons
  disabled: '#E0E0E0',       // Disabled state for components
  selected: '#C8E6C9',       // Selected state background
  
  // Text Colors
  textPrimary: '#212121',    // Primary text color
  textSecondary: '#757575',  // Secondary text color
  textDisabled: '#9E9E9E',   // Disabled text color
  textOnPrimary: '#FFFFFF',  // Text color on primary background
  
  // Border Colors
  borderLight: '#E0E0E0',    // Light borders
  borderMedium: '#BDBDBD',   // Medium emphasis borders
  borderDark: '#9E9E9E',     // High emphasis borders
  
  // Background Colors
  backgroundLight: '#FAFAFA', // Light background
  backgroundAlt: '#F0F7F0',  // Alternative background
  backgroundDark: '#E8F5E9'  // Dark background variant
};

// Color opacity variants
const ColorOpacity = {
  overlayLight: 'rgba(76, 175, 80, 0.1)',   // Light overlay of primary color
  overlayMedium: 'rgba(76, 175, 80, 0.3)',  // Medium overlay of primary color
  overlayDark: 'rgba(76, 175, 80, 0.5)',    // Dark overlay of primary color
  shadowLight: 'rgba(0, 0, 0, 0.1)',        // Light shadow
  shadowMedium: 'rgba(0, 0, 0, 0.2)',       // Medium shadow
  shadowDark: 'rgba(0, 0, 0, 0.3)'          // Dark shadow
};

export  { Colors, ColorOpacity };
