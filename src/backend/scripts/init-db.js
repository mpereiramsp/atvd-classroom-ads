const path = require("path");
const bcrypt = require("bcryptjs");
const Datastore = require("nedb-promises");

const users = Datastore.create({ filename: path.join(__dirname, "..", "database", "users.db"), autoload: true });

async function main() {
  const total = await users.count({});
  if (total > 0) {
    console.log(`Banco já possui ${total} usuário(s).`);
    return;
  }
  const now = new Date().toISOString();
  const saltRounds = 10;
  const seed = [
    { role: "enfermeiro", nome: "Camila Ferreira", email: "camila.enf@itnursing.com", telefone: "+55 11 99999-0000", senha: "Enf12345" },
    { role: "paciente", nome: "Thiago Mendes", email: "thiago.paciente@itnursing.com", telefone: "+55 11 98888-0000", senha: "Pac12345" }
  ];
  await Promise.all(
    seed.map(user =>
      users.insert({
        role: user.role,
        nome: user.nome,
        email: user.email.toLowerCase(),
        telefone: user.telefone,
        senha_hash: bcrypt.hashSync(user.senha, saltRounds),
        created_at: now
      })
    )
  );
  console.log("Usuários de demonstração criados:");
  seed.forEach(u => console.log(` - ${u.role}: ${u.email} / ${u.senha}`));
}

main().then(() => {
  console.log("Banco inicializado em src/backend/database/users.db");
  process.exit(0);
}).catch(err => {
  console.error("Falha ao inicializar banco", err);
  process.exit(1);
});
