import { FastifyInstance } from 'fastify'
import { sql } from 'lib/postgres'
import { redis } from 'lib/redis'
import { z } from 'zod'

// basicamente uma rota raiz(/), quando o usuário acessar http://localhost:3000/react, não tem nada nada antes do barra(/), e é so o barra(/) e react na frente, ja quero que entenda que link que é através do code e ja envie para o link original. Ou seja, eu quero que ele redirecione para o link original através do code passando como parâmetro(:code) na url apos a barra(/) --> /react
export async function rootRouteReturnOriginalUrl(app: FastifyInstance) {
  app.get('/:code', async (request, reply) => {
    const getLinkSchema = z.object({
      code: z.string(),
    })

    const { code } = getLinkSchema.parse(request.params)

    const result = await sql/* sql */ `
      SELECT id, original_url 
      FROM short_links
      WHERE short_links.code = ${code} 
    `
    if (result.length === 0) {
      return reply.status(404).send({ message: 'Link not found' })
    }

    // Como eu sei que o result é um array, e so tem um resultado, pego a posição 0
    const link = result[0]

    // Redirect de que forma:
    // 301 --> Permanente
    // 302 --> Temporário

    // Redis
    /*
       Persistimos no redis a quantidade de vezes que o link foi acessado:
       
       Primeiro o nome pro meu set/ranking a Key --> Metrics
       Segundo de quanto em quanto que eu quero incrementar
       E terceiro o membro --> id

       Key/ranking(Metrics) | Score | Member/content
                                1   |    id: 1       --> Id do link 1 
                                4   |    id: 6       --> Id do link 6

       Acessei 4 vezes o link do ID 6, e uma vez o link do ID 1
    */
    await redis.zIncrBy('metrics', 1, String(link.id))

    // Redireciona
    return reply.redirect(301, link.original_url)
  })
}
