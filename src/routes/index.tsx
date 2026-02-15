import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    const isLoggedIn = localStorage.getItem("token");
    if (isLoggedIn) {
      throw redirect({ to: "/home" });
    }
    throw redirect({ to: "/login" });
  },
});

function Index() {
  return (
    <></>
  );
}
