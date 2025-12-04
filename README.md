# IT.Nursing - Sistema de Gestão Home Care

Plataforma que conecta enfermeiros a pacientes de Home Care com segurança e transparência.

## 🚀 Setup Rápido

### 1. Pré-requisitos
- **Node.js** (v18+): https://nodejs.org
- **PostgreSQL** (v14+): https://www.postgresql.org/download/windows/

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar PostgreSQL

**Instalar PostgreSQL no Windows:**
- Baixe o instalador oficial
- Durante instalação: porta `5432`, defina senha para usuário `postgres`

**Criar banco de dados:**
Abra SQL Shell (psql) ou pgAdmin e execute:
```sql
CREATE DATABASE itnursing_db;
CREATE USER itnursing WITH PASSWORD 'itnursing_dev_password';
GRANT ALL PRIVILEGES ON DATABASE itnursing_db TO itnursing;
```

**Configurar variável de ambiente:**
Crie arquivo `.env` na raiz do projeto:
```
DATABASE_URL="postgresql://itnursing:itnursing_dev_password@localhost:5432/itnursing_db?schema=public"
```

### 4. Rodar Migrations e Seed
```bash
npm run db:migrate
npm run db:seed
```

### 5. Iniciar o Servidor
```bash
npm run dev
```

Acesse: **http://localhost:3333**

---

## 👥 Usuários de Teste

Após o seed, use estas credenciais:

| Perfil | Email | Senha |
|--------|-------|-------|
| **Enfermeiro** | camila.enf@itnursing.com | Enf12345 |
| **Paciente** | thiago.paciente@itnursing.com | Pac12345 |
| **Admin** | admin@itnursing.com | Admin123 |
| **Admin (token direto)** | - | Token: `0781` |

---

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia o servidor backend (porta 3333)
- `npm run db:migrate` - Roda migrations do Prisma
- `npm run db:seed` - Popula banco com dados de teste
- `npm run db:studio` - Abre Prisma Studio (interface visual do banco)
- `npm run db:reset` - Reseta banco (⚠️ apaga todos os dados)

---

## 🏗️ Stack Tecnológica

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcrypt

**Frontend:**
- HTML5 + CSS3
- JavaScript Vanilla
- Chatbot assistente integrado

---

## 📁 Estrutura do Projeto

```
itnursing/
├── src/
│   ├── backend/           # API Express
│   │   ├── index.js       # Servidor principal
│   │   └── database/
│   │       └── prisma.js  # Cliente Prisma
│   └── frontend/          # Interface do usuário
│       ├── pages/         # HTML
│       ├── scripts/       # JS
│       ├── styles/        # CSS
│       └── assets/        # Imagens
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Dados iniciais
├── package.json
└── .env                   # Variáveis de ambiente

```

---

## 🏗️ Arquitetura

### Modelos do Banco (Prisma)
- **User**: Usuários do sistema (Admin, Enfermeiro, Paciente)
- **Enfermeiro**: Perfil profissional de enfermeiros
- **Paciente**: Perfil de pacientes
- **Vaga**: Oportunidades criadas por pacientes
- **Candidatura**: Enfermeiros aplicando a vagas
- **PhoneVerification**: Verificação de telefone

### Fluxos Principais
1. **Autenticação**: Login/cadastro com JWT
2. **Gestão de Vagas**: Pacientes criam vagas, enfermeiros se candidatam
3. **Perfis**: Dashboards customizados por tipo de usuário
4. **Admin**: Métricas e monitoramento da plataforma

### API Endpoints
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/admin-token` - Acesso direto admin (token: `0781`)
- `GET /api/auth/me` - Dados do usuário autenticado

---

## ⚠️ Troubleshooting

**Erro ao conectar no banco:**
- Verifique se PostgreSQL está rodando
- Confirme credenciais no arquivo `.env`
- Teste conexão: `psql -U itnursing -d itnursing_db`

**Prisma Client não encontrado:**
```bash
npx prisma generate
```

**Resetar banco de dados:**
```bash
npm run db:reset
```

---

## 📄 Licença

Projeto acadêmico - TCC
