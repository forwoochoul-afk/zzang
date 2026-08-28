import { Suspense, lazy, useEffect, useState } from 'react';
import Hello from './pages/Hello.tsx';

// Lazy so the Supabase-backed App bundle (which throws at import time when
// VITE_SUPABASE_* are unset) never loads on the #/hello route.
const App = lazy(() => import('./App.tsx'));

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash === '#/hello') {
    return <Hello />;
  }

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

export default Root;
