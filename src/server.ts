import fastify from 'fastify'

const app = fastify()

app
  .listen({
    port: 3000,
    host: 'localhost',
  })
  .then(() => {
    // Depois que subir o servidor com sucesso, imprime no console
    console.log('Server started')
  })
