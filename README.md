🌐 **Live Demo**: https://dearthfunk.github.io/philosobabel/dist

🌐 **Live Demo**: https://philosobabel.com/

# 📚 Philosobabel

A modern philosophy reference tool with integrated external data sources. Search philosophy terms, get definitions, and explore related concepts with external API integrations.

## ✨ Features

- **Real-time Search**: Type to search through philosophy terms
- **External Integrations**: Get definitions from Dictionary API, Wikipedia, and more
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Smart Caching**: Efficient API response caching
- **Related Terms**: Click on related terms to explore connections
- **Responsive Design**: Works on all devices

## 🚀 Usage

### Basic Search
1. **Type to search**: Enter any philosophy term in the search box
2. **Browse results**: See matching terms with their definitions
3. **Navigate with keyboard**: Use Tab, Enter, and arrow keys

### Integration Icons
Each term displays integration icons next to its title:
- **📖 Dictionary**: Focus to see detailed definitions with pronunciations, parts of speech, and examples
- **🌐 Wikipedia**: Focus to see Wikipedia summaries with links to full articles
- **More integrations**: Additional icons appear as integrations are added

### Keyboard Shortcuts
- **Tab**: Navigate between search box, integrations, and related terms
- **Enter/Space**: Activate focused element
- **Escape**: Close any open tooltip
- **Backspace** (with Quick Erase enabled): Clear entire search

### Settings Menu
Click the "⚙️ Menu" button to access:
- **Quick Erase**: Make Backspace clear the entire search
- **Save Settings**: Persist your preferences locally

## 🛠️ Installation & Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/dearthfunk/philosobabel.git
cd philosobabel

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Project Structure
```
src/
├── components/          # React components
│   ├── IntegrationTooltip.tsx
│   ├── TermResult.tsx
│   └── ...
├── integrations/        # External API integrations
│   ├── dictionaryIntegration.ts
│   ├── wikipediaIntegration.ts
│   └── ...
├── services/           # Core services
│   └── integrationManager.ts
├── types/              # TypeScript types
│   └── integrations.ts
└── ...
```

## 🔌 Adding New Integrations

### Step 1: Create Integration File
Create a new file in `src/integrations/yourIntegration.ts`:

```typescript
import { Integration, IntegrationData } from '../types/integrations';

const fetchYourData = async (word: string): Promise<IntegrationData> => {
  try {
    const response = await fetch(`https://api.example.com/${word}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fallbackMessage: `Failed to fetch data for "${word}"`
    };
  }
};

export const yourIntegration: Integration = {
  id: 'your-integration',
  name: 'Your Integration',
  icon: '🔍',
  description: 'Get data from your API',
  fetchData: fetchYourData,
  enabled: true
};
```

### Step 2: Register Integration
Add to `src/services/integrationManager.ts`:

```typescript
import { yourIntegration } from '../integrations/yourIntegration';

// In constructor:
this.registerIntegration(yourIntegration);
```

### Step 3: Add Custom Rendering (Optional)
In `src/components/IntegrationTooltip.tsx`, add custom rendering logic:

```typescript
// In renderContent() method:
if (integration.id === 'your-integration' && data.data) {
  const yourData = data.data;
  return (
    <div className="integration-tooltip-content">
      <div className="integration-tooltip-word">{yourData.title}</div>
      <div className="your-custom-content">{yourData.content}</div>
    </div>
  );
}
```

## 🎨 Customization

### Styling
- Main styles in `src/styles.css`
- Integration-specific styles use `.integration-tooltip-*` classes
- Follow existing patterns for consistency

### Configuration
- Integration settings in individual integration files
- Cache expiry and other settings in `IntegrationManager`
- User preferences saved in localStorage

## 🔧 API Integration Details

### Dictionary API
- **Source**: [Free Dictionary API](https://dictionaryapi.dev/)
- **Features**: Definitions, pronunciations, examples, synonyms
- **Rate Limits**: None specified
- **Caching**: 10-minute cache

### Wikipedia API
- **Source**: [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/)
- **Features**: Article summaries, links to full articles
- **Rate Limits**: Standard Wikipedia limits
- **Caching**: 10-minute cache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-integration`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add new integration'`
6. Push: `git push origin feature/new-integration`
7. Create a Pull Request

## 📝 License

This project is open source. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- Philosophy term definitions from various sources
- [Free Dictionary API](https://dictionaryapi.dev/) for definitions
- [Wikipedia](https://wikipedia.org/) for encyclopedic content
- All contributors and users
