const API_BASE = window.location.port === "4173" ? "http://localhost:3333" : "";
const TOKEN_KEY = "itnursing.token";

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Falha na requisição");
  }
  return res.json();
}

function storeSession(token, session) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (session) localStorage.setItem("itnursing.session", JSON.stringify(session));
}

function redirectByRole(role) {
  const roleUpper = role.toUpperCase();
  switch (roleUpper) {
    case "ENFERMEIRO":
      window.location.href = "/pages/enfermeiro-dashboard.html";
      break;
    case "PACIENTE":
      window.location.href = "/pages/registrar-vaga.html";
      break;
    case "ADMIN":
      window.location.href = "/pages/admin-monitor.html";
      break;
    default:
      window.location.href = "/pages/db.html";
  }
}

const loginForm = document.getElementById("formLogin");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();
    try {
      const { token, session } = await postJson("/api/auth/login", { email, senha });
      storeSession(token, session);
      redirectByRole(session.user.role);
    } catch (error) {
      document.getElementById("erroSenhaLogin").textContent = error.message;
    }
  });
}

const cadastroForm = document.getElementById("formCadastro");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async event => {
    event.preventDefault();
    const role = document.querySelector('input[name="roleCadastro"]:checked').value;
    const payload = {
      role,
      nome: document.getElementById("nomeCadastro").value.trim(),
      email: document.getElementById("emailCadastro").value.trim(),
      cpf: document.getElementById("cpfCadastro").value.trim(),
      telefone: document.getElementById("telefoneCadastro").value.trim(),
      senha: document.getElementById("senhaCadastro").value.trim()
    };
    try {
      await postJson("/api/auth/register", payload);
      alert("Cadastro realizado! Faça login para continuar.");
      cadastroForm.reset();
    } catch (error) {
      alert(error.message);
    }
  });
}

const btnAdminAccess = document.getElementById("btnAdminAccess");
if (btnAdminAccess) {
  btnAdminAccess.addEventListener("click", async () => {
    const tokenField = document.getElementById("adminToken");
    try {
      const { token, session } = await postJson("/api/auth/admin-token", { token: tokenField.value.trim() });
      storeSession(token, session);
      redirectByRole("admin");
    } catch (error) {
      tokenField.nextElementSibling.textContent = error.message;
    }
  });
}
