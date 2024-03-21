import { FastifyInstance } from 'fastify'
import { redis } from 'lib/redis'

// Aqui ira me retornar os links mais acessados na minha aplicação, com base no redis
export async function getMetrics(app: FastifyInstance) {
  app.get('/api/metrics', async () => {
    // zRange --> Retorna dados de um ranking. Eu pego o ranking metrics(key) e pego do 0 ao 50 (limitado por mim), pode passar -1 no lugar do 50 para retornar todos
    // const result = await redis.zRange('metrics', 0, 50)

    // zRangeByScoreWithScores --> Ele traz a pontuação
    const result = await redis.zRangeByScoreWithScores('metrics', 0, 50)

    // Organizamos o resultado do ranking, porque por mais que o redis traga os 50 mais pontuado e a sua pontuação, ele mesmo assim não traz eles ordenados
    const metrics = result
      .toSorted((a, b) => b.score - a.score)
      .map((item) => {
        return {
          metrics: {
            shortLinkId: item.value, // Member/content
            clicksScore: item.score
          }
        }
      })

    return metrics
  })
}
