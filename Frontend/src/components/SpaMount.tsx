import { Suspense, lazy, useEffect, useState } from "react";

const App = lazy(() => import("@/App"));

function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <span className="gradient-primary absolute inset-0 rounded-full opacity-90" />
        </div>
        <p className="text-sm text-muted-foreground">Starting Swayam Saarthi…</p>
      </div>
    </div>
  );
}

/**
 * Mounts the existing React Router SPA on the client only.
 * All app routes, contexts, sockets and API calls stay exactly as they were.
 */
export default function SpaMount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <BootScreen />;

  return (
    <Suspense fallback={<BootScreen />}>
      <App />
    </Suspense>
  );
}
