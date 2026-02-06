import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    throw redirect({ to: "/login", mask: { to: "/" } });
  },
});

function Index() {
  return (
    <></>
  );
}
