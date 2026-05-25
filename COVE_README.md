# 🛍️ Cove - React Native E-Commerce App

A beautiful, fast, and clean e-commerce app built with React Native, TypeScript, and NativeWind.

## 📁 Project Structure

```
cove-app/
├── src/
│   ├── app/                 # Expo Router entry points
│   │   ├── _layout.tsx     # Root navigation layout
│   │   └── index.tsx       # Home screen entry
│   │
│   ├── screens/             # Screen components
│   │   ├── Splash.tsx       # Splash/Loading screen
│   │   ├── Login.tsx        # Login screen with email/password
│   │   ├── Home.tsx         # Product listing with categories
│   │   ├── ProductDetail.tsx # Product details page
│   │   ├── Profile.tsx      # User profile screen
│   │   ├── AddReview.tsx    # Add product review
│   │   ├── ReportDamage.tsx # Report damaged items
│   │   └── index.ts         # Export all screens
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Primary/Secondary buttons
│   │   ├── Input.tsx        # Text input field
│   │   ├── RatingStars.tsx  # Star rating component
│   │   ├── ProductCard.tsx  # Product card display
│   │   ├── CategoryBar.tsx  # Category filter bar
│   │   └── index.ts         # Export all components
│   │
│   ├── navigation/          # Navigation setup
│   │   └── Navigation.tsx   # Stack & Tab navigation config
│   │
│   ├── constants/           # App constants
│   │   ├── colors.ts        # Color palette
│   │   ├── sizes.ts         # Spacing & sizing
│   │   └── strings.ts       # UI text strings
│   │
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # Product, User, Review types
│   │
│   ├── data/                # Mock data
│   │   └── mockData.ts      # Sample products & categories
│   │
│   └── utils/               # Helper functions
│       └── (helpers.ts)     # Utility functions
│
├── assets/                  # Images & static files
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── COVE_README.md          # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
cd cove-app
npm install
```

### Running the App

**Web:**
```bash
npm run web
```
Opens the app in your browser at `http://localhost:8081`

**iOS:**
```bash
npm run ios
```
(Requires macOS)

**Android:**
```bash
npm run android
```
(Requires Android Studio/Emulator)

## 🎨 Screen Overview

### 1. **Splash Screen** (`Splash.tsx`)
- App logo and branding
- Auto-navigates to Login after 2 seconds

### 2. **Login Screen** (`Login.tsx`)
- Email and password input
- "Sign in" button
- Social login options (Apple, Google)
- Create account link

### 3. **Home/Discover Screen** (`Home.tsx`)
- Product grid (2 columns)
- Search bar for filtering
- Category filter tabs
- Spring sale banner
- "Trending now" section
- Product cards with ratings

### 4. **Product Detail Screen** (`ProductDetail.tsx`)
- Full product image
- Product name, category, rating
- Price and availability
- Free delivery badge
- Color & size selectors
- Add to bag button
- Write review option

### 5. **Profile Screen** (`Profile.tsx`)
- User avatar and info
- Stats (Orders, Wishlist, Purchases)
- Menu items:
  - My Orders
  - Wishlist
  - Addresses
  - Payment Methods
  - Report Damage
  - Returns
  - Notifications
- Sign out button

### 6. **Add Review Screen** (`AddReview.tsx`)
- Product info
- Star rating selector
- Review text input
- Tag selection (Quality, Value, etc.)
- Photo upload
- Post review button

### 7. **Report Damage Screen** (`ReportDamage.tsx`)
- Camera frame guide
- Photo/Video/Live options
- Upload from library option
- Take photo button

## 🎯 Key Features

### Clean Architecture
- **Separation of Concerns**: Screens, components, types, constants
- **Reusable Components**: Button, Input, RatingStars, ProductCard, CategoryBar
- **Type Safety**: Full TypeScript support with interfaces
- **Constants Management**: Centralized colors, sizes, and strings

### Styling
- **NativeWind**: Tailwind CSS-like styling for React Native
- **Consistent Design**: All colors and sizes defined in constants
- **Responsive Layouts**: Flexible designs that work on different screen sizes

### Navigation
- **Stack Navigation**: For detail views and flows
- **Tab Navigation**: Bottom tabs for main sections
- **Nested Navigation**: Deep linking support

### State Management
- **React Hooks**: useState for local component state
- **Mock Data**: Ready-to-use sample products and categories

## 📱 Color Palette

```typescript
- Primary: #FF6B5B (Coral Red)
- Secondary: #F5F5F5 (Light Gray)
- Text: #333333 (Dark Gray)
- Light Text: #999999 (Gray)
- Border: #E0E0E0 (Light Border)
- White: #FFFFFF
```

## 📦 Dependencies

**Core:**
- `react`: UI library
- `react-native`: Mobile framework
- `typescript`: Type safety
- `expo`: Development & deployment

**Navigation:**
- `@react-navigation/native`: Navigation foundation
- `@react-navigation/stack`: Stack navigation
- `@react-navigation/bottom-tabs`: Tab navigation
- `react-native-screens`: Screen management
- `react-native-safe-area-context`: Safe area handling

**Styling:**
- `nativewind`: Tailwind for React Native

**Utilities:**
- `axios`: API calls (ready for integration)

## 🔧 Customization

### Change Colors
Edit `src/constants/colors.ts`:
```typescript
export const COLORS = {
  primary: '#FF6B5B',  // Change this
  // ... more colors
};
```

### Change Typography
Edit `src/constants/sizes.ts`:
```typescript
fontSize: {
  xs: 12,
  sm: 14,
  base: 16,
  // ... add more sizes
}
```

### Add New Screens
1. Create screen file in `src/screens/`
2. Export from `src/screens/index.ts`
3. Add route to `src/navigation/Navigation.tsx`

### Add New Components
1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Use in screens

## 🚀 Next Steps

### Backend Integration
```typescript
// In your API calls, use axios from utils
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com/api',
});
```

### State Management (Optional)
For larger apps, consider:
- Redux Toolkit
- Zustand
- Context API with useReducer

### Database
- Firebase
- Supabase
- Custom REST API

### Testing
```bash
npm test
```

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Component Names**: PascalCase (e.g., `ProductCard`)
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case for folders, PascalCase for components

## 🐛 Troubleshooting

### Metro bundler errors
```bash
npm run reset-project
npm install
npm run web
```

### Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
npm run web
```

### TypeScript errors
```bash
npm run type-check
```

## 📚 Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind](https://www.nativewind.dev)

## 📄 License

MIT

---

**Built with ❤️ for fast development**
