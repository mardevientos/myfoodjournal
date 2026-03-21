# 🍽️ My Food Journal

Ricettario personale con AI, multilingua, ricettario condiviso e PWA.

---

## 🚀 Deploy su Vercel (gratis, 5 minuti)

### Metodo 1 — Drag & Drop (il più semplice)

1. Vai su **[vercel.com](https://vercel.com)** e crea un account gratuito (puoi accedere con Google)
2. Comprimi questa cartella in un file `.zip`
3. Nella dashboard Vercel clicca **"Add New Project"**
4. Trascina il file `.zip` nella pagina
5. Clicca **"Deploy"**
6. In 2 minuti ricevi un link tipo `myfoodjournal-xxxx.vercel.app` ✅

### Metodo 2 — GitHub (consigliato per aggiornamenti)

```bash
# 1. Installa Node.js da https://nodejs.org (versione LTS)
# 2. Apri il terminale in questa cartella

npm install          # installa le dipendenze
npm run build        # crea la cartella /build

# 3. Installa Vercel CLI
npm install -g vercel

# 4. Deploy
vercel --prod
```

---

## 🛠️ Sviluppo locale

```bash
npm install
npm start
# Apri http://localhost:3000
```

---

## 📲 Come installare come PWA

Una volta pubblicata su Vercel:

**iPhone/iPad:**
Safari → Condividi ⬆️ → Aggiungi a schermata Home

**Android:**
Chrome → ⋮ → Aggiungi a schermata Home

---

## 🌐 Funzionalità

- ✅ Import ricette da URL (Instagram, TikTok, Pinterest, siti web)
- ✅ Foto personali dalla galleria del telefono
- ✅ Modalità cottura guidata step-by-step
- ✅ Lista della spesa con spunta
- ✅ AI Chef (chat con Claude)
- ✅ Ricettario condiviso (tutti vedono le stesse ricette)
- ✅ Multilingua: 🇮🇹 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇸🇦
- ✅ PWA installabile + Share Target (menu Condividi)
- ✅ Dati salvati in modo persistente

---

## 🔑 API Key

L'app usa l'API di Anthropic (Claude) per l'AI Chef e l'import da URL.
Funziona automaticamente quando usata dentro Claude.ai.

Per il deploy autonomo su Vercel, aggiungi la tua API key:
1. Crea un account su [console.anthropic.com](https://console.anthropic.com)
2. Genera una API key
3. In Vercel → Settings → Environment Variables → aggiungi:
   `REACT_APP_ANTHROPIC_KEY = sk-ant-...`
4. Nel codice `src/App.jsx`, aggiungi l'header:
   `"x-api-key": process.env.REACT_APP_ANTHROPIC_KEY`

---

## 📁 Struttura progetto

```
myfoodjournal/
├── public/
│   ├── index.html       # HTML base
│   ├── manifest.json    # PWA manifest + Share Target
│   └── sw.js            # Service Worker
├── src/
│   ├── App.jsx          # App principale
│   ├── i18n.js          # Traduzioni (IT/EN/ES/FR/DE/AR)
│   └── index.js         # Entry point + registrazione SW
└── package.json
```
