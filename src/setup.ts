// Ele vai criar a estrutura do meu BD

import { sql } from 'lib/postgres'

async function setup() {
  /*
    Serial --> Auto incremento
    PRIMARY KEY --> Chave primaria
    UNIQUE --> Não pode ter dois codigos iguais
    NOT NULL --> Não pode ser n

    O code --> Como essa aplicação é de encurtamento de links. Quando a pessoa acessar o link encurtado, ela vai ser redirecionada para o link original. O code é o que vai ser colocado na URL para redirecionar para o link original.
    
    abc123 --> Code, que é qual o termo que o usuário vai colocar na url que vai redirecionar ele para outro endereço
    Ex: http://localhost:3000/abc123 ==> http://pedrohvfernandes.com.br/abc123 --> vai ser redirecionado para o link original

    original_url --> Link original que o usuário quer encurtar, e que ao abrir o link encurtado com o code, ele vai ser redirecionado para o link original

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP --> Data atual quando o registro for criado
  */

  // Quero antes saber se ja não existe essa tabela no banco
  // const result = await sql/* sql */ `
  // SELECT to_regclass('public.short_links') AS exists
  // `

  const result = await sql/* sql */ `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'short_links'
    )
  `
  if (result[0].exists) {
    console.log('Table already exists. Aborting setup.')
  } else {
    await sql/* sql */ `
      CREATE TABLE IF NOT EXISTS short_links (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE,
        original_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
  `
    console.log('Setup completed! 🚀')
  }
  // Termina a conexão com o BD
  await sql.end()
}

setup()
