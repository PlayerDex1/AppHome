# Meu App Financeiro - PWA (Pronto para deploy no Vercel)

Este projeto é um PWA minimal pronto para deploy no Vercel. Inclui:
- Next.js + next-pwa (service worker + manifest)
- Página para escanear recibos com câmera (Barcode/QR + OCR via Tesseract.js)
- Integração inicial com Supabase (upload de imagem e salvar JSON do receipt)
- Instruções passo-a-passo para deploy no Vercel

## Como usar localmente
1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env.local` na raiz com as variáveis (exemplo abaixo).
3. Rode em modo dev:
   ```bash
   npm run dev
   ```
4. Abra http://localhost:3000 e vá para `/scan` para testar scanner.

## Variáveis de ambiente necessárias (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-secret (apenas server-side)
```
**Não** comite chaves sensíveis no repositório.

## Deploy (Vercel)
1. Crie um repositório no GitHub e envie todo o conteúdo deste projeto.
2. Crie conta no Vercel e conecte ao repositório.
3. Em Settings > Environment Variables do projeto Vercel, adicione as mesmas variáveis de `.env.local`.
4. Deploy automático será feito pelo Vercel.

## Observações
- Tesseract.js roda no cliente; para recibos complexos, considere usar OCR cloud (Google Vision). 
- Barcode/QR detection usa `BarcodeDetector` quando disponível e `jsQR` como fallback (scan de foto).
- Este é um projeto base. Ajuste CSS, UI e parser conforme seu cupom/nota local.

---
Se quiser, eu já gero também um README personalizado para o repositório GitHub com os comandos de CI/CD e um workflow de deploy automático no Vercel. Quer que eu faça isso também?
