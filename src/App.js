import React, { useState, useEffect } from 'react';
import ImageCard from './components/ImageCard';
import ImageSearch from './components/ImageSearch';


if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_PIXABAY_API_KEY) {
  console.warn(
    '[pixabay-gallery] REACT_APP_PIXABAY_API_KEY is not set.\n' +
    'Copy .env.example to .env and add your key from https://pixabay.com/api/docs/'
  );
}

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    fetch(
      `https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${term}&image_type=photo&pretty=true`,
      { signal: controller.signal }
    )
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setImages(data.hits ?? []);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError('Failed to load images. Please try again.');
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
