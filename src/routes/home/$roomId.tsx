import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/$roomId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  return (
    <div>
      Hello "/home/
      {roomId}
      "!
    </div>
  );
}
