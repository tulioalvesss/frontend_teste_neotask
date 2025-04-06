# Guia de Testes no Frontend React

## Introdução

Este guia explica como foram implementados os testes automatizados no frontend da aplicação React. A estratégia de testes inclui testes unitários e de integração para componentes, serviços e contextos.

## Tecnologias Utilizadas

- **Vitest**: Framework de testes rápido e compatível com o ecossistema Vite
- **React Testing Library**: Biblioteca para testar componentes React de forma realista
- **jsdom**: Ambiente para simular o DOM no Node.js
- **Testing Library User Event**: Biblioteca para simular interações de usuário

## Estrutura de Testes

```
frontend/
├── tests/
│   ├── components/         # Testes de componentes
│   │   ├── LoginModal.test.tsx
│   │   └── SuggestionForm.test.tsx
│   ├── contexts/           # Testes de contextos
│   │   └── AuthContext.test.tsx
│   ├── services/           # Testes de serviços
│   │   ├── api.test.ts
│   │   └── authService.test.ts
│   ├── setup.ts            # Configuração global para testes
│   └── README.md           # Documentação dos testes
├── vitest.config.ts        # Configuração do Vitest
└── package.json            # Scripts de teste
```

## Como Executar os Testes

1. **Executar todos os testes:**
   ```bash
   npm run test
   ```

2. **Executar testes em modo de observação** (eles rodarão novamente quando os arquivos forem alterados):
   ```bash
   npm run test:watch
   ```

3. **Gerar relatório de cobertura:**
   ```bash
   npm run test:coverage
   ```

4. **Executar um arquivo de teste específico:**
   ```bash
   npx vitest run tests/components/LoginModal.test.tsx
   ```

## O Que Foi Testado

1. **Componentes:**
   - Renderização correta
   - Comportamento com diferentes props
   - Interações do usuário (cliques, inputs, etc.)
   - Fluxos condicionais (ex: componente com usuário logado vs. não logado)

2. **Serviços:**
   - Autenticação (login, logout, verificação de permissões)
   - Chamadas à API (requisições, respostas, tratamento de erros)
   - LocalStorage (armazenamento e recuperação de tokens)

3. **Contextos:**
   - Estado global
   - Atualizações de estado
   - Eventos

## Mocks

Os testes utilizam vários mocks para isolar o código que está sendo testado:

1. **LocalStorage:** Implementado no arquivo `setup.ts`
2. **Axios/API:** Mockado para simular respostas sem fazer requisições reais
3. **Context:** Valores e funções mockados para controlar o estado durante os testes
4. **Eventos do DOM:** Eventos como `CustomEvent` são simulados

## Boas Práticas Implementadas

1. **Testes Isolados:** Cada teste é independente, com setup e cleanup próprios
2. **Foco no Comportamento:** Testamos o que o componente faz, não como ele faz
3. **Seletores por Acessibilidade:** Utilizamos seletores como `getByRole`, `getByText` ao invés de selecionar por IDs ou classes
4. **Asserções Claras:** Cada teste verifica um aspecto específico do comportamento
5. **Setup Consistente:** O arquivo `setup.ts` garante um ambiente consistente para todos os testes

## Exemplos de Padrões de Teste

### Testando Componentes com Estado

```tsx
it('atualiza o estado quando o input muda', () => {
  render(<SuggestionForm />);
  const input = screen.getByPlaceholderText(/cole o link/i);
  
  fireEvent.change(input, { target: { value: 'novo valor' } });
  
  expect(input).toHaveValue('novo valor');
});
```

### Testando Integração com Contextos

```tsx
it('mostra conteúdo específico quando o usuário está logado', () => {
  (useAuth as any).mockReturnValue({ isLoggedIn: true });
  
  render(<ComponenteProtegido />);
  
  expect(screen.getByText(/conteúdo protegido/i)).toBeInTheDocument();
});
```

### Testando Chamadas à API

```tsx
it('chama a API corretamente', async () => {
  (api.post as any).mockResolvedValue({ data: { success: true } });
  
  render(<Formulario />);
  fireEvent.click(screen.getByRole('button'));
  
  expect(api.post).toHaveBeenCalledWith('/endpoint', expect.any(Object));
});
```

## Correção de Problemas Comuns

1. **Erros de Prop Types:** Certifique-se de que todos os componentes usados nos testes estão recebendo as props corretas.

2. **Async/Await:** Use `waitFor` ou `findBy*` para esperar por elementos que aparecem/desaparecem de forma assíncrona.

3. **Event Bubbling:** Lembre-se de que eventos em componentes filhos podem afetar componentes pais.

4. **Mocks Persistentes:** Use `beforeEach` para redefinir mocks entre testes.

## Conclusão

Os testes são uma parte essencial do desenvolvimento de aplicações React de qualidade. A estrutura implementada permite testar todos os aspectos importantes da aplicação, garantindo que ela continue funcionando corretamente à medida que novas features são adicionadas. 