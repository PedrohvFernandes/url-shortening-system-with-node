import { FastifyInstance } from 'fastify'
import { sql } from 'lib/postgres'
import postgres from 'postgres'
import z from 'zod'

export async function createLinks(app: FastifyInstance) {
  // Rota para criar um novo link, é preciso do code e do originalUrl
  app.post('/api/links', async (request, replay) => {
    const createLinkSchema = z.object({
      code: z.string().min(3),
      // A URL tem que ser uma URL válida
      originalUrl: z.string().url()
    })

    // Desestruturação do corpo da requisição e passando a o request.body para o createLinkSchema, para validar
    const { code, originalUrl } = createLinkSchema.parse(request.body)
    // const code = createLinkSchema.code

    // Quando é feito a trativa no postgresql --> O postgres no tipo de campo SERIAL é como se o ID fosse armazenado em outra tabela, então ele não busca o ID do ultimo registro e desse +1, cada vez que eu faço uma operação de insert, ele ja incrementa 1 no ID automaticamente que é o SERIAL que esta em outra tabela. Então ele aumenta o ID mesmo com erro ao tentar inserir essa info na tabela, mas não consegue  porque o nome do code ja esta duplicado(existe), o Serial continua maior, então se o ID primeiro é 1 e você tenta fazer 17 request de post com o mesmo code vai da erro, mas vai incrementar o ID, e caso a proxima inserção de certo com um nome de code diferente, o proximo ID quando der certo será 17+1 --> 18
    try {
      // throw new Error()
      /*
      Os values preenchem as colunas do insert into do BD

      Returning --> É uso esse comando porque quero inserir no BD e quero saber qual quer foi o Id retornado por essa inserção
    */
      const result = await sql/* sql */ `
      INSERT INTO short_links (code, original_url)
      VALUES (${code}, ${originalUrl})
      RETURNING id
    `

      // Como o result é um array e eu so estou inserindo uma so coisa por vez, eu pego o primeiro elemento do array do result, que foi o id gerado na criação do link
      const link = result[0]

      // 201 é o status de criado
      return replay.status(201).send({
        shortLinkId: link.id
      })
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        // Se ele é um erro que veio do postgre, como duplicate key value violates unique constraint "short_links_code_key" e se o codigo do error for 23505
        if (error.code === '23505') {
          return replay.status(400).send({
            message: 'Duplicated code!'
          })
        }

        console.log(error)
        // Caso erro seja diferente de 23505, retorna um erro interno
        return replay.status(500).send({
          message: 'Internal error!'
        })
      }
    }
  })
}
