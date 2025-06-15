# NetliFunk 🎛️

Welcome to **NetliFunk**! No, it's not a music streaming service for funky beats, and you won't find any disco balls here. This is just a backend project for my [React portfolio](https://github.com/Rakshit4045/Portfolio), because my lazy ass didn't get motivated enough to migrate to Next.js.

## 🤔 Why does this exist?

I wanted to add AI and backend features to my portfolio, but I was way too lazy to refactor everything into Next.js. So, I did what any reasonable developer would do: I spun up a Netlify Functions project and called it a day. 

## 🏷️ What's with the name?

"NetliFunk" is not a tribute to funk music (sorry, Bootsy Collins). It's just a mashup of "Netlify" and "function"—because naming things is hard, and I was feeling particularly uninspired.

## 🚀 What does it do?

- Provides serverless backend endpoints for my [React portfolio](https://github.com/Rakshit4045/Portfolio)
- Features an AI assistant powered by Gemini that can answer questions about my portfolio sections
- Handles AI-powered features (like skill matching and job description analysis)
- Lets me keep my beloved React codebase untouched by Next.js migration woes

## 🤖 AI Features & Gemini API

Most of the features in this project are AI-related and powered by the [Gemini API](https://ai.google.dev/). The best part? The Gemini API key is free (at least for now), so you can experiment without worrying about your wallet.

### Available AI Endpoints

1. **AI Assistant** (`/ai-assistant`): An intelligent assistant that can answer questions about different sections of my portfolio. It uses Gemini AI to provide contextual and accurate responses about my experience, projects, skills, and other portfolio sections.

2. **Job Description Analysis** (`/jd-analysis`): Analyzes job descriptions and matches them against my skills and experience.

### Setting up AI locally

If you want to use the AI features locally, you **must** create a `.env` file in the project root with the following environment variables:

```env
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL_NAME=gemini-2.0-flash
```

- `GEMINI_API_KEY`: Your Gemini API key (get it from Google AI Studio)
- `GEMINI_MODEL_NAME`: The Gemini model to use (e.g., `gemini-2.0-flash`)

This step is only needed if you want to utilize the AI functionality.

## 🛠️ How do I use it?

1. Deploy this folder as a Netlify Functions project.
2. Point your [React frontend](https://github.com/Rakshit4045/Portfolio) at these endpoints for all your AI and backend needs.
3. If you want to use AI features locally, set up your `.env` file as shown above.
4. Enjoy the sweet, sweet feeling of not having to migrate to Next.js.

## 🔮 Future Features

Right now, almost everything here is AI-powered. But who knows? Maybe one day I'll add some non-AI features too. (Don't hold your breath, though.)

## 📄 License

MIT. Because if you want to copy this lazy approach, be my guest. See the full [LICENSE](./LICENSE).

---

*Created out of equal parts necessity, laziness, and a complete lack of musical talent.*
