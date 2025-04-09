import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LearningSettings from '../LearningSettings';
import { LearningSettingsProvider } from '../../contexts/LearningSettingsContext';

// Mock the fetch function
global.fetch = jest.fn();

describe('LearningSettings', () => {
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    // Mock successful initial preferences fetch with delay
    mockFetch.mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  id: '1',
                  userId: 'default-user',
                  hintLevel: 50,
                  translationDetail: 50,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }),
            }),
          100
        )
      )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton initially', async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <LearningSettingsProvider>
          <LearningSettings />
        </LearningSettingsProvider>
      );
    });
    
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Wait for loading to complete to clean up
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
  });

  it('renders sliders with initial values', async () => {
    await act(async () => {
      render(
        <LearningSettingsProvider>
          <LearningSettings />
        </LearningSettingsProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Hint Level')).toHaveValue('50');
      expect(screen.getByLabelText('Translation Detail')).toHaveValue('50');
    });
  });

  it('updates hint level when slider is moved', async () => {
    // Mock the update API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: '1',
            userId: 'default-user',
            hintLevel: 75,
            translationDetail: 50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
      })
    );

    await act(async () => {
      render(
        <LearningSettingsProvider>
          <LearningSettings />
        </LearningSettingsProvider>
      );
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByLabelText('Hint Level')).toBeInTheDocument();
    });

    // Change hint level
    await act(async () => {
      const hintSlider = screen.getByLabelText('Hint Level');
      fireEvent.change(hintSlider, { target: { value: '75' } });
    });

    // Verify API was called with correct value
    await waitFor(() => {
      expect(mockFetch).toHaveBeenLastCalledWith('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hintLevel: 75 }),
      });
    });
  });

  it('updates translation detail when slider is moved', async () => {
    // Mock the update API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: '1',
            userId: 'default-user',
            hintLevel: 50,
            translationDetail: 25,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
      })
    );

    await act(async () => {
      render(
        <LearningSettingsProvider>
          <LearningSettings />
        </LearningSettingsProvider>
      );
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByLabelText('Translation Detail')).toBeInTheDocument();
    });

    // Change translation detail
    await act(async () => {
      const detailSlider = screen.getByLabelText('Translation Detail');
      fireEvent.change(detailSlider, { target: { value: '25' } });
    });

    // Verify API was called with correct value
    await waitFor(() => {
      expect(mockFetch).toHaveBeenLastCalledWith('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translationDetail: 25 }),
      });
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock a failed API call
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockFetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    await act(async () => {
      render(
        <LearningSettingsProvider>
          <LearningSettings />
        </LearningSettingsProvider>
      );
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByLabelText('Hint Level')).toBeInTheDocument();
    });

    // Change hint level
    await act(async () => {
      const hintSlider = screen.getByLabelText('Hint Level');
      fireEvent.change(hintSlider, { target: { value: '75' } });
    });

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading preferences:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
}); 