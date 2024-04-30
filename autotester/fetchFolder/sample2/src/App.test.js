import { render, screen } from '@testing-library/react';
import App from './App';

test('Testcase - 1', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is first test Case/i);
  expect(linkElement).toBeInTheDocument();
});

test('Testcase - 2', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is second test Case/i);
  expect(linkElement).toBeInTheDocument();
});

test('Testcase - 3', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is third test Case/i);
  expect(linkElement).toBeInTheDocument();
});
