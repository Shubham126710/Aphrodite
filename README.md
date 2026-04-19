<div align="center">
  <img src="public/logo.png" alt="Aphrodite Logo" width="256" />
  <h1 align="center">Aphrodite</h1>
  <p align="center">
    <strong>A modern, full-stack application built for connecting people.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## 📖 Overview

**Aphrodite** is a modern web application designed to bring people together. At its core, the project operates on the nostalgic principle of **FLAMES**—an acronym standing for **F**riends, **L**overs, **A**ffectionate, **M**arriage, **E**nemies, and **S**iblings. By reimagining this classic relationship-calculating algorithm for the modern web, Aphrodite connects individuals in playful and meaningful ways. It features a curated landing page and an integrated authentication system that allows users to sign up and establish their profiles.

The application boasts a highly responsive and visually appealing interface natively built using React, Vite, and Tailwind CSS.

## ✨ Features

- **FLAMES Algorithm**: The heart of the application, calculating romantic and plutonic compatibilities based on the timeless acronym (**F**riends, **L**overs, **A**ffectionate, **M**arriage, **E**nemies, **S**iblings).
- **User Authentication**: Secure user accounts and seamless registration powered by Supabase Auth.
- **Custom Profiles**: Extended user metadata handling for personalized experiences (including preferences like age, gender, algorithms, and avatars).
- **Responsive Design**: Fully optimized for desktop and mobile reading experiences with custom Tailwind grids.
- **Performant Frontend**: Built on Vite and React for lightning-fast module replacement and immediate renders.
- **Modern UI Elements**: Custom avatars, interactive form inputs, and sleek typography integration.

---

## 🛠 Tech Stack

This project is built using the latest features of the React ecosystem, focusing on performance and type safety.

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a strict spacing system
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)

### Project Structure

```bash
├── public/               # Static assets & logos
├── src/
│   ├── components/       # Reusable UI components & Auth sections
│   ├── lib/              # Utility functions & Supabase client
│   ├── App.tsx           # Main application scaffold & routing
│   └── index.css         # Global styles
├── tailwind.config.js    # Custom design token configuration
└── vite.config.ts        # Vite build configuration
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubham126710/Aphrodite.git
   cd Aphrodite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## 🚢 Deployment

You can deploy the app to any static hosting provider like Vercel, Netlify, or Cloudflare pages.

1. Push your code to a GitHub repository.
2. Connect your repository to your hosting provider.
3. Configure the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the deployment dashboard.
4. Deploy using the build command `npm run build`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Shubham Upadhyay</sub>
</div>
