import React from 'react';
import { render, screen } from '@testing-library/react';
import ImageCard from './ImageCard';

const mockImage = {
  id: 1,
  webformatURL: 'https://example.com/image.jpg',
  user: 'John Doe',
  views: 1500,
  downloads: 750,
  likes: 250,
  tags: 'nature,landscape,mountain'
};

describe('ImageCard Component', () => {
  test('renders image with correct src URL', () => {
    render(<ImageCard image={mockImage} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockImage.webformatURL);
  });

  test('renders photographer name', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText(/Photo by John Doe/i)).toBeInTheDocument();
  });

  test('renders view count', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText(/Views:\s+1500/)).toBeInTheDocument();
  });

  test('renders download count', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText(/Downloads:\s+750/)).toBeInTheDocument();
  });

  test('renders like count', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText(/Likes:\s+250/)).toBeInTheDocument();
  });

  test('renders all tags from comma-separated string', () => {
    render(<ImageCard image={mockImage} />);
    expect(screen.getByText('#nature')).toBeInTheDocument();
    expect(screen.getByText('#landscape')).toBeInTheDocument();
    expect(screen.getByText('#mountain')).toBeInTheDocument();
  });

  test('handles tags with whitespace', () => {
    const imageWithSpacedTags = {
      ...mockImage,
      tags: 'nature , landscape , mountain'
    };
    render(<ImageCard image={imageWithSpacedTags} />);
    expect(screen.getByText('#nature')).toBeInTheDocument();
    expect(screen.getByText('#landscape')).toBeInTheDocument();
    expect(screen.getByText('#mountain')).toBeInTheDocument();
  });

  test('handles image without tags', () => {
    const imageWithoutTags = {
      ...mockImage,
      tags: ''
    };
    render(<ImageCard image={imageWithoutTags} />);
    // Should render without crashing
    expect(screen.getByText(/Photo by/)).toBeInTheDocument();
  });

  test('handles image with null tags', () => {
    const imageWithNullTags = {
      ...mockImage,
      tags: null
    };
    render(<ImageCard image={imageWithNullTags} />);
    expect(screen.getByText(/Photo by/)).toBeInTheDocument();
  });

  test('generates alt text with tags and user', () => {
    render(<ImageCard image={mockImage} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', expect.stringContaining('nature'));
    expect(img).toHaveAttribute('alt', expect.stringContaining('John Doe'));
  });

  test('generates alt text without user if not provided', () => {
    const imageWithoutUser = {
      ...mockImage,
      user: undefined
    };
    render(<ImageCard image={imageWithoutUser} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', expect.stringContaining('nature'));
    expect(img.getAttribute('alt')).not.toContain('photo by');
  });

  test('uses default alt text when no tags provided', () => {
    const imageWithoutTags = {
      ...mockImage,
      tags: ''
    };
    render(<ImageCard image={imageWithoutTags} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Pixabay gallery image');
  });

  test('renders single tag correctly', () => {
    const imageWithSingleTag = {
      ...mockImage,
      tags: 'nature'
    };
    render(<ImageCard image={imageWithSingleTag} />);
    expect(screen.getByText('#nature')).toBeInTheDocument();
  });

  test('does not render empty tag strings', () => {
    const imageWithEmptyTags = {
      ...mockImage,
      tags: 'nature,,landscape'
    };
    render(<ImageCard image={imageWithEmptyTags} />);
    expect(screen.getByText('#nature')).toBeInTheDocument();
    expect(screen.getByText('#landscape')).toBeInTheDocument();
    // Should not render empty tags as separate elements
    const tags = screen.getAllByRole('generic').filter(el => el.textContent.startsWith('#'));
    expect(tags.length).toBe(2);
  });

  test('handles large statistics numbers', () => {
    const imageWithLargeStats = {
      ...mockImage,
      views: 9999999,
      downloads: 5555555,
      likes: 3333333
    };
    render(<ImageCard image={imageWithLargeStats} />);
    expect(screen.getByText(/Views:\s+9999999/)).toBeInTheDocument();
    expect(screen.getByText(/Downloads:\s+5555555/)).toBeInTheDocument();
    expect(screen.getByText(/Likes:\s+3333333/)).toBeInTheDocument();
  });

  test('handles zero statistics', () => {
    const imageWithZeroStats = {
      ...mockImage,
      views: 0,
      downloads: 0,
      likes: 0
    };
    render(<ImageCard image={imageWithZeroStats} />);
    expect(screen.getByText(/Views:\s+0/)).toBeInTheDocument();
    expect(screen.getByText(/Downloads:\s+0/)).toBeInTheDocument();
    expect(screen.getByText(/Likes:\s+0/)).toBeInTheDocument();
  });

  test('tags are rendered as inline-block elements', () => {
    render(<ImageCard image={mockImage} />);
    const tagElements = screen.getAllByText(/^#/);
    tagElements.forEach(tag => {
      expect(tag).toHaveClass('inline-block');
    });
  });

  test('image has correct styling classes', () => {
    render(<ImageCard image={mockImage} />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('w-full');
  });

  test('handles special characters in user name', () => {
    const imageWithSpecialUser = {
      ...mockImage,
      user: "O'Brien-Smith"
    };
    render(<ImageCard image={imageWithSpecialUser} />);
    expect(screen.getByText(/Photo by O'Brien-Smith/i)).toBeInTheDocument();
  });

  test('handles special characters in tags', () => {
    const imageWithSpecialTags = {
      ...mockImage,
      tags: 'nature-photography,hd-photo'
    };
    render(<ImageCard image={imageWithSpecialTags} />);
    expect(screen.getByText('#nature-photography')).toBeInTheDocument();
    expect(screen.getByText('#hd-photo')).toBeInTheDocument();
  });
});
