# Correção para erro de build no Vercel: "Couldn't find any `pages` or `app` directory"

O Vercel/Next falha quando não encontra diretório `pages` (ou `app`) na raiz do projeto.
Este pacote adiciona páginas mínimas e arquivos de configuração para corrigir o problema.

**Como aplicar as correções no seu repositório (passo-a-passo):**

1. Faça download deste ZIP e descompacte na raiz do seu repositório local (substitua/mescle os arquivos):
   ```bash
   unzip pwa_project_fix.zip -d /caminho/para/seu/repo
   ```
2. Verifique alterações:
   ```bash
   git status
   git add pages next.config.js package.json README_FIX.md
   git commit -m "fix: add minimal pages/ and next.config to fix Vercel build error"
   git push origin main
   ```
3. Aguarde o Vercel executar novo deploy (ou force um redeploy no painel).

**Observações:**
- Se o seu projeto estiver em uma subpasta (ex.: `web/`), certifique-se de apontar Root Directory na importação do Vercel para a subpasta correta, em vez de usar a raiz do repositório.
- Este patch é mínimo; depois você pode mesclar seu código original nas páginas existentes.
