# AI Pronunciation Trainer

A **Next.js** + **Tailwind CSS** + **TypeScript** frontend for practicing and improving pronunciation using AI-powered feedback.

## Features

- **Home** page with clear title and navigation buttons.
- **Practice** page:
  - Record your voice with a live waveform visualization.
  - Play back recordings.
  - Retry recordings or submit for AI feedback.
  - Mock AI feedback panel shows a score and pronunciation tips.
- **History** page:
  - Logs each attempt with timestamp, score, and feedback.
  - Replay past recordings.
  - Responsive design works.

## Tech Stack

- **Framework:** Next.js 
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State Management:** Zustand
- **Waveform:** WaveSurfer.js with Record plugin

## Project Structure

```
ai-pronunciation-trainer-ui/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts      # Mock analysis endpoint
│   │   ├── globals.css               # Tailwind imports & CSS variables
│   │   ├── layout.tsx                # Root layout with header
│   │   ├── page.tsx                  # Home page
│   │   ├── practice/page.tsx         # Practice page
│   │   └── history/page.tsx          # History page
│   ├── components/
│   │   ├── Header.tsx                # Nav header (buttons)
│   │   ├── AudioRecorder.tsx         # Recording UI & logic
│   │   ├── Waveform.tsx              # Live + static waveform
│   │   └── FeedbackPanel.tsx         # AI feedback display
│   └── attempts/
│       └── store.ts                  # Zustand store for attempts
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
└── README.md
```

## Setup & Development

1. **Clone the repo**

   ```bash
   git clone https://github.com/stephens0n-0x/ai-pronunciation-trainer-ui.git
   cd ai-pronunciation-trainer-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## Notes

- The `/api/analyze` endpoint is a mock that returns random scores & tips. Replace with your real AI service when ready.
- Currently, recordings are stored in memory (Zustand) and cleared on page reload. To persist, consider localStorage or a backend.


