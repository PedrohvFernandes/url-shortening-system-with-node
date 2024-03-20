# Url Shortening System With Node.js And TypeScript

### Anotações:

- @types/node: Integração do TypeScript com o NodeJS, em relação a tipagem
- Typescript: Adiciona suporte ao TypeScript
- tsx: uma ferramenta permite executar codigo TS, convertendo para JS e executa
- Npx: Uma ferramenta que ja vem instalada com node(Alem do npm) que ela faz ir no node_modules>.bin e executa o comando que vc passar(./node_modules/.bin/tsc -h), nesse caso tsc, se não achar ele, o node  busca globalmente na internet
- Para achar uma config do tsconfig.json, basta ir no repositório tsconfig/bases [Configs para TS Node](https://github.com/tsconfig/bases) e pra cada versão do node, ele tem a config exata no readme, basta clicar ```@tsconfig/node20``` ou na versão mais atual do momento, e copiar o readme, ex:
```
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 20",
  "_version": "20.1.0",

  "compilerOptions": {
    "lib": ["es2023"],
    "module": "node16",
    "target": "es2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node16"
  }
}
```
Se não, instalar 
```bash
npm install --save-dev @tsconfig/node20
yarn add --dev @tsconfig/node20
```
e extender em tsconfig.json
```json
{
  "extends": "@tsconfig/node20/tsconfig.json"
}
```
- [O que é o node em si: callbacks, onde tudo começou](https://blog.rocketseat.com.br/callback-promises-e-async-await-tudo-o-que-voce-precisa-saber/)
- Podemos usar a Ia para gerar o arquivo do Docker:
```` 
Create a docker compose file with two services, one postgres using bitnami postgres image and onde redis with bitnami redis. Expose ports. Save volumes
````
````yaml
version: '3.8'

services:
  postgres:
    image: 'bitnami/postgresql:latest'
    ports:
      - '5432:5432'
    environment:
      - POSTGRESQL_USERNAME=my_user
      - POSTGRESQL_PASSWORD=my_password
      - POSTGRESQL_DATABASE=my_database
    volumes:
      - postgres_data:/bitnami/postgresql/data

  redis:
    image: 'bitnami/redis:latest'
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/bitnami/redis/data

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
````
```` 
Set redis password as docker
````
```yml
version: '3.8'

services:
  postgres:
    image: 'bitnami/postgresql:latest'
    ports:
      - '5432:5432'
    environment:
      - POSTGRESQL_USERNAME=my_user
      - POSTGRESQL_PASSWORD=my_password
      - POSTGRESQL_DATABASE=my_database
    volumes:
      - postgres_data:/bitnami/postgresql/data

  redis:
    image: 'bitnami/redis:latest'
    ports:
      - '6379:6379'
    environment:
      - REDIS_PASSWORD=my_redis_password
    volumes:
      - redis_data:/bitnami/redis/data

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```
```
Set postgres database and user
```
```yml
version: '3.8'

services:
  postgres:
    image: 'bitnami/postgresql:latest'
    ports:
      - '5432:5432'
    environment:
      - POSTGRESQL_USERNAME=my_user
      - POSTGRESQL_PASSWORD=my_password
      - POSTGRESQL_DATABASE=my_database
    volumes:
      - postgres_data:/bitnami/postgresql/data

  redis:
    image: 'bitnami/redis:latest'
    ports:
      - '6379:6379'
    environment:
      - REDIS_PASSWORD=my_redis_password
    volumes:
      - redis_data:/bitnami/redis/data

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```
- Apos configurar o arquivo, [instalar](https://docs.docker.com/engine/install/) o docker,  wsl(Para *windows*) e executar o docker, basta dar um ```docker-compose up -d``` e ele ira subir os serviços, e para parar ```docker-compose down```
- Usamos imagens da bitnami, pois elas ja vem prontas para produção, elas ja tem configurações de segurança, com senha e são otimizadas para produção
### Tecnologias:

- Node.js
- TypeScript
- Fastify
- Docker: O docker é basicamente uma ferramenta de conteinerização, que permite criar ambientes isolados, com suas próprias dependências, e que podem ser facilmente compartilhados e distribuídos. Podendo executar serviços, como banco de dados: MysSql, Postgres, Redis, etc. E são altamente performáticos dentro da sua maquina reaproveitando o Kernel do sistema entre eles, o que difere de uma maquina virtual, que nele é preciso instalar todo o S.O(*MUITO LENTO*), o docker possui um ambiente isolado, porem a base do seus sistema operacional(S.O) é compartilhado entre todos os ambientes.
- PostgresSql
- Prisma
- Redis

### Extensões:

- Rest Client: Ela permite fazer requisições HTTP direto do VSCode, sem precisar de um cliente externo. Basta criar um arquivo na raiz do projeto: ```client.http``` tanto faz o nome, e fazer as requisições, ex:
```http
GET http://localhost:3000
```
- Eslint

### Caso não queira usar Docker: 

> Todos possuem planos gratuitos

- Tem o serviço de BD online do postgres: ```Neon.tech```
- Tem o serviço de BD online do redir: ```upstash```