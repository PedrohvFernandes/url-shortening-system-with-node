import { FastifyInstance } from 'fastify'
import { sql } from 'lib/postgres'

// Usamos o prefixo --> /api antes do /links, para que caso o cliente queira fazer um link com o code links, não de problema, porque na minha rota de root-route... ela é /:code --> uma rota raiz e para acessar o originalUrl nessa rota raiz, usamos um params(:code), logo se o cliente criasse algum code, ou seja, um link encurtado chamado links, poderia dar problema caso eu não usasse o prefixo /api antes do /links
export async function getLinks(app: FastifyInstance) {
  app.get('/api/links', async () => {
    // Basicamente eu retorno os links que estão no BD mais recente, ou seja, decrescente, pela data de criação
    const result = await sql/* sql */ `
      SELECT * 
      FROM short_links
      ORDER BY created_at DESC
    `

    return result
  })
}
