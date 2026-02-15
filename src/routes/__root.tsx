import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../hooks/useTheme";

const queryClient = new QueryClient();

const RootLayout = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
