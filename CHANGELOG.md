# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-23

### ✨ Added
- New responsive letter keyboard layout with 3 rows (A-I, J-R, S-Z)
- Enhanced word reveal display when game is lost
- Better mobile responsiveness across all screen sizes
- Improved container width management for better word display

### 🎨 Improved
- **UI/UX Enhancements**:
  - Removed distracting vertical light scanning effect from cyber cards
  - Optimized word display to better fit long words like "CODESPACES", "CHERRY-PICK"
  - Improved letter button sizing and centering for better visibility
  - Enhanced grid layout proportions (3-column layout for better space utilization)

- **Typography & Layout**:
  - Adjusted font sizes for better readability: `clamp(0.8rem, 2.2vw, 1.6rem)`
  - Reduced letter spacing from `0.18em` to `0.12em` for better word fitting
  - Expanded word container width: min `400px`, max `700px`
  - Better responsive breakpoints for mobile devices

- **Game Experience**:
  - Cleaner game over message: now shows only "💀 Game Over!" 
  - Word reveal moved to dedicated highlighted section
  - Removed redundant word display in status messages

### 🔧 Technical Changes
- **Frontend**:
  - Refactored letter button CSS for better centering and responsiveness
  - Updated word display component with improved flex layout
  - Enhanced cyber-card styling with better padding and width management
  - Improved mobile media queries for better small screen support

- **Backend**:
  - Modified game over response to exclude word from status message
  - Added `correct_word` field to API response for cleaner separation of concerns
  - Simplified game over message generation

### 🐛 Fixed
- Fixed letter buttons being cut off on smaller screens
- Resolved word overflow issues in containers
- Fixed vertical alignment of letters in keyboard
- Prevented layout breaking with very long Git terminology words
- Improved container proportions to prevent overlap

### 📱 Mobile Improvements
- Better touch targets for letter buttons
- Improved spacing and layout on mobile devices
- Enhanced responsive behavior for tablets and phones
- Better font scaling across different screen sizes

---

## [1.0.0] - 2025-09-23

### ✨ Initial Release
- Git-themed Hangman game with cyberpunk aesthetic
- Full-stack implementation with React frontend and FastAPI backend
- PostgreSQL database for game state and leaderboards
- Docker containerization for easy deployment
- Real-time game state management
- Scoring system and leaderboards
- Git terminology categories (GitHub, GIT commands, etc.)