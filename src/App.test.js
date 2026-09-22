import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Tabla Înmulțirii game', () => {
  render(<App />);
  expect(screen.getByText(/TABLA ÎNMULȚIRII/i)).toBeInTheDocument();
});
