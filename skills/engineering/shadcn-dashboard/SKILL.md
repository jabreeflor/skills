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

Scaffold a production-ready dashboard by copying the prebuilt template bundled in this skill —
no network installs needed for the component library.

## What's in the template

The `template/` directory (sibling of this SKILL.md) is a complete, buildable Next.js 14+ project
with the shadcn/ui `dashboard-01` block already installed and wired up:

| Path | Role |
|---|---|
| `components/ui/` | 18 shadcn primitives — sidebar, card, chart, table, badge, etc. |
| `components/app-sidebar.tsx` | Collapsible sidebar with nav groups |
| `components/section-cards.tsx` | 4 KPI stat cards with trend indicators |
| `components/chart-area-interactive.tsx` | Interactive area/bar chart (Recharts) |
| `components/data-table.tsx` | Sortable table with tabs and status badges |
| `app/dashboard/page.tsx` | Dashboard layout wiring everything together |
| `app/layout.tsx`, `globals.css`, config files | Boilerplate — leave as-is |

**You edit 5 files to customize for any domain. Everything else stays untouched.**

## Step-by-step workflow

### 1. Determine the domain

From the conversation, identify what kind of dashboard this is (SaaS, ecommerce, support,
finance, observability, etc.). This drives the labels, columns, and nav items you'll set.

### 2. Find the template

The template path is `<directory-containing-this-SKILL.md>/template/`. Use the skill file's
location to resolve it — it's always a sibling directory.

### 3. Copy template to destination

**Starting fresh:**
```bash
cp -r <skill-dir>/template <destination-dir>
cd <destination-dir>
npm install
```

**Adding to an existing Next.js + Tailwind project:**
```bash
cp -r <skill-dir>/template/components <project-root>/
cp -r <skill-dir>/template/hooks <project-root>/
cp -r <skill-dir>/template/lib <project-root>/
cp <skill-dir>/template/components.json <project-root>/
# Merge these deps into the project's package.json:
# recharts, @radix-ui/*, lucide-react, class-variance-authority, clsx, tailwind-merge
npm install
```

### 4. Customize exactly these 5 files

The `components/ui/` files are pure primitives — never edit them. Only touch these:

#### `components/app-sidebar.tsx`
Update the app name and `navMain` items array with domain-relevant links:
```ts
// Example for ecommerce:
{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
{ title: "Orders",    url: "/orders",    icon: ShoppingCart },
{ title: "Products",  url: "/products",  icon: Package },
{ title: "Customers", url: "/customers", icon: Users },
{ title: "Settings",  url: "/settings",  icon: Settings2 },
```

#### `components/section-cards.tsx`
Replace the 4 card blocks with domain KPIs. Each card has a `CardTitle` (metric name),
a `CardDescription` (current value), and a trend badge. Keep the 4-card grid.

#### `components/chart-area-interactive.tsx`
- Update `chartConfig` keys and labels for the domain metrics
- Replace `chartData` with 6–12 realistic data points
- Change the `CardTitle` text

#### `components/data-table.tsx`
- Redefine the Zod `schema` with domain-specific fields
- Update `columns` array (header labels + `accessorKey`)
- Replace the `data` array with 8–10 realistic sample rows
- Update tab filter values to match domain status vocabulary

#### `app/dashboard/data.json`
Replace with sample rows matching your updated schema. This feeds the table.

### 5. Start the dev server

```bash
npm run dev &
sleep 4 && open http://localhost:3000
```

Tell the user: "Your dashboard is running at http://localhost:3000"

## Domain reference

| Domain | KPI cards | Chart | Table columns | Nav links |
|---|---|---|---|---|
| SaaS | Total Users, MRR, Churn Rate, Active Subs | Revenue over time | Email, Plan, Status, Signup Date | Dashboard, Analytics, Users, Revenue |
| Ecommerce | Total Revenue, Orders Today, Avg Order Value, Refund Rate | Daily sales | Order ID, Customer, Total, Status | Dashboard, Orders, Products, Customers |
| Support | Open Tickets, Avg Response Time, CSAT, Resolved Today | Ticket volume | Ticket ID, Customer, Priority, Agent | Dashboard, Tickets, Inbox, Analytics |
| Finance | Net Revenue, Expenses, Budget Used, Margin | Revenue vs expenses | Transaction, Category, Amount, Date | Dashboard, Transactions, Reports, Budget |
| Observability | P99 Latency, Error Rate, Uptime, Deploys | Request rate | Service, Status, Latency, Errors | Dashboard, Services, Alerts, Deploys |

## Tips

- Port 3000 taken? `npm run dev -- --port 3001` and open `http://localhost:3001`
- The chart uses Recharts (already in `package.json`) — no extra install needed
- For an existing project with its own shadcn setup, check `components.json` for alias
  conflicts before copying `components/ui/`
