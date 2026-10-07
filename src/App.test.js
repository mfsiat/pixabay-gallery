import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockImageData = {
  hits: [
    {
      id: 1,
      webformatURL: 'https://example.com/image1.jpg',
      user: 'john',
      views: 100,
      downloads: 50,
      likes: 25,
      tags: 'nature,landscape'
    },
    {
      id: 2,
      webformatURL: 'https://example.com/image2.jpg',
      user: 'jane',
      views: 200,
      downloads: 75,
      likes: 40,
      tags: 'city,urban'
    }
  ]
};

global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    process.env.REACT_APP_PIXABAY_API_KEY = 'test-api-key';
  });

  test('renders loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/Loading\.\.\.\.\.\.\./i)).toBeInTheDocument();
  });

  test('renders search input component', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<App />);
    expect(screen.getByPlaceholderText(/Search Image Term/i)).toBeInTheDocument();
  });

  test('fetches images on search term change', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageData
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=nature'),
        expect.any(Object)
      );
    });
  });

  test('displays images after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageData
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/john/)).toBeInTheDocument();
      expect(screen.getByText(/jane/)).toBeInTheDocument();
    });
  });

  test('displays error message on API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load images/i)).toBeInTheDocument();
    });
  });

  test('displays "No images found" when hits array is empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hits: [] })
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'xyz123notfound');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/No images found/i)).toBeInTheDocument();
    });
  });

  test('handles network error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load images/i)).toBeInTheDocument();
    });
  });

  test('aborts fetch on unmount', async () => {
    const abortSpy = jest.fn();
    global.AbortController = jest.fn(() => ({
      signal: {},
      abort: abortSpy
    }));

    fetch.mockImplementation(() => new Promise(() => {}));
    const { unmount } = render(<App />);

    unmount();
    expect(abortSpy).toHaveBeenCalled();
  });

  test('does not display error when fetch is aborted', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';

    fetch.mockRejectedValueOnce(abortError);

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    // After abort, error should not be displayed
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.queryByText(/Failed to load images/i)).not.toBeInTheDocument();
  });

  test('handles response without hits property', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}) // No hits property
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/No images found/i)).toBeInTheDocument();
    });
  });

  test('includes API key and image_type in API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImageData
    });

    render(<App />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('image_type=photo'),
        expect.any(Object)
      );
    });
  });
});
