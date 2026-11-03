import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Math Owl game', () => {
  render(<App />);
  expect(screen.getByText(/MATH OWL/i)).toBeInTheDocument();
});
