import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop/$category")({
  component: CategoryLayout,
});

function CategoryLayout() {
  return <Outlet />;
}
