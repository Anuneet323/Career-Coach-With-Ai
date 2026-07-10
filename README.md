# 🧠 Career Coach with AI – Smart Career Guidance Platform

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Framework-Next.js-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![ShadcnUI](https://img.shields.io/badge/Components-Shadcn_UI-18181B?logo=shadcnui)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)
![NeonDB](https://img.shields.io/badge/Database-NeonDB-00E599?logo=postgresql&logoColor=white)
![Inngest](https://img.shields.io/badge/Jobs-Inngest-4C51BF?logo=serverless)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

An intelligent, full-stack **AI-powered career guidance web app** built with **React.js, Next.js, Prisma, and NeonDB**, styled beautifully using **Tailwind CSS** and **Shadcn UI**.  
This app acts as your **personal AI career mentor**, offering smart recommendations, career analysis, and growth insights in a conversational, user-friendly interface.

---

## 🚀 Overview

**Career Coach with AI** helps users discover the right career direction by combining **AI intelligence**, **modern design**, and **real-time data**.  
It analyzes user goals, suggests relevant skills, and provides career insights powered by AI models — all with a sleek, fast, and responsive UI.

Whether you’re a student exploring your options or a working professional planning your next step — this AI Coach has your back.

---

## ✨ Features

✅ **AI-Powered Recommendations** – Get tailored advice for career paths  
✅ **Skill Insights** – Understand your strengths and what to improve  
✅ **Interactive Chat Interface** – Conversational AI assistant powered by APIs  
✅ **Modern UI/UX** – Built with **Shadcn UI** and **Tailwind CSS**  
✅ **Realtime Task Scheduling** – Managed efficiently using **Inngest**  
✅ **Cloud Database** – Secure and scalable data management with **NeonDB**  
✅ **Fully Responsive** – Works beautifully on mobile, tablet, and desktop

---

## 🧩 Tech Stack

| Layer               | Technologies            |
| ------------------- | ----------------------- |
| **Frontend**        | React.js, Next.js       |
| **Styling**         | Tailwind CSS, Shadcn UI |
| **Backend**         | Next.js API Routes      |
| **Database**        | NeonDB (PostgreSQL)     |
| **ORM**             | Prisma                  |
| **Background Jobs** | Inngest                 |
| **AI Integration**  | OpenAI / Gemini API     |
| **Deployment**      | Vercel                  |

---

## 🧠 Architecture

Career-Coach-With-AI/
├── app/ # Next.js app routes & pages
├── components/ # Reusable UI components (Shadcn)
├── lib/ # Prisma, Inngest, and utility functions
├── prisma/ # Schema & migrations
├── public/ # Static assets
├── styles/ # Tailwind global styles
├── package.json
└── README.md

yaml
Copy code

---

## ⚙️ Getting Started

1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Anuneet323/Career-Coach-With-Ai.git
cd Career-Coach-With-Ai
2️⃣ Install Dependencies

bash
Copy code
npm install
3️⃣ Setup Environment Variables
Create a .env file with:

bash
Copy code
DATABASE_URL="your_neondb_connection_string"
GEMINI_API_KEY="your_gemini_key"
4️⃣ Run Prisma Migrations

bash
Copy code
If you are using the shared Neon database, run:

bash
Copy code
If Prisma shows P3005 on an existing database, baseline the migrations first:

bash
Copy code
npx prisma migrate resolve --applied 20250114060115_create_models
npx prisma migrate resolve --applied 20250114064152_update_user
npx prisma migrate resolve --applied 20250117091806_update
npx prisma migrate resolve --applied 20250120090020_hh
npx prisma migrate resolve --applied 20250120124732_update

Then deploy the migrations:

bash
Copy code
npx prisma migrate deploy

If you are creating a brand-new local database, you can use:

bash
Copy code
npx prisma migrate dev
5️⃣ Start the Development Server

bash
Copy code
npm run dev
Then open http://localhost:3000

🌍 Live Demo
🔗 Live Site: https://career-coach-ai.vercel.app
(Replace this with your actual Vercel link once deployed.)

📈 Future Enhancements
🤖 Integrate personalized resume & skill analysis

🧭 Add roadmap generator for learning paths

📊 Include dashboards for career growth tracking

💬 Enable multiple AI personalities (Career Expert, Mentor, HR Advisor)

👨‍💻 Author
Anuneet Singh Chauhan
🎓 B.Tech CSE (IoT Specialization)
💻 Full Stack Developer | AI + Web Systems Enthusiast
🔗 GitHub | LinkedIn

🪪 License
This project is licensed under the MIT License

```
