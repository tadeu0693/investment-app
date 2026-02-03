# 📊 App de Investimentos - Dados Reais do Mercado Brasileiro

🚀 **Aplicação React pronta para deploy no Vercel!**

Exibe dados em tempo real: Ibovespa, Dólar, Ações e Notícias do mercado brasileiro.

---

## 🎯 DEPLOY NO VERCEL - PASSO A PASSO SIMPLES

### ✅ **MÉTODO 1: Via GitHub + Vercel (RECOMENDADO)**

**1. Suba o projeto para o GitHub:**

```bash
# Na pasta do projeto, execute:
git init
git add .
git commit -m "Initial commit - Investment App"
git branch -M main

# Crie um repositório no GitHub (https://github.com/new)
# Depois conecte e envie:
git remote add origin https://github.com/SEU-USUARIO/investment-app.git
git push -u origin main
```

**2. Deploy no Vercel:**

- Acesse: https://vercel.com
- Clique em **"Add New"** → **"Project"**
- Clique em **"Import Git Repository"**
- Selecione seu repositório `investment-app`
- **IMPORTANTE**: Configure assim:
  - **Framework Preset**: Create React App
  - **Build Command**: `npm run build`
  - **Output Directory**: `build`
  - **Install Command**: `npm install`
- Clique em **"Deploy"**
- ✅ **Pronto!** Em 2-3 minutos estará online!

---

### ✅ **MÉTODO 2: Via Vercel CLI (Terminal)**

```bash
# 1. Entre na pasta do projeto
cd investment-app-react

# 2. Instale o Vercel CLI globalmente
npm install -g vercel

# 3. Faça login no Vercel
vercel login

# 4. Deploy!
vercel

# Siga as instruções:
# - Set up and deploy? → Yes
# - Which scope? → Sua conta
# - Link to existing project? → No
# - Project name? → investment-app (ou o que quiser)
# - Directory? → ./ (pasta atual)
# - Want to override settings? → No

# 5. Para deploy em produção (URL definitiva)
vercel --prod
```

---

### ✅ **MÉTODO 3: Upload Direto no Vercel**

**Se os métodos acima não funcionarem:**

1. Faça o build localmente:
```bash
npm install
npm run build
```

2. Acesse: https://vercel.com
3. Clique em **"Add New"** → **"Project"**
4. Arraste a pasta **`build`** para fazer upload
5. Deploy concluído! 🎉

---

## 💻 RODAR LOCALMENTE (TESTE ANTES DE FAZER DEPLOY)

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm start

# 3. Abrir no navegador
# O app abrirá automaticamente em http://localhost:3000
```

---

## 📁 ESTRUTURA DO PROJETO

```
investment-app-react/
├── public/
│   ├── index.html          # HTML principal
│   ├── manifest.json       # PWA config
│   └── robots.txt          # SEO
├── src/
│   ├── App.js             # 🎯 SEU COMPONENTE PRINCIPAL
│   ├── index.js           # Ponto de entrada React
│   └── index.css          # Estilos com Tailwind
├── package.json           # Dependências
├── .gitignore            # Arquivos ignorados
└── README.md             # Este arquivo
```

---

## 🔧 TECNOLOGIAS

- ⚛️ **React 18** - Create React App
- 🎨 **Tailwind CSS** (via CDN)
- 🎯 **Lucide React** - Ícones modernos
- ☁️ **Vercel** - Hospedagem gratuita

---

## 📡 APIs UTILIZADAS

- **Brapi.dev** - Ações e Ibovespa
- **AwesomeAPI** - Cotação do Dólar
- **Brapi News** - Notícias do mercado

---

## ❗ SOLUÇÃO DE PROBLEMAS

### ❌ **Erro 404 no Vercel**
✅ **Solução**: Configure o Build Command como `npm run build` e Output Directory como `build`

### ❌ **"Module not found"**
```bash
# Execute:
npm install
```

### ❌ **APIs não carregam**
✅ As APIs públicas podem ter rate limits
✅ Aguarde alguns segundos e clique em "Atualizar"
✅ Abra o Console do navegador (F12) para ver erros

### ❌ **Build falha no Vercel**
✅ Verifique se o build local funciona: `npm run build`
✅ Veja os logs de erro no painel do Vercel
✅ Certifique-se que todas as dependências estão no `package.json`

---

## 🎯 CHECKLIST PARA DEPLOY PERFEITO

- [ ] Código subido no GitHub
- [ ] Conta criada no Vercel (vercel.com)
- [ ] Repositório importado no Vercel
- [ ] Framework = "Create React App"
- [ ] Build Command = "npm run build"
- [ ] Output Directory = "build"
- [ ] Clicado em "Deploy"
- [ ] ✅ App funcionando!

---

## ⚠️ AVISO IMPORTANTE

📌 Este app é apenas para fins **educacionais**
📌 **NÃO** constitui recomendação de investimento
📌 Dados fornecidos por APIs públicas (podem ter delay)
📌 Sempre consulte um especialista antes de investir

---

## 📞 PRECISA DE AJUDA?

Se ainda estiver com problemas:

1. ✅ Verifique se rodou `npm install`
2. ✅ Teste localmente com `npm start`
3. ✅ Teste o build com `npm run build`
4. ✅ Veja os logs no painel do Vercel
5. ✅ Certifique-se de escolher "Create React App" como framework

---

## 📝 LICENÇA

Livre para uso educacional. 

---

**Feito com ❤️ usando React**
