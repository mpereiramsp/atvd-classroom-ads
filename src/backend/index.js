const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("./database/prisma");

const PORT = process.env.PORT || 3333;
const JWT_SECRET = process.env.JWT_SECRET || "it-nursing-secret";
const ADMIN_DIRECT_TOKEN = process.env.ADMIN_DIRECT_TOKEN || "0781";

const app = express();
app.use(cors());
app.use(express.json());

function mapUser(user) {
  if (!user) return null;
  const { senhaHash, ...rest } = user;
  return rest;
}

function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) return res.status(401).json({ message: "Token ausente." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Sessão expirada." });
  }
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome = "", email = "", telefone = "", senha = "", role = "" } = req.body || {};
    if (!nome.trim() || !email.trim() || !senha.trim() || !role) {
      return res.status(400).json({ message: "Informe nome, e-mail, senha e perfil." });
    }
    if (!["paciente", "enfermeiro"].includes(role)) {
      return res.status(400).json({ message: "Somente pacientes ou enfermeiros podem se cadastrar." });
    }
    const emailLower = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: emailLower } });
    if (existing) {
      return res.status(409).json({ message: "E-mail já cadastrado." });
    }
    const hash = await bcrypt.hash(senha, 10);
    const roleUpper = role.toUpperCase();
    
    const newUser = await prisma.user.create({
      data: {
        role: roleUpper,
        nome: nome.trim(),
        email: emailLower,
        telefone: telefone.trim(),
        senhaHash: hash,
      }
    });

    // Create related profile record
    if (roleUpper === "ENFERMEIRO") {
      await prisma.enfermeiro.create({
        data: { userId: newUser.id }
      });
    } else if (roleUpper === "PACIENTE") {
      await prisma.paciente.create({
        data: { userId: newUser.id }
      });
    }
    
    return res.status(201).json({ message: "Cadastro realizado com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email = "", senha = "" } = req.body || {};
    if (!email.trim() || !senha.trim()) {
      return res.status(400).json({ message: "Informe e-mail e senha." });
    }
    const user = await prisma.user.findUnique({ 
      where: { email: email.trim().toLowerCase() } 
    });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const match = await bcrypt.compare(senha, user.senhaHash);
    if (!match) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    const token = signSession({ userId: user.id, role: user.role });
    return res.json({ token, session: { user: mapUser(user) } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao autenticar." });
  }
});

app.post("/api/auth/admin-token", (req, res) => {
  const { token } = req.body || {};
  if (!token || token !== ADMIN_DIRECT_TOKEN) {
    return res.status(401).json({ message: "Token administrativo inválido." });
  }
  const adminSession = {
    user: {
      id: "admin",
      role: "ADMIN",
      nome: "Administrador",
      email: "admin@itnursing.local"
    }
  };
  const signed = signSession({ userId: "admin", role: "ADMIN" });
  return res.json({ token: signed, session: adminSession });
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  if (req.auth.userId === "admin") {
    return res.json({ user: { id: "admin", role: "ADMIN", nome: "Administrador", email: "admin@itnursing.local" } });
  }
  const user = await prisma.user.findUnique({ 
    where: { id: req.auth.userId } 
  });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  return res.json({ user: mapUser(user) });
});

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "pages", "index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening in http://localhost:${PORT}`);
});
