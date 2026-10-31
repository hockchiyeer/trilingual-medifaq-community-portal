# MediFAQ — Online Medical Knowledge & Community Health Portal

**MediFAQ** (`trilingual-medifaq-community-portal`) is an open, community-oriented health literacy portal designed to make reliable medical information easily accessible to everyone. Built with a focus on Malaysian public health needs, the platform combines a **doctor-verified medical FAQ database**, an **interactive health discussion board**, a **private messaging system**, and a **robust administration center** — all accessible in **English**, **华语 (Chinese)**, and **Bahasa Melayu**.

Whether you are looking for trusted answers regarding common symptoms, seeking peer support on topics like quitting smoking, or managing patient education content, MediFAQ provides an intuitive, accessible experience across mobile and desktop devices. The application is designed to be **fully self-sustaining on a local machine** using a local PostgreSQL database with complete CRUD persistence.

---

## 🎯 Key Features at a Glance

### 1. 🌐 Trilingual Accessibility
* **Instant Language Toggle**: Switch seamlessly between **English**, **Chinese (中文)**, and **Bahasa Melayu** with a single click. Language selection persists across browser sessions (`localStorage`) and automatically synchronizes the document language attribute (`<html lang="en">`, `zh-Hans`, `ms`).
* **CJK Typographic Optimization**: Native font fallbacks (`Noto Sans SC`, `PingFang SC`, `Microsoft YaHei`) and tailored heading letter-spacing for CJK readability.
* **Culturally Relevant Health Topics**: Content covers localized health challenges in Malaysia, including haze season allergies, tropical hydration, dengue awareness, and national smoking cessation resources (such as MOH mQuit clinics).
* **WCAG AA Compliance**: Built-in accessibility bar providing dynamic font-size scaling (`A-`, `A`, `A+`), a one-click **High Contrast Mode**, keyboard navigation support, and a `Skip to content` shortcut.

---

### 2. 🩺 Verified Medical Knowledge FAQ Database
* **Structured Health Disciplines**:
  * **Dental Hygiene**: Gum care, tooth decay, oral hygiene practices.
  * **Diseases & Disorders**: Asthma, seasonal allergies, diabetes screening, breast lumps, cardiovascular health, migraine.
  * **General Practice**: Epistaxis (nosebleeds), eye irritation, acne, first aid.
  * **Healthy Lifestyle**: Evidence-based quit-smoking regimens, balanced nutrition, daily exercise.
  * **Men's Health**: Prostate wellness, cardiovascular risk factors.
  * **Pediatrician**: Infant care, childhood immunizations, developmental milestones.
  * **Pharmacy & Medications**: Vitamin dosage guidelines, antibiotics misuse awareness, proper disposal of expired medications, complementary supplements.
  * **Women's Health**: Maternal care, self-breast examinations, preventive screening.
* **Doctor-Attributed Answers**: Clinical explanations include verified professional healthcare attributions (`Verified Medical Officer`), structured action steps, and creation timestamps.
* **Utilities**: One-click **Print** and **Share** options on every medical answer modal.
* **Real-Time Click Tracking**: Every FAQ keeps count of community views to highlight frequently referenced topics, persisted directly in PostgreSQL.

---

### 3. 🔍 Dual Search Engines
* **FAQ Knowledge Search**:
  * Search questions or answers with instant keyword matching.
  * Filter by topic category or search across all medical disciplines at once.
  * Results display total match count and direct links to full answers.
* **Community Forum Search**:
  * Search by **Topic Subject**, **Post Content**, or **Member Directory**.
  * Member search returns comprehensive profiles, join dates, post statistics, and direct links to each member's latest discussion contribution.

---

### 4. 💬 Community Health Discussion Board
* **Safe, Moderated Discussions**: Public visitors can read discussions, while registered members can exchange experiences, seek advice, and reply to threads.
* **Guest Shield**: Non-logged-in visitors receive clear prompts indicating they must sign in or register before replying, protecting the community from spam.
* **Thread Management**:
  * Author attribution card showing user rank, total posts, and timestamp.
  * Topic priority flags: *Normal Priority*, *High Priority*, and *Low Priority*.
  * Built-in tools: **Quote** post into reply, view user **Profile**, and send **PM** (Private Message).
* **Author-Only Editing**: Members can edit or delete their own posts at any time, while moderators and administrators have global moderation privileges.

---

### 5. 📬 Private Messaging & User Accounts
* **Header User Profile Menu & Quick Logout**:
  * Top-right header avatar dropdown displaying active username, role badge, quick links to **Member Control Panel** and **Administration Board**, and a one-click **Log Out** option across all locales (EN, ZH, BM).
  * Fast keyboard login submission: Pressing `[Enter]` on username or password fields immediately submits the login form.
* **Member Control Panel**:
  * Profile customization (Full Name, Address, Personal Homepage, Biography, Forum Signature).
  * Privacy controls: Option to keep email private from other members.
  * Self-service password change.
  * Simulated email password recovery.
* **Private Message (PM) Center**:
  * Dedicated member inbox showing unread message badges.
  * Compose new messages to any member by username.
  * Direct one-click reply and delete options with persistent PostgreSQL storage.

---

### 6. 🛡️ Role-Based Administration Center
Users with administrator privileges gain access to a dedicated **Administration Board** containing five management modules:

1. **FAQ Content Administration**: Add new main medical categories, create subcategories, rename existing topics, and adjust list display order.
2. **Discussion Forum Administration**: Create and manage forum boards and topic categories.
3. **Mass Email Announcements**: Broadcast system-wide email announcements to all registered community members.
4. **Membership & Access Management**:
   * Inspect all registered members, their join dates, activity history, and post counts.
   * Assign access levels (see [Membership Access Levels](#-membership-access-levels)): **No Admin Rights (Level 0)**, **Moderator (Level 1)**, or **Administrator (Level 3)**. Labels follow the active language (EN / 华语 / BM).
   * Manage accounts with options to edit member profiles, exclude/cancel membership, or purge all posts by a specific user.
5. **Feedback Message Center**: Read, filter, and respond to incoming user suggestions, compliments, or service complaints submitted through the public feedback form.

---

## 🪪 Membership Access Levels

Access levels are stored as numbers in `users.admin_level` and mirrored by the `role` field. The values are **0 / 1 / 3** by design (Level 2 is intentionally unassigned and reserved for a future tier), so they must not be renumbered without a data migration. The hierarchy is defined once in `src/accessLevels.ts` and shared by the UI (`App.tsx`) and the API (`server.ts`).

| Level | Role value | EN | 华语 | BM |
| :---: | :--- | :--- | :--- | :--- |
| 0 | `user` | Standard Member / No Admin Rights | 普通会员 / 无管理权限 | Ahli Biasa / Tiada Hak Pentadbir |
| 1 | `moderator` | Doctor / Moderator | 医生 / 版主 | Doktor / Moderator |
| 3 | `admin` | Administrator | 管理员 | Pentadbir |

Badges and tables render as e.g. `Administrator (Level 3)`, `管理员 (级别 3)` or `Pentadbir (Tahap 3)`. Translation keys: `administratorRole`, `doctorRole`, `standardMemberRole`, `levelWord`, `accessLevelNone`, `accessLevelModerator`, `accessLevelAdministrator`, `chooseAdminLevel`.

---

## 👥 Pre-Configured Demo Accounts

The application includes generic sample accounts representing different user roles to allow immediate testing:

| Role | Username | Password | Access Level | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Super Administrator** | `admin` | `admin` | Level 3 | Full access to Admin Board, category manager, member manager, and broadcast email |
| **Doctor / Moderator** | `dr_lee` | `doc123` | Level 1 | Healthcare professional profile; forum moderation and content review |
| **Active Member** | `member_tan` | `tan123` | Level 0 | Regular community member participating in the Quit Smoking forum |
| **Community Member** | `user_azman` | `azman123` | Level 0 | Standard registered user with private messaging access |
| **New Test User** | `demo` | `demo` | Level 0 | Fresh test account |

*Visitors can also click **New Member Registration** from the sidebar to create their own accounts.*

---

## 💻 Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build System**: [Vite 8](https://vitejs.dev/) with Fast Refresh
* **Full-Stack Backend**: [Express 4](https://expressjs.com/) with native TypeScript (`tsx`)
* **Database**: [PostgreSQL](https://www.postgresql.org/) (runs natively or via Docker)
* **Object Relational Mapper**: [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
* **Type Safety**: [TypeScript](https://www.typescriptlang.org/) (ES2022 target)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Typography**:
  * **Headings**: `Fraunces` (Editorial serif)
  * **Body**: `Inter` (Optimized readability)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🐘 Local PostgreSQL Database Setup Guide (Self-Sustaining)

This application is designed to be **entirely self-sustaining on your local machine** using a standard PostgreSQL database instance. You do not need any external cloud database to run all features.

### Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (Tri-lingual UI, FAQ Search, Forum, Admin Panel)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express Full-Stack Server                │
│    (Port 3000: serves /api/* endpoints + Vite assets)  │
└───────────────────────────┬────────────────────────────┘
                            │ Drizzle ORM (node-postgres)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Local PostgreSQL Database                │
│      (Port 5432: users, faqs, topics, posts, etc.)     │
└────────────────────────────────────────────────────────┘
```

---

### Step 1: Install & Start PostgreSQL Locally

Choose **either** Option A (Docker, recommended for zero setup) or Option B (Native OS installation).

#### Option A: Using Docker Compose (Quickest & Easiest)

If you have [Docker Desktop](https://www.docker.com/) installed, the repository includes a pre-configured `docker-compose.yml`. In your terminal, run:

```bash
docker compose up -d
```

This starts a lightweight PostgreSQL 16 container on port `5432` with:
* Database: `medifaq`
* User: `postgres`
* Password: `postgres_password`
* Host: `127.0.0.1`

To check the container status:
```bash
docker ps
```

---

#### Option B: Native OS Installation

If you prefer installing PostgreSQL directly on your operating system:

##### macOS (via Homebrew)
```bash
# 1. Install PostgreSQL
brew install postgresql@16

# 2. Start PostgreSQL background service
brew services start postgresql@16

# 3. Create the medifaq database
createdb medifaq
```

##### Ubuntu / Debian Linux
```bash
# 1. Install PostgreSQL and client tools
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# 2. Ensure the service is running
sudo systemctl enable --now postgresql

# 3. Switch to postgres user and set password / create database
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_postgres_password';"
sudo -u postgres createdb medifaq
```

##### Windows
1. Download the official installer from [PostgreSQL Official Downloads](https://www.postgresql.org/download/windows/) (or run `choco install postgresql` via Chocolatey).
2. During installation, set a password for the `postgres` superuser (e.g., `postgres_password`) and keep the default port `5432`.
3. Open the **SQL Shell (psql)** or **pgAdmin 4** and run:
   ```sql
   CREATE DATABASE medifaq;
   ```

---

### Step 2: Configure Environment Variables

Create your local `.env` configuration file by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` in your text editor and ensure the PostgreSQL connection parameters match your local setup:

```env
# Full-Stack Server Port
PORT="3000"

# Local PostgreSQL Configuration
SQL_HOST="127.0.0.1"
SQL_PORT="5432"
SQL_DB_NAME="medifaq"
SQL_USER="postgres"
SQL_PASSWORD="postgres_password"

# Credentials for Drizzle schema management (can be the same as SQL_USER)
SQL_ADMIN_USER="postgres"
SQL_ADMIN_PASSWORD="postgres_password"
```

| Variable | Description | Default for Local Dev |
| :--- | :--- | :--- |
| `SQL_HOST` | IP address or hostname of PostgreSQL | `127.0.0.1` or `localhost` |
| `SQL_PORT` | Listening port for PostgreSQL | `5432` |
| `SQL_DB_NAME` | Database name | `medifaq` |
| `SQL_USER` | Application database username | `postgres` (or your custom user) |
| `SQL_PASSWORD` | Application database password | Your chosen password |
| `SQL_ADMIN_USER` | Drizzle Kit migration user | Same as `SQL_USER` |
| `SQL_ADMIN_PASSWORD` | Drizzle Kit migration password | Same as `SQL_PASSWORD` |
| `PORT` | Local web application port | `3000` |

---

### Step 3: Push Database Schema (Create Tables)

MediFAQ uses **Drizzle ORM** with declarative TypeScript schemas in `src/db/schema.ts`. Run the following command to automatically create all relational tables, primary keys, and foreign keys in your local database:

```bash
npm run db:push
```

This creates the following tables:
1. `categories` — 8 main medical disciplines with trilingual names and metadata.
2. `subcategories` — 25 clinical subtopics.
3. `faqs` — Doctor-verified questions, answers, click counts, and timestamps.
4. `users` — Member profiles, authentication credentials, roles, and administrative levels.
5. `forum_topics` — Discussion board threads with priorities and reply counters.
6. `forum_posts` — Individual thread replies and member contributions.
7. `feedbacks` — User feedback messages (suggestions, complaints, compliments).
8. `private_messages` — Member-to-member direct private messaging.

---

### Step 4: Seed Initial Clinical Data & Demo Accounts

Populate the database with all default medical knowledge FAQs, discussion threads, feedback inbox items, and test accounts:

```bash
npm run db:seed
```

You will see confirmation logs in your terminal:
```
Seeding local PostgreSQL database...
✓ Categories seeded
✓ Subcategories seeded
✓ Users seeded
✓ FAQs seeded
✓ Forum Topics seeded
✓ Forum Posts seeded
✓ Feedbacks seeded
✓ Private Messages seeded
Database seeding finished successfully!
```

---

### Step 5: Start the Full-Stack Application

Launch the development server:

```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

The Express server boots up on port `3000`, establishes connection pooling with your local PostgreSQL database, and mounts Vite for instant frontend development.

---

## 📬 User Feedback Routing & Email Notifications

When visitors submit feedback via the public form (`/feedback`), the portal processes the submission through multiple synchronized channels:

1. **Persistent PostgreSQL Storage**:
   * All submissions are saved to the `feedbacks` table and chronologically sorted so the latest feedback always appears at the top of the **Feedback Message Center**.
2. **Internal Administrator Private Message**:
   * An automatic notification message is generated in `private_messages` addressed to administrator accounts (`admin`). When administrators log in, their **Private Message Center** badge lights up immediately with full feedback details.
3. **Email Notification Dispatch**:
   * The system inspects configured administrator email addresses (such as `cheshiruanjian@gmail.com` updated via User Management).
   * **Local Simulation Mode (Default)**: Outgoing emails are cleanly logged to the server console and the **Notification Outbox** (`Administration Board > Send Email to All Members`), eliminating hard external dependencies for local machines.
   * **Real SMTP Delivery (Optional)**: If you want real emails delivered directly to an external Gmail inbox, configure your SMTP parameters in `.env`:
     ```env
     SMTP_HOST="smtp.gmail.com"
     SMTP_PORT="587"
     SMTP_SECURE="false"
     SMTP_USER="your_email@gmail.com"
     SMTP_PASS="your_16_char_app_password"
     SMTP_FROM="MediFAQ Community Portal <no-reply@medifaq.my>"
     ```
     *(For Gmail, generate an App Password at [Google Account > Security > 2-Step Verification > App passwords](https://myaccount.google.com/apppasswords)).*

---

## 🔍 Verifying Local Database Endpoints

To verify that your local PostgreSQL backend is actively answering requests, run these `curl` commands in a new terminal window:

```bash
# Check categories endpoint
curl -s http://localhost:3000/api/categories | head -c 120

# Check FAQs endpoint
curl -s http://localhost:3000/api/faqs | head -c 120

# Check member accounts endpoint
curl -s http://localhost:3000/api/members | head -c 120
```

Each command should return formatted JSON data directly from your local PostgreSQL database.

---

## 🧪 Automated Testing & Production Data Guardian

MediFAQ includes an automated test framework engineered to **exhaustively validate all application capabilities without risking or corrupting production data**.

```bash
npm test
```

### Architecture of the Test Guardian

The test suite is built on a non-disruptive, crash-resilient testing architecture:

1. **Unique Run Namespacing**:
   Each test run executes inside an isolated dynamic namespace (e.g. `tst_<timestamp>_<randomId>_`). Every mock category, FAQ, user account, forum post, feedback, and private message carries this unique prefix. Production entities are never modified.

2. **Pre-Flight Baseline Snapshot**:
   Before running any assertions, `TestGuardian` captures an exact cryptographic count of all existing production rows across all 8 relational tables.

3. **Emergency Interruption Traps (`SIGINT`, `SIGTERM`, `SIGHUP`)**:
   If a developer cancels the test prematurely (e.g., `Ctrl+C`, process termination, or unhandled exceptions), registered process signal handlers automatically trap the event and invoke an immediate cleanup purge of all mock entities matching the session namespace.

4. **Production Invariant Assertion**:
   At the end of every test run, `TestGuardian` re-evaluates database counts against the baseline snapshot and asserts that **zero production rows were created, altered, or deleted** (`Production Data Safe: YES (100% UNTOUCHED)`).

### Test Coverage Highlights

* **Categories & Subcategories**: Category creation, multilingual structure verification, subtopic associations.
* **FAQ Knowledge Base**: Creation, content retrieval, view click count incrementation (`/api/faqs/:id/view`), inline editing, and deletion.
* **Discussion Board**: Thread creation with priority flags, reply posting, author counter updates, thread reply counter tracking, post editing, and author authorization.
* **Membership Management**: Registration validation, duplicate username rejection (HTTP 400), profile updating, and administrative privilege assignment.
* **Feedback Message Center**: Submission, categorization, and administrative inbox deletion.
* **Private Messaging**: Message sending, unread status toggling, and inbox deletion.
* **Teardown & Resilience**: Deliberate simulation of early termination to verify emergency cleanup traps.

---

## 🛠️ Troubleshooting Local PostgreSQL Connections

### 1. `ECONNREFUSED 127.0.0.1:5432`
* **Cause**: PostgreSQL service is not running or listening on a different port.
* **Fix**:
  * If using Docker: check with `docker ps`. If stopped, run `docker compose up -d`.
  * If using macOS Homebrew: run `brew services restart postgresql@16`.
  * If using Linux: run `sudo systemctl status postgresql` and `sudo systemctl restart postgresql`.
  * Verify port: run `pg_isready -h 127.0.0.1 -p 5432`.

### 2. `password authentication failed for user "postgres"`
* **Cause**: The password specified in `.env` (`SQL_PASSWORD`) does not match the PostgreSQL user password.
* **Fix**:
  * Reset password in `psql`:
    ```sql
    ALTER USER postgres WITH PASSWORD 'postgres_password';
    ```
  * Update `SQL_PASSWORD` in `.env` to match.

### 3. `database "medifaq" does not exist`
* **Cause**: The target database has not yet been created.
* **Fix**:
  * Run `createdb -U postgres medifaq` in terminal, or in `psql`:
    ```sql
    CREATE DATABASE medifaq;
    ```
  * Then re-run `npm run db:push` and `npm run db:seed`.

### 4. `permission denied for schema public` (PostgreSQL 15+)
* **Cause**: PostgreSQL 15 changed default public schema permissions for non-superusers.
* **Fix**:
  * Connect as `postgres` superuser and grant schema permissions:
    ```sql
    GRANT ALL ON SCHEMA public TO CURRENT_USER;
    GRANT ALL ON SCHEMA public TO postgres;
    ```

---

## 📂 Project Structure

```
├── docker-compose.yml   # 1-command local PostgreSQL 16 container setup
├── index.html           # HTML5 entry point with Fraunces, Inter & CJK fonts
├── metadata.json        # Application manifest and platform capabilities
├── package.json         # Full-stack dependencies and scripts (dev, build, db:push, db:seed, test)
├── server.ts            # Express full-stack server mounting /api/* and Vite middleware
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration with Tailwind CSS plugin
├── tests/
│   └── run-all-tests.ts # Comprehensive test suite & Data Guardian (npm test)
└── src/
    ├── App.tsx          # Full-featured Single Page Application (UI, Routing, State, i18n)
    ├── index.css        # Global CSS variables, custom typography (CJK), and Tailwind tokens
    ├── main.tsx         # React application bootstrap entry
    └── db/
        ├── drizzle.config.ts  # Drizzle Kit migration configuration
        ├── index.ts           # PostgreSQL pg.Pool connection pool & Drizzle ORM client
        ├── schema.ts          # Relational table schemas & relations
        └── seed.ts            # Self-contained database seed script
```

---

## 🚀 Production Build & Deployment

To compile the application for production:

```bash
# 1. Build frontend bundle
npm run build

# 2. Run full-stack production server
npm run start
```

In production mode, Express automatically serves the pre-compiled static assets from the `dist/` directory while keeping all `/api/*` REST endpoints active.

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
