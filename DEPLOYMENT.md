# 🚀 Guia de Deploy no Vercel

Este guia explica como fazer o deploy do Pollinations Mega Agent no Vercel.

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab, ou Bitbucket)

## Método 1: Deploy via Dashboard do Vercel (Recomendado)

1. **Faça Push do Código para o Git**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Conecte ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório

3. **Configure o Projeto**
   - O Vercel detectará automaticamente as configurações
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Deploy!**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Seu app estará disponível em `https://seu-projeto.vercel.app`

## Método 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login no Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Deploy para Produção**
   ```bash
   vercel --prod
   ```

## Configuração Automática

O projeto já está configurado com:

- ✅ `vercel.json` - Configuração de rotas e build
- ✅ `api/index.ts` - Serverless function para o backend
- ✅ Scripts de build otimizados
- ✅ Configuração de rewrites para API

## Estrutura de Deploy

```
Vercel Deploy
├── Frontend (Static)
│   └── client/dist/* → Servido como arquivos estáticos
│
└── Backend (Serverless)
    └── /api/* → Roteado para api/index.ts
```

## Variáveis de Ambiente (Opcional)

Se você precisar adicionar variáveis de ambiente:

1. No Dashboard do Vercel, vá em Settings → Environment Variables
2. Adicione suas variáveis
3. Redeploy o projeto

## Troubleshooting

### Build Falha

**Problema**: Build falha com erro de TypeScript
**Solução**: Certifique-se de que todas as dependências estão instaladas:

```bash
npm install
npm run build
```

### API não responde

**Problema**: Rotas `/api/*` retornam 404
**Solução**: Verifique se o arquivo `api/index.ts` existe e está correto

### Frontend não carrega

**Problema**: Página em branco após deploy
**Solução**: Verifique se o build do cliente foi bem-sucedido:

```bash
cd client
npm run build
```

## Atualizações Automáticas

Após o primeiro deploy, o Vercel automaticamente:

- ✅ Faz deploy de cada push para `main`
- ✅ Cria preview deploys para PRs
- ✅ Executa builds e testes

## Domínio Customizado

Para adicionar um domínio customizado:

1. Vá em Settings → Domains
2. Adicione seu domínio
3. Configure os DNS conforme instruções
4. Aguarde propagação (pode levar até 48h)

## Monitoramento

O Vercel fornece:

- 📊 Analytics de performance
- 🔍 Logs de função serverless
- 📈 Métricas de uso
- ⚡ Web Vitals

Acesse em: Dashboard → Analytics

## Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Status do Vercel](https://www.vercel-status.com/)
