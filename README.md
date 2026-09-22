# ✍️ WriteMyWords — Academic Writing & Project Collaboration Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.26.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**WriteMyWords** is a secure, modern, full-stack React web application designed to connect students with verified academic writers, researchers, and subject-matter experts. Built with React 18, Vite, Supabase Authentication, and a hardened PostgreSQL database with Row Level Security (RLS).

---

## 🚀 Key Features

### 🎓 For Students
- **Interactive Request Wizard**: Multi-step project creation workflow with smart category selection, academic level picker, custom budget ranges, and deadline parameters.
- **Real-Time Student Dashboard**: Track posted requests, view project statuses, edit requirements, and manage academic submissions.
- **Privacy & Data Protection**: Student contact details (email, WhatsApp) are strictly shielded from public directories and only accessible by authorized parties.

### 💼 For Experts & Academic Writers
- **Marketplace & Public Directory**: Browse student requests with filters for academic level, category, subject area, and budget tier.
- **Detailed Request Inspection**: View comprehensive assignment briefs, word counts, formatting requirements, and deadlines.
- **Expert Dashboard**: Dedicated interface for managing bids, active consultations, and communication.

### 🛡️ Enterprise-Grade Security & Privacy
- **Supabase Authentication**: Real email/password user authentication with email confirmation, secure token callbacks, and automatic session persistence.
- **Row Level Security (RLS)**: Fine-grained PostgreSQL RLS policies guarantee users can only read, update, or delete their own data.
- **Public View Isolation**: Publicly browseable views (`requests_public`) deliberately omit `user_id` and sensitive student contact records at the database level.
- **Strict Database Validation Constraints**: PostgreSQL regex and length checks reject malicious or malformed payloads regardless of client-side validation.
- **Anti-Bot Protections**: Integrated honeypot fields on signup and idempotent in-flight state buttons to prevent spam.
- **HTTP Security Headers**: Pre-configured Content Security Policy (CSP), HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer Policy for Vercel and Netlify deployments.

### 📧 Branded Responsive Email Templates
- Custom, mobile-optimized HTML email templates for **Email Verification / Signup Confirmation** and **Password Resets**.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 (SPA) |
| **Build Tooling** | Vite 5, ES Modules |
| **Routing** | React Router DOM v6 |
| **Backend / BaaS** | Supabase (Auth, PostgreSQL DB, Realtime) |
| **Security Layer** | Supabase RLS Policies, PostgreSQL Check Constraints, CSP Headers |
| **Styling** | Custom Vanilla CSS Design System (Glassmorphism, Dark/Light palettes, Micro-animations) |
| **Deployment** | Vercel / Netlify with custom security headers |

---

## 📁 Project Structure

```text
writemywords/
├── email_templates/           # Branded HTML email templates for Supabase
│   ├── confirm_signup.html    # Email verification template
│   └── reset_password.html    # Password reset template
├── public/                    # Static assets & platform headers
│   └── _headers               # Netlify HTTP security headers
├── src/
│   ├── components/            # Reusable UI components (Nav, Footer, RequestCard, etc.)
│   ├── context/               # Global state & AppContext (Auth session, Profiles, Requests)
│   ├── lib/                   # Supabase client singleton & API helper functions
│   ├── pages/                 # Application routes & views
│   │   ├── AuthCallback.jsx   # Handles email verification & OAuth redirects
│   │   ├── ExpertDashboard.jsx# Expert writer dashboard
│   │   ├── Home.jsx           # Landing page with hero, features & testimonials
│   │   ├── Login.jsx          # User login with auth validation
│   │   ├── RequestWizard.jsx  # Multi-step assignment posting wizard
│   │   ├── RequestsDirectory.jsx # Public browseable assignment directory
│   │   ├── Signup.jsx         # User registration (Student / Expert)
│   │   ├── StaticPages.jsx    # About, Terms, Privacy, FAQ, Contact
│   │   └── StudentDashboard.jsx # Student project management dashboard
│   ├── App.jsx                # Main route configuration
│   ├── index.css              # Global design system, typography & tokens
│   └── main.jsx               # Application root
├── .env.example               # Example environment variables template
├── .gitignore                 # Excludes node_modules, dist, and .env files
├── index.html                 # HTML entry point with metadata & Google Fonts
├── package.json               # Dependencies and scripts
├── SUPABASE_EMAIL_GUIDE.md    # Guide to configuring custom email templates in Supabase
├── vercel.json                # Vercel deployment configuration & security headers
├── vite.config.js             # Vite configuration
└── writemywords_schema.sql    # PostgreSQL schema with tables, RLS & views
```

---

## 🚦 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** / **pnpm**
- A free [Supabase](https://supabase.com) account

### 2. Clone the Repository
```bash
git clone https://github.com/LotusnLithium/WriteMyWords.git
cd WriteMyWords
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory by copying the sample:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Initialize the Database
1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard)** → Choose your project.
2. Navigate to the **SQL Editor** tab.
3. Click **New query**, paste the entire contents of [`writemywords_schema.sql`](writemywords_schema.sql), and click **Run**.
4. This will create:
   - `profiles` table (with RLS policies and validation constraints)
   - `requests` table (tied to user ownership)
   - `requests_public` view (safe sanitized view for public browsing)

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📬 Email Templates Configuration

To use the custom branded email templates:
1. In Supabase Dashboard, go to **Authentication** → **Email Templates**.
2. **Confirm Signup**: Paste HTML from [`email_templates/confirm_signup.html`](email_templates/confirm_signup.html).
3. **Reset Password**: Paste HTML from [`email_templates/reset_password.html`](email_templates/reset_password.html).
4. Under **Authentication** → **URL Configuration**, add your redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://your-production-domain.vercel.app/auth/callback`

*(For full step-by-step guidance, refer to [SUPABASE_EMAIL_GUIDE.md](SUPABASE_EMAIL_GUIDE.md))*

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to **Environment Variables** in Vercel.
4. Deploy! `vercel.json` will automatically apply the security headers and single-page application (SPA) rewrites.

### Deploying to Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Set build command: `npm run build` and publish directory: `dist`.
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy! `public/_headers` will automatically configure security headers.

---

## 🔒 Security Summary

- 🔑 **No Secrets in Frontend**: Only the public anonymous key is used client-side; the `service_role` secret is never included.
- 🛡️ **PostgreSQL RLS**: Data access is verified on every request using Supabase auth tokens (`auth.uid()`).
- 🧹 **Zero PII Exposure**: Public browsing endpoints use SQL views that omit private contact data.
- 🌐 **Strict Headers**: HSTS, CSP, and clickjacking protection configured via `vercel.json` and `_headers`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).