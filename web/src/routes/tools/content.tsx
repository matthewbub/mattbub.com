import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tools/content')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tools/five-whys"!</div>
}
