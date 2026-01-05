# 🎯 Exhibitor Dashboard - Meeting Requests Management System

> A full-stack web application for managing exhibitor meeting requests with complete CRUD operations.

## � Demo Access

**For quick testing, use these demo credentials:**

```
Email: demo@exhibitor.com
Password: DemoExhibitor2026!
```

*The login page has an auto-fill button for instant access!*

---

## �📸 Live Demo

**🔗 [View Live Demo](#)** *(Add your deployed link here)*

![Dashboard Preview](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Exhibitor+Dashboard+Preview)

---

## 🚀 Project Overview

A modern, single-page dashboard application that allows exhibitors to create, view, edit, and delete meeting requests efficiently. Built with enterprise-grade technologies and best practices.

### ✨ Key Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete meeting requests
- ✅ **Real-time Data** - Instant updates using Supabase real-time capabilities
- ✅ **Form Validation** - Client and server-side validation for data integrity
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Status Tracking** - Auto-detect expired meetings with visual badges
- ✅ **RESTful API** - Well-structured API endpoints for external integrations
- ✅ **Toast Notifications** - User-friendly feedback for all actions
- ✅ **Loading States** - Professional UX with loading indicators
- ✅ **Type Safety** - Full TypeScript implementation

---

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **[Next.js 14](https://nextjs.org/)** | React framework with App Router & Server Actions |
| **[TypeScript](https://www.typescriptlang.org/)** | Type-safe development |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first CSS framework |
| **[Supabase](https://supabase.com/)** | PostgreSQL database & authentication |
| **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side)** | Server-side rendering with authentication |
| **[shadcn/ui](https://ui.shadcn.com/)** | High-quality React components |

---

## 📊 Data Model

### Meeting Request Schema

```typescript
{
  id: UUID (Primary Key, Auto-generated)
  visitor_name: string (Required)
  meeting_date: date (Required)
  expired_date: date (Required, must be after meeting_date)
  created_at: timestamp (Auto-generated)
}
```

---

## 🎯 Features Demonstration

### 1. Create Meeting Request
- Fill out the form with visitor details
- Select meeting and expiration dates
- Validation ensures data integrity
- Success notification on creation

### 2. View All Requests
- Responsive table layout
- Status badges (Active/Expired)
- Formatted dates
- Sortable by creation date

### 3. Edit Meeting Request
- Click "Edit" on any request
- Form pre-fills with existing data
- Update and save changes
- Real-time table refresh

### 4. Delete Meeting Request
- Click "Delete" with confirmation dialog
- Instant removal from database
- Success notification

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
  ```
  > [!NOTE]
  > This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
  > Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
  > See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

  Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
