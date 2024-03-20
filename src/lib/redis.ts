import { createClient } from 'redis'

export const redis = createClient({
  /*
    redis --> BD
    Não tem --> Usuario, por isso coloca a senha direto
    docker --> Senha
    localhost:6379 --> host(endereço):porta
    Não tem --> nome do banco de dados. No redis não temos essa divisão por bd, o redis divide o banco de dados por numeros, e não por nomes, vai de 0 ate 11
  */
  url: 'redis://:docker@localhost:6379',
  // database: 1, //database number
})

redis.connect()
