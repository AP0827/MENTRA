# 🧠 Mentra - Mindful Digital Wellness Frontend

An AI-powered browser extension frontend for mindful productivity and focus management. Built with Next.js, TypeScript, and beautiful animations.

![Mentra Banner](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics**: Focus time, distractions avoided, streak counter, and productivity score
- **Focus Activity Visualization**: View your focus intervals throughout the day
- **AI-Powered Insights**: Personalized recommendations based on your behavior
- **Recent Reflections**: Quick access to your latest interactions with Mentra

### 📈 Analytics
- **Weekly Focus Overview**: Bar charts showing focus vs distracted time
- **Productivity Trends**: Area charts tracking your improvement over time
- **Website Distribution**: Pie chart showing where distractions come from
- **Peak Hours Analysis**: Identify when you're most likely to get distracted
- **Time Range Filters**: View data by week, month, or year

### 💭 Reflections
- **Complete History**: Browse all your reflections with AI responses
- **Smart Search**: Find specific reflections by content or website
- **Filtering Options**: Filter by helpful/not helpful ratings
- **Feedback System**: Rate AI suggestions to improve personalization
- **Export Capability**: Download your reflection data

### ⚙️ Settings
- **Website Management**: Add/remove monitored websites
- **AI Configuration**: Choose between cloud (GPT-4) or local (Ollama) AI
- **Privacy Controls**: Enable/disable notifications and cloud sync
- **Data Management**: Export, clear, or delete your data
- **Security**: AES-GCM encryption for all local data

### 🎯 Reflection Popup
- **Intervention Modal**: Appears when visiting distracting sites
- **Reflection Capture**: Prompts users to explain their intention
- **AI Guidance**: Provides context-aware suggestions
- **Feedback Loop**: Rate AI responses to improve personalization
- **User Control**: Choose to proceed or return to work

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Navigate to the extension folder:
```bash
cd extension
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
extension/
├── app/
│   ├── page.tsx              # Dashboard (main page)
│   ├── analytics/
│   │   └── page.tsx          # Analytics page with charts
│   ├── reflections/
│   │   └── page.tsx          # Reflections history
│   ├── settings/
│   │   └── page.tsx          # Settings and configuration
│   ├── popup/
│   │   └── page.tsx          # Demo for reflection popup
│   ├── layout.tsx            # Root layout with sidebar
│   └── globals.css           # Global styles and theme
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── StatCard.tsx          # Reusable stat card component
│   ├── ReflectionCard.tsx    # Reflection display component
│   └── ReflectionPopup.tsx   # Modal for site interventions
├── public/                   # Static assets
└── package.json              # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#7c3aed) - Focus and mindfulness
- **Accent**: Pink (#ec4899) - Energy and engagement
- **Success**: Green (#16a34a) - Positive reinforcement
- **Warning**: Orange (#f59e0b) - Alerts
- **Danger**: Red (#ef4444) - Critical actions

### Typography
- **Font**: Geist Sans (primary), Geist Mono (code)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, comfortable line height

### Animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Hover Effects**: Scale and color transitions
- **Loading States**: Spinners and skeleton screens

## 📊 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Pages

### Dashboard (/)
The main landing page showing today's focus summary, recent statistics, and latest reflections.

### Analytics (/analytics)
Detailed charts and insights into your digital behavior patterns.

### Reflections (/reflections)
Complete history of all your reflections with search and filter capabilities.

### Settings (/settings)
Configuration for monitored websites, AI model, privacy, and data management.

### Popup Demo (/popup)
Demonstration of the reflection popup modal (shown outside main layout).

## 🔐 Privacy & Security

- **Local-First**: All data stored locally using IndexedDB
- **Encryption**: AES-GCM encryption for sensitive data
- **No Tracking**: Zero telemetry or analytics collection
- **User Control**: Full data export and deletion capabilities
- **Transparency**: Open about what data is collected and why

## 🎭 Screenshots

Visit the following pages to see the UI:
- Dashboard: `http://localhost:3000/`
- Analytics: `http://localhost:3000/analytics`
- Reflections: `http://localhost:3000/reflections`
- Settings: `http://localhost:3000/settings`
- Popup Demo: `http://localhost:3000/popup`

## 🚧 Future Enhancements

- [ ] Real backend integration with Chrome Extension APIs
- [ ] RAG-based personalization system
- [ ] Vector database integration (Chroma)
- [ ] Advanced behavioral analytics
- [ ] Mobile responsive optimization
- [ ] Dark mode persistence
- [ ] Multi-language support
- [ ] Goal setting and tracking
- [ ] Social features (optional)
- [ ] Browser extension packaging

## 📝 Notes

- This is the **frontend-only** implementation
- Mock data is used for demonstration
- Backend integration points are marked with comments
- Chrome Extension APIs will be integrated in the extension version
- All animations and interactions are production-ready

## 🤝 Contributing

This is a college project developed as part of the Information Science and Engineering curriculum (AY 2025-26).

## 📄 License

This project is developed as part of an academic requirement.

---

**Built with ❤️ for mindful digital wellness**

*Empowering users through self-awareness, not restriction*
