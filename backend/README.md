# Mentra Backend

Intelligent Distraction Blocking Extension Backend - A Node.js API server that powers AI-driven personalized coaching for digital wellness.

## 🚀 Overview

Mentra is an intelligent distraction blocking system that combines browser extension technology with advanced AI to help users build healthier digital habits. The backend provides a thin AI orchestration layer that generates personalized coaching suggestions while maintaining strict user privacy through local-first data storage.

### Key Features

- **Local-First Privacy**: User reflections and browsing data never leave the device
- **AI-Powered Coaching**: Personalized suggestions using RAG (Retrieval-Augmented Generation)
- **Embedding Generation**: Server-side vector embeddings for semantic search
- **Optimized Prompts**: Token-efficient AI prompts focused on habit formation
- **RESTful API**: Clean, documented endpoints for extension integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   Mentra        │    │   OpenAI        │
│  Extension      │◄──►│   Backend       │◄──►│   API           │
│                 │    │   (Node.js)     │    │                 │
│ • IndexedDB     │    │ • Embeddings    │    │ • GPT-4         │
│ • Reflections   │    │ • RAG           │    │ • Embeddings    │
│ • Cosine Search │    │ • Prompts       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Extension** detects navigation to distracting sites
2. **User** reflects on their motivation
3. **Extension** generates embeddings and retrieves similar past reflections
4. **Backend** receives current reflection + context + retrieved memories
5. **AI** generates personalized coaching suggestion
6. **Extension** displays suggestion to guide user behavior

## 📋 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### POST /embed
Generate embeddings for text input.

**Request:**
```json
{
  "text": "I feel stressed and need a break"
}
```

**Response:**
```json
{
  "ok": true,
  "embedding": [0.123, 0.456, ...]
}
```

#### POST /rag
Generate personalized AI coaching suggestions using RAG.

**Request:**
```json
{
  "text": "I feel stressed and need a break",
  "question": "Why are you opening this site?",
  "memories": [
    "Past: Felt overwhelmed during work deadlines",
    "Past: Used deep breathing to calm down"
  ]
}
```

**Response:**
```json
{
  "ok": true,
  "suggestion": "I understand feeling overwhelmed. Your pattern shows stress often leads to distraction-seeking. Try: Set a 5-minute timer for focused work, then reward yourself with a short walk. Or create an 'if-then' plan: 'If I feel stressed, then I'll do 2 minutes of deep breathing first.'",
  "metadata": {
    "promptUsed": "..."
  }
}
```

#### POST /prompts
Retrieve prompt templates (for development/debugging).

**Response:**
```json
{
  "ok": true,
  "prompt": {
    "id": "reflection_v1",
    "system": "You are an empathetic productivity coach...",
    "template": "Question asked: {question}\n\nUser's response: \"{text}\"\n\n..."
  }
}
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and navigate:**
   ```bash
   cd mentra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

### Testing

Test the API endpoints:

```bash
# Test embeddings
curl -X POST http://localhost:3000/api/v1/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Test reflection"}'

# Test RAG
curl -X POST http://localhost:3000/api/v1/rag \
  -H "Content-Type: application/json" \
  -d '{"text": "Test", "question": "Why?", "memories": ["Past: Test"]}'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI services | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 3000) | No |

### Prompt Customization

Prompts are stored in `src/docs/prompts/prompts.json`. The system supports multiple prompt versions for A/B testing and optimization.

Current prompt focuses on:
- Habit formation techniques
- Evidence-based improvement methods
- Token efficiency (< 100 words)
- Sustainable behavior change

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📊 Performance & Privacy

### Privacy First
- **Zero data storage**: No user reflections or personal data stored on server
- **Local processing**: Embeddings and similarity search happen client-side
- **Minimal API surface**: Only necessary data transmitted for AI generation

### Performance Optimizations
- Token-efficient prompts reduce API costs
- Streaming responses for better UX
- Cached prompt templates
- Optimized embedding dimensions

## 🧪 Testing Strategy

```bash
# Run tests
npm test

# Run with coverage
npm run coverage

# Lint code
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- AI powered by [OpenAI](https://openai.com/)
- Inspired by research in behavioral psychology and habit formation

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the [documentation](./docs/) folder
- Review the [API docs](#api-documentation)

---

**Mentra**: Building healthier digital habits, one mindful moment at a time.
