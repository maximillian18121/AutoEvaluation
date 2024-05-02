import { render, screen } from '@testing-library/react';
import App from './App';

test('Testcase - 1', () => {
  render(<App />);
  const linkElement = screen.getByText(/This is first test Case/i);
  expect(linkElement).toBeInTheDocument();
});
