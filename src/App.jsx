import React, { useState, useEffect } from 'react';
import ImageCard from './components/ImageCard';
import ImageSearch from './components/ImageSearch';


const MISSING_KEY_MESSAGE =
  'Pixabay API key is not configured. Copy .env.example to .env and add your ' +
  'key from https://pixabay.com/api/docs/';

if (import.meta.env.DEV && import.meta.env.MODE !== 'test' && !import.meta.env.VITE_PIXABAY_API_KEY) {
  console.warn(`[pixabay-gallery] ${MISSING_KEY_MESSAGE}`);
}

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Read at call time so a key set after module load (e.g. in tests) is seen.
    const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;

    // Without a key the request would hit Pixabay unauthenticated; surface a
    // distinct, actionable message instead of the generic failure state.
    if (!apiKey) {
      setError(MISSING_KEY_MESSAGE);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${term}&image_type=photo&pretty=true`,
      { signal: controller.signal }
    )
      .then(res => {
        if (!res.ok) {
          // 400/401/429 almost always mean a missing/invalid/rate-limited key.
          if (res.status === 400 || res.status === 401 || res.status === 429) {
            throw new Error(`AUTH:${res.status}`);
          }
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setImages(data.hits ?? []);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(
          err.message?.startsWith('AUTH:')
            ? `Pixabay rejected the request (HTTP ${err.message.slice(5)}). ` +
              'Check that your API key is valid and within its rate limit.'
            : 'Failed to load images. Please try again.'
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [term]);

  return (
    <div className="container mx-auto">
      <ImageSearch searchText={(text) => setTerm(text)} />

      {error && (
        <h1 className="text-3xl text-center text-red-500 mx-auto mt-32">{error}</h1>
      )}

      {!error && !isLoading && images.length === 0 && (
        <h1 className="text-5xl text-center mx-auto mt-32">No images found</h1>
      )}

      {!error && (
        isLoading
          ? <h1 className="text-6xl text-center mx-auto mt-32">Loading.......</h1>
          : <div className="grid grid-cols-3 gap-4">
              {images.map(image => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
      )}
    </div>
  );
}

export default App;
