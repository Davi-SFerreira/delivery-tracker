# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: entregas.spec.js >> Gerenciamento de Entregas (E2E) >> Deve criar uma entrega e exibir na lista
- Location: tests\e2e\entregas.spec.js:4:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
- Expected substring  -  1
+ Received string     + 48

- Entrega criada com sucesso!
+
+     
+     Delivery Tracker - Painel Interno |
+     Entregas |
+     Motoristas
+
+     
+
+
+     
+         
+ Invalid `prisma.entrega.findMany()` invocation:
+
+
+ error: Environment variable not found: DATABASE_URL.
+   -->  schema.prisma:7
+    | 
+  6 |   provider = "postgresql"
+  7 |   url      = env("DATABASE_URL")
+    | 
+
+ Validation Error Count: 1
+     
+
+
+     Cadastrar Nova Entrega
+
+     
+         
+             Descrição:
+             
+         
+         
+         
+             Origem:
+             
+         
+         
+         
+             Destino:
+             
+         
+         
+         Salvar Entrega
+         Cancelar
+     
+
+

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    13 × locator resolved to <body>…</body>
       - unexpected value "
    
    Delivery Tracker - Painel Interno |
    Entregas |
    Motoristas

    


    
        
Invalid `prisma.entrega.findMany()` invocation:


error: Environment variable not found: DATABASE_URL.
  -->  schema.prisma:7
   | 
 6 |   provider = "postgresql"
 7 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
    


    Cadastrar Nova Entrega

    
        
            Descrição:
            
        
        
        
            Origem:
            
        
        
        
            Destino:
            
        
        
        Salvar Entrega
        Cancelar
    

"

```

```yaml
- navigation:
  - strong: Delivery Tracker - Painel Interno
  - text: "|"
  - link "Entregas":
    - /url: /painel/entregas
  - text: "|"
  - link "Motoristas":
    - /url: /painel/motoristas
- text: "Invalid `prisma.entrega.findMany()` invocation: error: Environment variable not found: DATABASE_URL. --> schema.prisma:7 | 6 | provider = \"postgresql\" 7 | url = env(\"DATABASE_URL\") | Validation Error Count: 1"
- heading "Cadastrar Nova Entrega" [level=2]
- text: "Descrição:"
- textbox: Pacote E2E - 1781654102627
- text: "Origem:"
- textbox: Recife
- text: "Destino:"
- textbox: Fortaleza
- button "Salvar Entrega"
- link "Cancelar":
  - /url: /painel/entregas
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Gerenciamento de Entregas (E2E)', () => {
  4  |     test('Deve criar uma entrega e exibir na lista', async ({ page }) => {
  5  |         await page.goto('/painel/entregas');
  6  |         
  7  |         await page.click('[data-testid="btn-nova-entrega"]');
  8  |         
  9  |         // Gera um carimbo de tempo para a descrição ser sempre única
  10 |         const identificadorUnico = `Pacote E2E - ${Date.now()}`;
  11 | 
  12 |         await page.fill('input[name="descricao"]', identificadorUnico);
  13 |         await page.fill('input[name="origem"]', 'Recife');
  14 |         await page.fill('input[name="destino"]', 'Fortaleza');
  15 |         
  16 |         await page.click('button[type="submit"]');
  17 | 
  18 |         await expect(page).toHaveURL(/.*\/painel\/entregas/);
> 19 |         await expect(page.locator('body')).toContainText('Entrega criada com sucesso!');
     |                                            ^ Error: expect(locator).toContainText(expected) failed
  20 |         await expect(page.locator('table')).toContainText(identificadorUnico);
  21 |     });
  22 | });
```