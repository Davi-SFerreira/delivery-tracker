import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Entregas (E2E)', () => {
    test('Deve criar uma entrega e exibir na lista', async ({ page }) => {
        await page.goto('/painel/entregas');
        
        await page.click('[data-testid="btn-nova-entrega"]');
        
        // Gera um carimbo de tempo para a descrição ser sempre única
        const identificadorUnico = `Pacote E2E - ${Date.now()}`;

        await page.fill('input[name="descricao"]', identificadorUnico);
        await page.fill('input[name="origem"]', 'Recife');
        await page.fill('input[name="destino"]', 'Fortaleza');
        
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/painel\/entregas/);
        await expect(page.locator('body')).toContainText('Entrega criada com sucesso!');
        await expect(page.locator('table')).toContainText(identificadorUnico);
    });
});