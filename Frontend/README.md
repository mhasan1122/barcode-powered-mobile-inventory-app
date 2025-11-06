# Barcode-Driven Inventory System - Frontend

A modern, responsive React Native Android app for inventory management using barcode scanning and Kanban-style board visualization.

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard.js   # Product display card
│   │   ├── CategoryColumn.js # Kanban column component
│   │   ├── SearchBar.js     # Search input component
│   │   └── CategoryModal.js # Modal for creating categories
│   │
│   ├── screens/            # Main app screens
│   │   ├── ScannerScreen.js    # Barcode scanning screen
│   │   ├── KanbanScreen.js     # Kanban board screen
│   │   ├── SearchScreen.js     # Product search screen
│   │   └── AnalyticsScreen.js  # Analytics dashboard
│   │
│   ├── navigation/         # Navigation configuration
│   │   └── TabNavigator.js # Bottom tab navigator
│   │
│   ├── constants/          # App constants and theme
│   │   ├── theme.js       # Color palette, sizes, fonts
│   │   └── index.js       # API URLs and other constants
│   │
│   └── utils/             # Utility functions
│       ├── helpers.js     # Helper functions (formatting, validation)
│       └── storage.js     # Local storage utilities (AsyncStorage)
│
├── assets/                # Images, icons, fonts
├── App.js                 # Root component
├── index.js               # Entry point
└── package.json           # Dependencies

```

## 🎨 Design Features

- **Modern UI**: Clean, minimalist design with consistent color scheme
- **Responsive Layout**: Works smoothly across different Android screen sizes
- **Tab Navigation**: Easy access to all features via bottom tab bar
- **Kanban Board**: Visual drag-and-drop inventory management
- **Real-time Updates**: Instant UI updates after actions

## 📱 Screens

### 1. Scanner Screen
- Camera-based barcode scanning
- Real-time barcode detection
- Product details fetching (ready for backend integration)
- Camera permission handling

### 2. Kanban Board Screen
- Horizontal scrollable columns for categories
- Product cards with drag-and-drop support
- Create new categories dynamically
- Move products between categories
- Product count badges

### 3. Search Screen
- Full-text search across products
- Filter by name, barcode, category, or description
- Real-time search results
- Empty state handling

### 4. Analytics Screen
- Total products and categories count
- Products distribution by category
- Recent products list
- Visual progress bars and statistics

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Tab navigation
- **Expo Camera** - Barcode scanning
- **Expo Vector Icons** - Icon library
- **AsyncStorage** - Local data persistence
- **React Native Gesture Handler** - Touch gestures
- **React Native Reanimated** - Smooth animations

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android:
```bash
npm run android
```

## 🔌 Backend Integration (Ready)

The app is structured to easily integrate with the backend API:

- **API Base URL**: `https://assessment.shwapno.app/product`
- **Storage**: Currently uses AsyncStorage (will be replaced with API calls)
- **Product Model**: Ready for backend data structure

### Integration Points:

1. **ScannerScreen.js** (line ~40): Replace mock API call with actual fetch
2. **storage.js**: Replace AsyncStorage with API service calls
3. **KanbanScreen.js**: Update product management to use API endpoints

## 🎯 Key Components

### ProductCard
Displays product information with:
- Product image (or placeholder)
- Name, barcode, price
- Description and date
- Drag handle for reordering

### CategoryColumn
Kanban column component with:
- Category header with color indicator
- Product count badge
- Scrollable product list
- Empty state handling

### SearchBar
Search input with:
- Search icon
- Clear button
- Real-time filtering

## 🎨 Theme System

All colors, sizes, and styles are centralized in `src/constants/theme.js`:
- Consistent color palette
- Standardized spacing and sizes
- Reusable shadow styles
- Easy theme customization

## 📝 Notes

- **No Backend Yet**: Currently uses AsyncStorage for data persistence
- **Mock Data**: Scanner screen uses mock API responses (ready for backend)
- **Drag & Drop**: Kanban board supports product movement (UI ready)
- **Responsive**: All components adapt to different screen sizes

## 🚀 Next Steps

1. Integrate backend API endpoints
2. Replace AsyncStorage with API calls
3. Add authentication (if needed)
4. Enhance drag-and-drop functionality
5. Add product editing capabilities
6. Implement image upload for products

