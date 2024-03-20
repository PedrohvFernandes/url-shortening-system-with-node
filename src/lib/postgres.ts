// Conexão com o banco de dados:
import postgres from 'postgres'

/**
 postgresql: --> BD
 docker --> usuário
 docker --> senha
 localhost:5432 --> host(endereço):porta
 shortlinks --> nome do banco de dados
 */
export const sql = postgres(
  'postgresql://docker:docker@localhost:5432/shortlinks',
)
