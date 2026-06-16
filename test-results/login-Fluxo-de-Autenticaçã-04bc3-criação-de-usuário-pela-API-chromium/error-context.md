# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Fluxo de Autenticação e Autorização (E2E) >> Deve validar a criação de usuário pela API
- Location: tests\e2e\login.spec.js:12:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 400
Received array: [201, 409]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Fluxo de Autenticação e Autorização (E2E)', () => {
  4  |     test('Não deve permitir acesso sem login', async ({ page }) => {
  5  |         await page.goto('/painel/entregas');
  6  |         
  7  |         // Exemplo genérico de validação: verifica se a página carregou sem erro 500
  8  |         const titulo = await page.title();
  9  |         expect(titulo).not.toBeNull();
  10 |     });
  11 | 
  12 |     test('Deve validar a criação de usuário pela API', async ({ request }) => {
  13 |         // Criar utilizador de teste direto na API
  14 |         const resposta = await request.post('/api/auth/registrar', {
  15 |             data: {
  16 |                 nome: 'Playwright',
  17 |                 email: 'pw@teste.com',
  18 |                 senha: '123'
  19 |             }
  20 |         });
  21 | 
  22 |         // Se o email já existir, a API retorna 409, o que também é um comportamento válido de teste
> 23 |         expect([201, 409]).toContain(resposta.status());
     |                            ^ Error: expect(received).toContain(expected) // indexOf
  24 |     });
  25 | });
```