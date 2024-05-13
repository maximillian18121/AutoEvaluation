import { render, screen } from '@testing-library/react';
import App from './App';

test('Testcase - 1', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is first test Case/i);
  expect(linkElement).toBeInTheDocument();
});

test('Testcase - 2', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is secnd test Case/i);
  expect(linkElement).toBeInTheDocument();
});

