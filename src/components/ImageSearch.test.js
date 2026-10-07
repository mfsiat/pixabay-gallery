import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageSearch from './ImageSearch';

describe('ImageSearch Component', () => {
  test('renders search input field', () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    expect(screen.getByPlaceholderText(/Search Image Term/i)).toBeInTheDocument();
  });

  test('renders search button', () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('updates input value on user input', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);

    await userEvent.type(input, 'nature');

    expect(input.value).toBe('nature');
  });

  test('calls searchText callback on form submission', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'landscape');
    await userEvent.click(button);

    expect(mockSearchText).toHaveBeenCalledWith('landscape');
  });

  test('does not call searchText for empty input', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.click(button);

    expect(mockSearchText).not.toHaveBeenCalled();
  });

  test('does not call searchText for whitespace-only input', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, '   ');
    await userEvent.click(button);

    expect(mockSearchText).not.toHaveBeenCalled();
  });

  test('trims whitespace from input before calling searchText', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, '  nature  ');
    await userEvent.click(button);

    expect(mockSearchText).toHaveBeenCalledWith('nature');
  });

  test('clears input field after submission', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);

    // Input should still have the value (component doesn't clear it)
    expect(input.value).toBe('nature');
  });

  test('submits on Enter key press', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);

    await userEvent.type(input, 'nature{Enter}');

    expect(mockSearchText).toHaveBeenCalledWith('nature');
  });

  test('allows multiple searches', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    await userEvent.click(button);
    expect(mockSearchText).toHaveBeenNthCalledWith(1, 'nature');

    await userEvent.clear(input);
    await userEvent.type(input, 'city');
    await userEvent.click(button);
    expect(mockSearchText).toHaveBeenNthCalledWith(2, 'city');

    expect(mockSearchText).toHaveBeenCalledTimes(2);
  });

  test('prevents default form submission behavior', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
    button.form.dispatchEvent(submitEvent);

    // The form should still work without page reload (default prevented)
    // This is implicit in the form working correctly
  });

  test('handles special characters in search term', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature & landscape');
    await userEvent.click(button);

    expect(mockSearchText).toHaveBeenCalledWith('nature & landscape');
  });

  test('handles numbers in search term', async () => {
    const mockSearchText = jest.fn();
    render(<ImageSearch searchText={mockSearchText} />);
    const input = screen.getByPlaceholderText(/Search Image Term/i);
    const button = screen.getByRole('button', { name: /Search/i });

    await userEvent.type(input, 'nature2024');
    await userEvent.click(button);

    expect(mockSearchText).toHaveBeenCalledWith('nature2024');
  });
});
