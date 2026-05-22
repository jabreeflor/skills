---
name: shadcn-dashboard
description: >
  Scaffold and wire up a full shadcn/ui dashboard in a Next.js project — with sidebar navigation,
  KPI stat cards, charts, and data tables — then launch the dev server so you can see it live.
  Use this skill whenever the user mentions dashboards, admin panels, analytics interfaces,
  data visualization, or wants to "build a UI" for displaying metrics, orders, users, or any
  structured data — even if they don't say "shadcn" or "dashboard" explicitly. Especially trigger
  when the user wants a quick, polished starting point for an internal tool, SaaS admin view,
  ecommerce backend, or analytics page.
---

# shadcn-dashboard

Scaffold a beautiful, production-ready dashboard using [shadcn/ui](https://ui.shadcn.com/blocks) blocks,
then spin up the dev server so the user can see it live immediately.

## What you'll build

A Next.js 14+ app (App Router) with:
- **Sidebar navigation** — collapsible, icon-labeled nav links
- **Stat cards** — KPI metrics with trend indicators
- **Chart section** — area or bar chart for trends over time
- **Data table** — sortable rows with status badges
- **Responsive layout** — works at all breakpoints

The default block is `dashboard-01` from shadcn/ui, which gives all of the above in one command.
You can combine it with `sidebar-07` for a collapsible sidebar.

## Step-by-step workflow

### 1. Understand context

Ask (or infer from the conversation) what domain this dashboard is for — e.g., SaaS analytics,
ecommerce admin, support tickets, finance. This shapes the labels, column names, and colors you'll
use when customizing the scaffolded code. You don't need to ask explicitly if the user already
told you.

### 2. Check for an existing Next.js project

Look for a `package.json` with `next` as a dependency in the current directory:

```bash
cat package.json 2>/dev/null | grep '"next"'
```

**If found**: use the existing project. Skip to step 4.

**If not found**: scaffold a new one (step 3).

### 3. Scaffold a new Next.js + shadcn/ui project

```bash
npx create-next-app@latest dashboard-app \
  --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
cd dashboard-app
npx shadcn@latest init --defaults --yes
```

`cd` into the new directory for all subsequent commands.

### 4. Add the dashboard blocks

Install the main dashboard block and a collapsible sidebar:

```bash
npx shadcn@latest add dashboard-01 --yes
npx shadcn@latest add sidebar-07 --yes 2>/dev/null || true
```

If `dashboard-01` isn't available in the user's shadcn version, fall back to adding the components
individually:

```bash
npx shadcn@latest add card chart table badge button sidebar --yes
```

### 5. Create the dashboard page

The `dashboard-01` block adds files under `app/dashboard/`. If it created `app/dashboard/page.tsx`,
you're done with scaffolding — just customize labels.

If no page was created, write `app/dashboard/page.tsx` yourself. Use this structure:

```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">[Domain] Dashboard</h1>
        </header>
        <div className="flex flex-col gap-4 p-4">
          {/* KPI Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* stat cards here */}
          </div>
          {/* Chart */}
          <ChartAreaInteractive />
          {/* Table */}
          <DataTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### 6. Customize for the user's domain

Edit the scaffolded files to replace placeholder content with domain-appropriate labels:
- Sidebar nav items → pages relevant to the domain (e.g., Orders, Customers, Products)
- KPI card labels → real metrics (e.g., "Total Revenue", "Active Users", "Conversion Rate")
- Chart title → something meaningful (e.g., "Revenue Over Time", "Daily Active Users")
- Table columns → relevant fields (e.g., Order ID, Customer, Status, Amount)
- Table data → 5–8 rows of realistic sample data

Keep the customization focused — update text and data, don't restructure the layout.

### 7. Add a redirect from the root (optional but nice)

If the project has `app/page.tsx`, update it to redirect to the dashboard:

```tsx
import { redirect } from "next/navigation"
export default function Home() { redirect("/dashboard") }
```

### 8. Start the dev server

```bash
npm run dev &
```

Wait a few seconds for it to come up, then open the browser:

```bash
sleep 4 && open http://localhost:3000
```

Tell the user: "Your dashboard is running at http://localhost:3000 — the terminal is still running
the dev server in the background."

## Handling variations

**User wants multiple dashboard styles** (e.g., "make it look like a support dashboard"): Adjust the
nav items, KPI labels, chart data, and table columns to match. The block structure stays the same.

**User is in an existing Next.js app without shadcn**: Run `npx shadcn@latest init --defaults --yes`
first before adding blocks.

**shadcn blocks CLI not available** (older version): Install components individually with
`npx shadcn@latest add card chart table badge button sidebar` then write the page manually using
the template in step 5.

**User wants charts**: The `chart-area-interactive` component from `dashboard-01` uses Recharts
under the hood (included via shadcn). No extra install needed.

**Port 3000 already in use**: Run `npm run dev -- --port 3001` and open `http://localhost:3001`.

## Reference: efferd.com dashboard archetypes

For inspiration on what to put in the dashboard for different domains, refer to these patterns:
- **SaaS/Analytics**: visitor metrics, active users, top pages, conversion funnels
- **Ecommerce**: revenue trends, refund rates, category rankings, recent orders
- **Finance**: KPI stats, budget vs actuals, expense breakdowns
- **Support/CRM**: ticket volume, CSAT scores, team availability, response times
- **Observability**: latency cards, error rates, deployment tracking, uptime sparklines

Pick the closest archetype to what the user described and use it to drive your label/data choices.
