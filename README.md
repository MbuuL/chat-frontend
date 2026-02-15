# Chat Frontend

React frontend for the real-time chat application, built with TypeScript and Vite.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** with SWC for Fast Refresh
- **TanStack Router** — file-based routing
- **TanStack Query** — server state management
- **TanStack Form** — form handling
- **Tailwind CSS v4** — styling via Vite plugin
- **WebSocket** — real-time messaging and presence

## Getting Started

```bash
pnpm install
```

Create a `.env` file:

```
VITE_BACKEND_URL=http://localhost:3000
```

Start the dev server:

```bash
pnpm dev
```

## Scripts

| Command        | Description                      |
| -------------- | -------------------------------- |
| `pnpm dev`     | Start Vite dev server            |
| `pnpm build`   | TypeScript compile + Vite build  |
| `pnpm preview` | Preview production build         |
| `pnpm lint`    | Run ESLint                       |

## Project Structure

```
src/
  main.tsx                  # Entry point, sets up TanStack Router
  routeTree.gen.ts          # Auto-generated route tree
  routes/
    __root.tsx              # Root layout (QueryClientProvider, ThemeProvider)
    index.tsx               # Landing page
    login.tsx               # Login page
    register.tsx            # Registration page
    home/
      route.tsx             # Main chat layout (public chat + online users sidebar)
      index.tsx             # Home index
      $roomId.tsx           # Private chat room view
  components/
    Navbar.tsx              # Top navigation bar
    ThemeToggle.tsx          # Dark/light mode toggle
    Popup.tsx               # Reusable popup component
    ChatArea/
      Left.tsx              # Left sidebar
      Main.tsx              # Main chat panel
      Right.tsx             # Right panel
  hooks/
    usePublicChat.ts        # WebSocket connection, auto-reconnect, query cache updates
    useOnlineUsers.ts       # Online user presence tracking
    useTheme.tsx            # ThemeProvider context + useTheme hook
  lib/
    api.ts                  # HTTP helpers (apiGet, apiPost, apiAuthPost), JWT utilities
```
