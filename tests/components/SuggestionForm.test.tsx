import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SuggestionForm from '~/components/SuggestionForm';
import { useAuth } from '~/contexts/AuthContext';

// Mock dos módulos
vi.mock('~/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isLoggedIn: true
  }))
}));

describe('SuggestionForm', () => {
  const mockOnLoginClick = vi.fn();
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('renderiza o formulário de sugestão corretamente', () => {
    render(
      <SuggestionForm 
        onLoginClick={mockOnLoginClick}
        onSubmit={mockOnSubmit}
      />
    );
    
    // Verifica se os campos de input estão presentes
    expect(screen.getByLabelText(/título da música/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link do youtube/i)).toBeInTheDocument();
    
    // Verifica se o botão de enviar está presente
    expect(screen.getByRole('button', { name: /enviar sugestão/i })).toBeInTheDocument();
  });
  
  it('chama onLoginClick quando o usuário não está logado', () => {
    // Configurar o useAuth para retornar que o usuário não está logado
    (useAuth as any).mockReturnValue({ isLoggedIn: false });
    
    render(
      <SuggestionForm 
        onLoginClick={mockOnLoginClick}
        onSubmit={mockOnSubmit}
      />
    );
    
    // Digitar valores nos campos
    const titleInput = screen.getByLabelText(/título da música/i);
    const linkInput = screen.getByLabelText(/link do youtube/i);
    
    fireEvent.change(titleInput, { target: { value: 'Música de Teste' } });
    fireEvent.change(linkInput, { target: { value: 'https://www.youtube.com/watch?v=test123' } });
    
    // Clicar no botão de sugerir
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    
    // Verificar se a função onLoginClick foi chamada
    expect(mockOnLoginClick).toHaveBeenCalled();
    
    // A função onSubmit não deve ser chamada
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('envia a sugestão quando o usuário está logado e os campos são válidos', () => {
    // Configurar o useAuth para retornar que o usuário está logado
    (useAuth as any).mockReturnValue({ isLoggedIn: true });
    
    render(
      <SuggestionForm 
        onLoginClick={mockOnLoginClick}
        onSubmit={mockOnSubmit}
      />
    );
    
    // Digitar valores nos campos
    const titleInput = screen.getByLabelText(/título da música/i);
    const linkInput = screen.getByLabelText(/link do youtube/i);
    
    fireEvent.change(titleInput, { target: { value: 'Música de Teste' } });
    fireEvent.change(linkInput, { target: { value: 'https://www.youtube.com/watch?v=test123' } });
    
    // Clicar no botão de sugerir
    const submitButton = screen.getByRole('button', { name: /enviar sugestão/i });
    fireEvent.click(submitButton);
    
    // Verificar que a função onSubmit foi chamada com os dados corretos
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Música de Teste',
      link: 'https://www.youtube.com/watch?v=test123'
    });
    
    // A função onLoginClick não deve ser chamada
    expect(mockOnLoginClick).not.toHaveBeenCalled();
  });
  
  it('exibe mensagens de erro para campos inválidos', () => {
    // Configurar o useAuth para retornar que o usuário está logado
    (useAuth as any).mockReturnValue({ isLoggedIn: true });
    
    render(
      <SuggestionForm 
        onLoginClick={mockOnLoginClick}
        onSubmit={mockOnSubmit}
      />
    );
    
    // Tentar enviar sem preencher os campos
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    
    // Verificar se as mensagens de erro são exibidas
    expect(screen.getByText(/por favor, informe o título da música/i)).toBeInTheDocument();
    expect(screen.getByText(/por favor, informe o link do youtube/i)).toBeInTheDocument();
    
    // A função onSubmit não deve ser chamada
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('valida o formato do link do YouTube', () => {
    // Configurar o useAuth para retornar que o usuário está logado
    (useAuth as any).mockReturnValue({ isLoggedIn: true });
    
    render(
      <SuggestionForm 
        onLoginClick={mockOnLoginClick}
        onSubmit={mockOnSubmit}
      />
    );
    
    // Preencher o título, mas usar um link inválido
    const titleInput = screen.getByLabelText(/título da música/i);
    const linkInput = screen.getByLabelText(/link do youtube/i);
    
    fireEvent.change(titleInput, { target: { value: 'Música de Teste' } });
    fireEvent.change(linkInput, { target: { value: 'link-invalido' } });
    
    // Tentar enviar
    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);
    
    // Verificar se a mensagem de erro para o link é exibida
    expect(screen.getByText(/por favor, informe um link válido do youtube/i)).toBeInTheDocument();
    
    // A função onSubmit não deve ser chamada
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 