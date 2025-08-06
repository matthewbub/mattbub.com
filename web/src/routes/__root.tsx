import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <div className="app">
      <main>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </main>
    </div>
  );
}
