# Pixabay-Gallery 
> A React photo gallery App where you can search for photos 

## What is it? 

- [Live View](https://mfsiat.github.io/pixabay-gallery/)

- A photo gallery app where user can search and see different types of photos. 

- Made with **React**. We used **Pixabay** photo gallery **api** to _search_ and _fetch_ photos. 

- We used **Tailwind CSS** for _styling_. 

## Backbone

- The front end is in **react** and we used **react hooks** to fetch the data from the API. 

- We used **Tailwind CSS** component class for styling. 

## Preview 

- [Live view on github pages](https://mfsiat.github.io/pixabay-gallery/)

- Special Thanks to the **api** providers. [Click for API documentation](https://pixabay.com/api/docs/)

## Getting Started

```bash
git clone https://github.com/mfsiat/pixabay-gallery.git
cd pixabay-gallery
cp .env.example .env          # add your Pixabay API key inside .env
npm install
npm start
```

Get a free API key at [pixabay.com/api/docs](https://pixabay.com/api/docs/).

## Security Note

This is a client-side-only React app. The Pixabay API key is embedded in the JavaScript bundle at build time and **is visible to anyone who inspects the page source**. This is a known limitation of CRA's `REACT_APP_*` pattern.

Recommended mitigations:
- **Restrict the key by referrer domain** in your Pixabay account settings so it cannot be used from other origins.
- **Proxy via a backend** (e.g. a Next.js API route or serverless function) to keep the key server-side — see [issue #43](https://github.com/mfsiat/pixabay-gallery/issues/43) for details.
- Treat the key as **disposable** — rotate it immediately if you suspect abuse.

Never store sensitive keys (Stripe, AWS, etc.) using `REACT_APP_*` in a public repository.

## Credits 

- [Reference](https://www.smashingmagazine.com/2020/02/tailwindcss-react-project/)
- [YouTube Tutorial](https://www.youtube.com/watch?v=FiGmAI5e91M&t=1264s)
- [API](https://pixabay.com/api/docs/)
