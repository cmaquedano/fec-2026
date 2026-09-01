# FEC_2026 // Sistemas de Informação — UNIARA

Aplicação web full-stack para a **Feira de Cursos da UNIARA (FEC 2026)**, desenvolvida pelo curso de
Sistemas de Informação — 4º semestre.

Interface hacker/cyberpunk/futurista + backend real (Node.js + Express + SQLite) com upload de
imagens, moderação administrativa e autenticação segura.

> Você escaneia um QR Code espalhado pelo campus e acessa a "rede digital" do curso: conhece o curso,
> vê a galeria de fotos enviadas por outros visitantes e envia a sua própria, com autorização LGPD.

---

## 1. Tecnologias

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3`
- Multer (upload) + Sharp (processamento/otimização de imagens)
- bcryptjs (hash de senha) + JSON Web Token em cookie `httpOnly` (sessão administrativa)
- Helmet, CORS, express-rate-limit, morgan

**Frontend**
- React 18 + TypeScript + Vite
- React Router
- Tailwind CSS (design tokens cyberpunk: cores, tipografia Orbitron / Space Grotesk / JetBrains Mono)
- lucide-react (ícones)

---

## 2. Estrutura de pastas

```
fec-2026/
├── backend/
│   ├── server.js                 # ponto de entrada do servidor Express
│   ├── database/
│   │   ├── db.js                 # conexão SQLite + aplicação do schema
│   │   ├── schema.sql            # tabelas: photos, admins, logs
│   │   └── seed.js               # cria o admin inicial (hash bcrypt)
│   ├── routes/                   # photos.js, admin.js, stats.js
│   ├── controllers/              # photoController.js, adminController.js
│   ├── middleware/                # upload.js (Multer), auth.js (JWT)
│   ├── uploads/                   # originals/ e thumbnails/ (gerado em runtime)
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Home, Gallery, Upload, AdminLogin, AdminDashboard
│   │   ├── components/            # Navbar, Footer, LoadingScreen, HUD, PhotoCard, TermsModal...
│   │   ├── context/AuthContext.tsx
│   │   ├── api/client.ts          # cliente HTTP da API
│   │   └── styles/index.css       # design system (cores, glow, scanlines, grid)
│   └── vite.config.ts
└── README.md
```

---

## 3. Como instalar e executar (modo rápido — um único terminal)

O projeto é organizado como um **workspace único**: mesmo com as pastas `backend/` e `frontend/`
separadas internamente (boa prática, evita misturar código de servidor com código de interface), você
só precisa rodar comandos a partir da pasta raiz `fec-2026`, uma única vez.

### Pré-requisitos
- Node.js 18+ instalado

### 3.1 Instalar tudo de uma vez

Na pasta raiz do projeto (`fec-2026`):

```bash
npm install
```

Esse único comando instala as dependências do backend **e** do frontend (graças ao `workspaces` do
`package.json` da raiz).

### 3.2 Configurar o `.env` do backend

```bash
copy backend\.env.example backend\.env
```
*(no Mac/Linux: `cp backend/.env.example backend/.env`)*

Abra `backend/.env` e defina:
- `JWT_SECRET` — um valor aleatório forte
- `ADMIN_USERNAME` e `ADMIN_PASSWORD` — credenciais do administrador inicial

### 3.3 Criar o administrador

Ainda na raiz:

```bash
npm run seed
```

### 3.4 Subir backend + frontend juntos

```bash
npm run dev
```

Esse comando sobe o **backend** (`http://localhost:3001`) e o **frontend** (`http://localhost:5173`)
ao mesmo tempo, no mesmo terminal, cada um com um prefixo colorido (`BACKEND` / `FRONTEND`) no log.

Abra `http://localhost:5173` no navegador (ou no celular, na mesma rede, apontando o QR Code para o IP
da máquina).

Para parar os dois processos, use `Ctrl+C` no terminal.

### 3.5 (Opcional) Rodar cada parte separadamente

Se preferir dois terminais (por exemplo, para ver os logs de cada lado isolado):

```bash
npm run dev -w backend
```
```bash
npm run dev -w frontend
```

---

## 4. Variáveis de ambiente (backend/.env)

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor Express |
| `NODE_ENV` | `development` ou `production` |
| `FRONTEND_URL` | URL do frontend, usada no CORS |
| `DATABASE_PATH` | Caminho do arquivo SQLite |
| `JWT_SECRET` | Segredo usado para assinar os tokens de sessão administrativa |
| `JWT_EXPIRES_IN` | Duração da sessão administrativa (ex: `8h`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Usados apenas pelo script `npm run seed` |
| `MAX_UPLOAD_SIZE_MB` | Limite de tamanho de upload (padrão 10MB) |
| `UPLOAD_DIR` | Pasta local de uploads |
| `STORAGE_DRIVER` | `local` por padrão; preparado para `s3`, `cloudinary` ou `supabase` no futuro |

O arquivo `.env` nunca deve ser versionado — apenas `.env.example` (sem segredos reais).

---

## 5. Endpoints da API

### Públicos
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Healthcheck simples |
| `GET` | `/api/stats` | Estatísticas reais do sistema (para o painel `SYSTEM STATUS`) |
| `POST` | `/api/upload` | Envio de foto (multipart/form-data: `photo`, `nickname`, `instagram`, `lgpd_authorized`) |
| `GET` | `/api/photos/approved?filter=all\|recent\|most_viewed` | Lista de fotos aprovadas (galeria pública) |
| `POST` | `/api/photos/:id/view` | Incrementa contador de visualizações |

### Administrativos (exigem cookie de sessão válido)
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/admin/login` | Autentica administrador (usuário + senha) |
| `POST` | `/api/admin/logout` | Encerra a sessão |
| `GET` | `/api/admin/me` | Retorna o admin autenticado |
| `GET` | `/api/admin/photos` | Lista todas as fotos (qualquer status) |
| `GET` | `/api/admin/photos/pending` | Lista apenas fotos pendentes |
| `POST` | `/api/admin/photos/:id/approve` | Aprova uma foto (passa a aparecer na galeria) |
| `POST` | `/api/admin/photos/:id/reject` | Rejeita uma foto |

---

## 6. Banco de dados

SQLite com três tabelas principais (ver `backend/database/schema.sql`):

- **`photos`** — dados da imagem, apelido/Instagram, status (`pending`/`approved`/`rejected`),
  autorização LGPD, contador de visualizações e timestamps.
- **`admins`** — usuário e hash bcrypt da senha (a senha em texto puro nunca é armazenada).
- **`logs`** — trilha básica de eventos (upload, aprovação, rejeição, login administrativo).

---

## 7. Segurança implementada

- Senha do administrador com hash **bcrypt** (nunca em texto puro, nunca no frontend).
- Sessão administrativa via **JWT em cookie `httpOnly`** (não acessível por JavaScript no navegador).
- Rotas `/api/admin/*` protegidas por middleware no **servidor** (não apenas no frontend).
- Validação de upload no backend: extensão, MIME type, tamanho máximo e nomes de arquivo gerados
  aleatoriamente (nunca o nome enviado pelo usuário).
- Processamento de imagem no servidor com **Sharp** (conversão/otimização, geração de thumbnail).
- Rate limiting em `/api/upload` e `/api/admin/login`.
- Helmet para cabeçalhos HTTP de segurança e CORS restrito ao domínio do frontend.
- Publicação de foto só ocorre se `lgpd_authorized = 1` estiver registrado no banco.

---

## 8. LGPD

O componente `TermsModal` (frontend) contém a estrutura da política de dados e imagem, com um aviso
explícito indicando que o **texto jurídico oficial deve ser fornecido pela organização da FEC/UNIARA**
antes da publicação em produção. O consentimento é gravado no banco (`lgpd_authorized`, com timestamp),
e o backend recusa a aprovação de fotos sem essa autorização registrada.

---

## 9. Deploy (visão geral)

- O backend pode ser hospedado em qualquer serviço Node.js (Railway, Render, VPS, etc). Em produção,
  defina `NODE_ENV=production` e rode `npm run build` no frontend antes: o Express já está preparado
  para servir o build estático (`frontend/dist`) na mesma origem do backend.
- **Atenção:** discos de hospedagens efêmeras (containers reiniciados) podem apagar `backend/uploads`.
  O projeto já foi estruturado com a variável `STORAGE_DRIVER` para permitir a troca futura do
  armazenamento local por S3, Cloudinary ou Supabase Storage sem reescrever a lógica de rotas.
- Gere um `JWT_SECRET` forte e exclusivo para produção.
- Rode `npm run seed` uma única vez em produção, com uma senha de administrador forte, e depois remova
  ou proteja as credenciais usadas no `.env`.

### Passos básicos de deploy
1. `cd frontend && npm install && npm run build`
2. `cd backend && npm install`
3. Configurar `.env` de produção (não versionado)
4. `npm run seed` (uma vez)
5. `npm start` (ou processo gerenciado por PM2/systemd/serviço da hospedagem)

---

## 10. Fluxo do usuário

1. Escaneia o QR Code espalhado pela FEC.
2. Cai na Home: hero "Conexão estabelecida", status do sistema (dados reais) e módulos do curso.
3. Explora a galeria pública (`/galeria`) — apenas fotos aprovadas.
4. Envia sua própria foto em `/enviar`, informa apelido/Instagram e autoriza o uso da imagem.
5. Recebe confirmação com `PACKET_ID` e status `PENDING_REVIEW`.
6. A equipe do curso modera a foto em `/admin` (login protegido).
7. Após aprovação, a foto passa a aparecer publicamente na galeria.

---

## 11. Próximos passos sugeridos

- Inserir o texto jurídico oficial da LGPD fornecido pela UNIARA no `TermsModal`.
- Configurar armazenamento externo (S3/Cloudinary/Supabase) antes do deploy definitivo.
- Adicionar mais de um usuário administrador, se necessário (a tabela `admins` já suporta múltiplos
  registros).
- Configurar HTTPS no domínio de produção (obrigatório para cookies seguros em produção).
