import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    const isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn) {
      throw redirect({ to: "/home", mask: { to: "/" } });
    }
    throw redirect({ to: "/login", mask: { to: "/" } });
  },
});

function Index() {
  return (
    <></>
  );
}
