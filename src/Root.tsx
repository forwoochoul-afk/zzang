import { useEffect, useState } from 'react';
import App from './App.tsx';
import Hello from './pages/Hello.tsx';

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash === '#/hello' ? <Hello /> : <App />;
}

export default Root;
