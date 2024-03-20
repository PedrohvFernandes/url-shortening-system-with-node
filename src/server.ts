import fastify from 'fastify'
import {
  GetRouteCreateLinks,
  PostRouteCreateLinks,
  GetRouteOriginalUrl,
  GetRouteMetrics,
} from 'routes'

const app = fastify()

app.register(GetRouteCreateLinks)
app.register(PostRouteCreateLinks)
app.register(GetRouteOriginalUrl)
app.register(GetRouteMetrics)

app
  .listen({
    port: 3000,
    host: 'localhost',
  })
  .then(() => {
    // Depois que subir o servidor com sucesso, imprime no console
    console.log('Server started')
  })
