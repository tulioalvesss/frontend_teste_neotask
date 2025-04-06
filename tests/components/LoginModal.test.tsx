import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from '~/components/LoginModal';

// Mock para o componente Login que é usado dentro do LoginModal
vi.mock('~/components/Login', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="login-component">
      <button onClick={onClose} data-testid="mock-login-close-btn">Close Login</button>
    </div>
  )
}));

describe('LoginModal', () => {
  const mockOnClose = vi.fn();

  // Helper para renderizar com o router
  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renderiza corretamente quando aberto', () => {
    renderWithRouter(<LoginModal open={true} onClose={mockOnClose} />);
    
    // Verifica se o componente Login está sendo renderizado dentro do modal
    expect(screen.getByTestId('login-component')).toBeInTheDocument();
    
    // Verifica se o botão de fechar está presente
    expect(screen.getByLabelText('fechar')).toBeInTheDocument();
  });

  it('não renderiza nada quando fechado', () => {
    const { container } = renderWithRouter(<LoginModal open={false} onClose={mockOnClose} />);
    
    // O modal não deve renderizar conteúdo quando fechado
    expect(container.firstChild).toBeNull();
  });

  it('chama onClose quando o botão de fechar é clicado', () => {
    renderWithRouter(<LoginModal open={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('fechar');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('chama onClose quando o componente Login emite evento de fechamento', () => {
    renderWithRouter(<LoginModal open={true} onClose={mockOnClose} />);
    
    const loginCloseButton = screen.getByTestId('mock-login-close-btn');
    fireEvent.click(loginCloseButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('mostra o link para registro', () => {
    renderWithRouter(<LoginModal open={true} onClose={mockOnClose} />);
    
    const registerLink = screen.getByText('Registrar');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/login');
  });
}); 