import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional - comentar se não quiser limpar)
  await prisma.candidatura.deleteMany();
  await prisma.vaga.deleteMany();
  await prisma.phoneVerification.deleteMany();
  await prisma.enfermeiro.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const senhaHash = await bcrypt.hash('123456', 10);

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      nome: 'Administrador Sistema',
      email: 'admin@itnursing.com',
      cpf: '000.000.000-00',
      role: 'ADMIN',
      senhaHash,
      telefone: '+55 11 99999-0000',
      telefoneConfirmado: true,
      selfieOk: true,
      docOk: true,
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // 2. Enfermeiros
  const enfermeira1 = await prisma.user.create({
    data: {
      nome: 'Camila Ferreira',
      email: 'camila.enf@itnursing.com',
      cpf: '111.222.333-44',
      role: 'ENFERMEIRO',
      senhaHash: await bcrypt.hash('Enf12345', 10),
      telefone: '+55 11 98888-1111',
      telefoneConfirmado: true,
      cidade: 'São Paulo - SP',
      bio: 'Enfermeira especializada em cuidados domiciliares e geriatria.',
      selfieOk: true,
      docOk: true,
      enfermeiro: {
        create: {
          coren: 'SP-123456',
          areaAtuacao: 'Geriatria, Cuidados Paliativos',
          experiencia: '8 anos de experiência em home care, com foco em pacientes idosos e pós-operatórios.',
          disponibilidade: 'Segunda a Sexta, 8h às 18h',
          status: 'APROVADO',
          rating: 4.8,
          skills: 'Curativos complexos, Ventilação mecânica, Administração de medicamentos, Suporte emocional',
        },
      },
    },
  });

  const enfermeiro2 = await prisma.user.create({
    data: {
      nome: 'Roberto Silva',
      email: 'roberto.enf@itnursing.com',
      cpf: '222.333.444-55',
      role: 'ENFERMEIRO',
      senhaHash: await bcrypt.hash('Enf12345', 10),
      telefone: '+55 11 98888-2222',
      telefoneConfirmado: true,
      cidade: 'São Paulo - SP',
      bio: 'Enfermeiro com experiência em UTI e cuidados intensivos.',
      selfieOk: true,
      docOk: true,
      enfermeiro: {
        create: {
          coren: 'SP-789012',
          areaAtuacao: 'UTI, Cuidados Intensivos, Cardiologia',
          experiencia: '12 anos em ambiente hospitalar, 5 anos em home care.',
          disponibilidade: 'Plantões 12x36, incluindo finais de semana',
          status: 'APROVADO',
          rating: 4.9,
          skills: 'Ventilação mecânica, Monitoramento cardíaco, Administração de drogas vasoativas',
        },
      },
    },
  });

  console.log('✅ Enfermeiros criados:', enfermeira1.email, enfermeiro2.email);

  // 3. Pacientes
  const paciente1 = await prisma.user.create({
    data: {
      nome: 'Thiago Mendes',
      email: 'thiago.paciente@itnursing.com',
      cpf: '333.444.555-66',
      role: 'PACIENTE',
      senhaHash: await bcrypt.hash('Pac12345', 10),
      telefone: '+55 11 97777-1111',
      telefoneConfirmado: true,
      cidade: 'São Paulo - SP',
      selfieOk: true,
      docOk: true,
      paciente: {
        create: {
          endereco: 'Rua das Flores, 123 - Jardins, São Paulo/SP',
          necessidades: 'Mãe idosa com mobilidade reduzida, necessita cuidados diários e administração de medicamentos.',
          preferenciaPeriodo: 'Diurno (8h às 18h)',
          vagas: {
            create: [
              {
                titulo: 'Cuidador para idosa - Jardins/SP',
                descricao: 'Procuro enfermeiro(a) para cuidar de minha mãe de 78 anos. Ela tem mobilidade reduzida devido a artrose e precisa de auxílio para banho, alimentação e administração de medicamentos. É uma pessoa tranquila e carinhosa.',
                status: 'ABERTA',
                remuneracao: 4500,
                horario: 'Segunda a Sexta, 8h às 17h',
                cidade: 'São Paulo - Jardins',
              },
            ],
          },
        },
      },
    },
  });

  const paciente2 = await prisma.user.create({
    data: {
      nome: 'Ana Paula Costa',
      email: 'ana.paciente@itnursing.com',
      cpf: '444.555.666-77',
      role: 'PACIENTE',
      senhaHash: await bcrypt.hash('Pac12345', 10),
      telefone: '+55 11 97777-2222',
      telefoneConfirmado: true,
      cidade: 'São Paulo - SP',
      selfieOk: true,
      docOk: true,
      paciente: {
        create: {
          endereco: 'Av. Paulista, 456 - Bela Vista, São Paulo/SP',
          necessidades: 'Pós-operatório de cirurgia cardíaca, necessita monitoramento e cuidados especializados.',
          preferenciaPeriodo: 'Plantões 12x36',
          vagas: {
            create: [
              {
                titulo: 'Enfermeiro pós-operatório cardíaco - Urgente',
                descricao: 'Paciente masculino, 65 anos, pós-operatório de cirurgia de ponte de safena. Necessita enfermeiro com experiência em cardiologia para monitoramento de sinais vitais, curativos e administração de medicamentos. Preferência por profissional com experiência em cuidados pós-cirúrgicos.',
                status: 'EM_SELECAO',
                remuneracao: 6200,
                horario: 'Plantão 12x36 - Diurno',
                cidade: 'São Paulo - Bela Vista',
              },
              {
                titulo: 'Cuidados noturno - Paciente cardíaco',
                descricao: 'Necessito de enfermeiro para plantão noturno para acompanhamento de paciente cardiopata. Precisa ter experiência com monitoramento e situações de emergência.',
                status: 'ABERTA',
                remuneracao: 5800,
                horario: 'Plantão 12x36 - Noturno (19h às 7h)',
                cidade: 'São Paulo - Bela Vista',
              },
            ],
          },
        },
      },
    },
  });

  console.log('✅ Pacientes criados:', paciente1.email, paciente2.email);

  // 4. Criar candidaturas
  const vagas = await prisma.vaga.findMany();
  const enfermeiros = await prisma.enfermeiro.findMany();

  if (vagas.length > 0 && enfermeiros.length > 0) {
    // Camila se candidata à primeira vaga
    await prisma.candidatura.create({
      data: {
        vagaId: vagas[0].id,
        enfermeiroId: enfermeiros[0].id,
        mensagem: 'Olá! Tenho 8 anos de experiência em home care com idosos. Sou muito paciente e dedicada. Gostaria muito de conhecer a família e ajudar nos cuidados.',
        status: 'PENDENTE',
      },
    });

    // Roberto se candidata à segunda vaga (cardíaca)
    await prisma.candidatura.create({
      data: {
        vagaId: vagas[1].id,
        enfermeiroId: enfermeiros[1].id,
        mensagem: 'Boa tarde! Sou enfermeiro com 12 anos de experiência em cardiologia e UTI. Já cuidei de diversos pacientes pós-operatórios de cirurgia cardíaca. Tenho disponibilidade imediata.',
        status: 'ACEITA',
      },
    });

    console.log('✅ Candidaturas criadas');
  }

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Dados criados:');
  console.log('  - 1 Admin');
  console.log('  - 2 Enfermeiros');
  console.log('  - 2 Pacientes');
  console.log('  - 3 Vagas');
  console.log('  - 2 Candidaturas');
  console.log('\n🔑 Credenciais de teste:');
  console.log('  Admin: admin@itnursing.com / 123456');
  console.log('  Enfermeira: camila.enf@itnursing.com / Enf12345');
  console.log('  Enfermeiro: roberto.enf@itnursing.com / Enf12345');
  console.log('  Paciente 1: thiago.paciente@itnursing.com / Pac12345');
  console.log('  Paciente 2: ana.paciente@itnursing.com / Pac12345');
  console.log('  Admin Token: 0781');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
