# Testes do Frontend React

Este diretório contém os testes automatizados para o frontend React da aplicação. Os testes foram organizados seguindo as boas práticas de React Testing Library e Vitest.

## Estrutura de Testes

```
tests/
├── components/       # Testes para componentes React
├── contexts/         # Testes para contextos React
├── services/         # Testes para serviços (API, autenticação, etc.)
├── setup.ts          # Configuração global para testes
└── README.md         # Esta documentação
```

## Tecnologias Utilizadas

- **Vitest**: Framework de teste rápido, compatível com Vite
- **React Testing Library**: Biblioteca para testar componentes React
- **jsdom**: Permite simular o DOM para testes de componentes
- **Testing Library User Event**: Simulação de interações de usuário

## Como Executar os Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo de observação
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Cobertura de Testes

Os testes cobrem as seguintes funcionalidades:

1. **Componentes**:
   - Renderização correta
   - Interações do usuário (cliques, eventos, etc.)
   - Comportamento de UI

2. **Serviços**:
   - Serviço de autenticação
   - Chamadas de API
   - Interceptação e tratamento de erros

3. **Contextos**:
   - Contexto de autenticação
   - Estado global
   - Atualização de estado

## Boas Práticas

1. **Isolar Testes**: Cada teste é independente e isolado
2. **Uso de Mocks**: Serviços externos são simulados
3. **Teste de Comportamento**: Focamos em testar o comportamento e não a implementação
4. **Cleanup**: Limpeza após cada teste para evitar efeitos colaterais
5. **Cobertura de Código**: Busca-se uma boa cobertura de código
6. **Testes Realistas**: Simulação de interações reais do usuário

## Mock de Serviços Externos

Para simular o localStorage, fetch API e outros métodos do navegador, usamos o arquivo `setup.ts` que configura mocks globais para todos os testes.

## Exemplos

### Testando um Componente

```tsx
// Exemplo de teste para um componente
it('renderiza corretamente quando aberto', () => {
  render(<LoginModal open={true} onClose={() => {}} />);
  expect(screen.getByTestId('login-component')).toBeInTheDocument();
});
```

### Testando um Serviço

```tsx
// Exemplo de teste para um serviço
it('retorna true quando há token no localStorage', () => {
  localStorage.setItem('authToken', 'fake-token');
  expect(authService.isAuthenticated()).toBe(true);
});
```

### Testando um Contexto

```tsx
// Exemplo de teste para um contexto
it('atualiza estado quando setLoggedIn é chamado', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  act(() => {
    result.current.setLoggedIn(true);
  });
  expect(result.current.isLoggedIn).toBe(true);
});
``` 