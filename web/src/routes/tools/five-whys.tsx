import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tools/five-whys')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tools/five-whys"!</div>
}
