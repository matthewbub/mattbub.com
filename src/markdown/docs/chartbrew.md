---
title: "Chartbrew"
description: "Open source platform for creating live dashboards, charts, and reports from your data sources."
version: "3.x"
repo: "https://github.com/chartbrew/chartbrew"
---

## Overview

Chartbrew is an open source platform that lets you connect to databases, APIs, and spreadsheets to create live-updating charts and dashboards. No SQL knowledge required — but fully supported if you want it.

Built with Node.js and React. Self-hostable. Free forever.

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8 or PostgreSQL 14+
- Redis (optional, for caching)

### Installation

```bash
npx create-chartbrew-app my-dashboard
cd my-dashboard
```

### Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Key environment variables:

```env
CB_DB_HOST=localhost
CB_DB_PORT=3306
CB_DB_NAME=chartbrew
CB_DB_USERNAME=root
CB_DB_PASSWORD=

CB_SECRET=your-secret-key
CB_API_HOST=localhost
CB_API_PORT=4019
```

### Running

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

The app will be available at `http://localhost:4018` with the API on port `4019`.

## Data Sources

Chartbrew supports connecting to a variety of data sources out of the box.

### Databases

| Source | Status | Notes |
|--------|--------|-------|
| MySQL | Stable | Direct query support |
| PostgreSQL | Stable | Direct query support |
| MongoDB | Stable | Aggregation pipeline support |
| Firestore | Stable | Collection queries |

### APIs

| Source | Status | Notes |
|--------|--------|-------|
| REST API | Stable | Any JSON endpoint |
| Google Analytics | Stable | GA4 properties |
| Stripe | Stable | Revenue, customers, subscriptions |
| GitHub | Beta | Repos, issues, PRs |

### Connecting a Data Source

```javascript
// Via the API
const response = await fetch("/api/connection", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Production DB",
    type: "mysql",
    host: "db.example.com",
    port: 3306,
    dbName: "production",
    username: "readonly",
    password: "...",
  }),
});
```

## Charts

### Chart Types

- **Line** — Time series, trends
- **Bar** — Comparisons, distributions
- **Pie / Doughnut** — Proportions
- **Table** — Raw data display
- **KPI** — Single number with trend indicator
- **Radar** — Multi-axis comparison

### Creating a Chart

1. Select a data source connection
2. Write or build your query
3. Choose a chart type
4. Map data fields to axes
5. Configure styling and options

### Query Builder

Chartbrew includes a visual query builder for users who prefer not to write raw queries. It supports:

- Field selection
- Filtering (equals, contains, greater than, etc.)
- Sorting
- Grouping and aggregation
- Date range filtering

### Raw Query Mode

For advanced users, switch to raw query mode:

```sql
SELECT
  DATE_FORMAT(created_at, '%Y-%m') AS month,
  COUNT(*) AS signups,
  COUNT(CASE WHEN plan = 'pro' THEN 1 END) AS pro_signups
FROM users
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month;
```

## Dashboards

### Layout

Dashboards use a responsive grid system. Charts can be:

- Resized (drag corners)
- Repositioned (drag and drop)
- Grouped into sections

### Auto-Refresh

Set dashboards to refresh on an interval:

```javascript
// Available intervals
"never" | "30s" | "1m" | "5m" | "15m" | "1h" | "6h" | "1d"
```

### Sharing

Dashboards can be shared via:

- **Public link** — Anyone with the URL can view
- **Embed** — iframe embed code for external sites
- **Team access** — Role-based permissions within your team

## API Reference

### Authentication

```bash
# Get an auth token
curl -X POST https://your-instance/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "..."}'
```

All subsequent requests include the token:

```bash
curl https://your-instance/api/chart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/project` | List all projects |
| `POST` | `/api/project` | Create a project |
| `GET` | `/api/chart/:id` | Get chart config + data |
| `POST` | `/api/chart` | Create a chart |
| `PUT` | `/api/chart/:id` | Update a chart |
| `GET` | `/api/connection` | List connections |
| `POST` | `/api/connection` | Create a connection |
| `POST` | `/api/connection/:id/test` | Test a connection |

## Self-Hosting

### Docker

```bash
docker pull chartbrew/chartbrew
docker run -p 4018:4018 -p 4019:4019 \
  -e CB_DB_HOST=host.docker.internal \
  -e CB_DB_NAME=chartbrew \
  -e CB_SECRET=your-secret \
  chartbrew/chartbrew
```

### Docker Compose

```yaml
version: "3.8"
services:
  chartbrew:
    image: chartbrew/chartbrew
    ports:
      - "4018:4018"
      - "4019:4019"
    environment:
      CB_DB_HOST: db
      CB_DB_NAME: chartbrew
      CB_DB_USERNAME: root
      CB_DB_PASSWORD: secret
      CB_SECRET: your-secret
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: chartbrew
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

## Contributing

Chartbrew is community-driven. Contributions welcome:

1. Check [open issues](https://github.com/chartbrew/chartbrew/issues) for `good first issue` labels
2. Fork and create a feature branch
3. Write tests for new features
4. Submit a PR with a clear description

### Development Setup

```bash
git clone https://github.com/chartbrew/chartbrew.git
cd chartbrew
npm install
npm run dev
```

The client runs on `:4018` and the API on `:4019` with hot reload.
