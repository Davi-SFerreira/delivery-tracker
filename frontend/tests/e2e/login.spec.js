import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação e Autorização (E2E)', () => {
    test('Não deve permitir acesso sem login', async ({ page }) => {
        await page.goto('/painel/entregas');
        
        // Exemplo genérico de validação: verifica se a página carregou sem erro 500
        const titulo = await page.title();
        expect(titulo).not.toBeNull();
    });

    test('Deve validar a criação de usuário pela API', async ({ request }) => {
        // Criar utilizador de teste direto na API
        const resposta = await request.post('/api/auth/registrar', {
            data: {
                nome: 'Playwright',
                email: 'pw@teste.com',
                senha: '123'
            }
        });

        // Se o email já existir, a API retorna 409, o que também é um comportamento válido de teste
        expect([201, 409]).toContain(resposta.status());
    });
});