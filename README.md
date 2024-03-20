# Url Shortening System With Node.js And TypeScript

### Logica do fluxo da aplicação

Essa aplicação é para encurtamentos de *links*, tu passa pra ela um *link grande* e um *code pequeno*, ao acessar a minha aplicação passando esse code eu retorno a *url original(Link grande)*, e redireciono para a url original.

E iremos anotar com o *redis* quantos acessos cada link teve para depois mostrar isso *analytics*

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
- Por que os dois bancos ? O postgres é um banco relacional e estruturado, e o redis é um banco chave-valor, que é muito mais rápido que o postgres, e é muito usado para cache, e para armazenar dados que não precisam de muita segurança, como por exemplo, um contador de visitas, que não precisa ser exato, e sim rápido. ​​Redis, bom para, cache, lock distribuído, lógica que usa tempo para expirar, sistema de enfileiramento, o redis pode ser usado para sistema de ranking etc. A parte de pub/sub é a parte mais firme do redis. No redis consegue salvar o resultado de uma operação para que as próximas pessoas que precisam daqueles dados tenham acesso a isso no futuro de uma maneira mais rápida através da sua arquitetura de cache. O redis é bem robusto, mas não é relacional, ou seja, não serve para salvar dados estruturados, do tipo uma pessoa possui 4 carros, mas sim para por exemplo fazer um sistema de ranking rápido, onde não é preciso fazer somatória disso no BD relacional e é preciso ser rápido sem seguir uma estrutura especifica.
- O redis nasceu como banco de chave:valor : é um bd que possui somente duas colunas, a chave(KEY) podemos dizer que é o ID e o valor, que é o que quero salvar naquela coluna referente aquele ID, tipo o localstorage do navegador, que é um banco de chave:valor, ex: "registros-dia-07: 1000", onde a chave(ID) é "registros-dia-07" e o valor é "1000"
- Como eu distingo os comandos do redis ? É pela primeiro letra na frente deles, por exemplo: HKEYS --> tem haver com um comando de hash, Z --> tem haver com um comando de ordenação, ranking S --> tem haver com um comando de set, etc. [mais types de comandos](https://redis.io/docs/data-types/) [zincrby](https://redis.io/commands/zincrby/)
- Iremos usar o comando ZINCRBY: Pois teremos uma rota na aplicação que vai listar quais foram os links mais acessados. Porque esse comando faz um incremento toda vez que tiver um acesso no member do meu set --> Toda vez que tiver acesso(ZINCRBY) nesse codigo(member) é quero incrementar no redis mais um e a key é o nome do meu set/ranking
- [zrange](https://redis.io/commands/zrange/)
- O redis mesmo sendo um BD em memoria ele não perde as informações ao reiniciar, mas caso derrube o servidor onde ele estiver hospedado com a tua aplicação tu perde as infos. Ou seja, ele armazena em cache no servidor onde o redis e toda sua aplicação node esta rodando

### Tecnologias:

- Node.js
- TypeScript
- Fastify: Um micro framework, porque cada vez eu preciso fazer algo aqui, irei precisar instalar algo externo ou fazer algo do zero para resolver tal problema
- Docker: O docker é basicamente uma ferramenta de conteinerização, que permite criar ambientes isolados, com suas próprias dependências, e que podem ser facilmente compartilhados e distribuídos. Podendo executar serviços, como banco de dados: MysSql, Postgres, Redis, etc. E são altamente performáticos dentro da sua maquina reaproveitando o Kernel do sistema entre eles, o que difere de uma maquina virtual, que nele é preciso instalar todo o S.O(*MUITO LENTO*), o docker possui um ambiente isolado, porem a base do seus sistema operacional(S.O) é compartilhado entre todos os ambientes.
- PostgresSql: Ela ja faz toda parte de tratativa de SQL injection, porque ela usa essa pattern do JS que é o template string ```` sql`` ````, desde que eu não passe dessa forma ``` sql(``)``` por ele ser uma função, cada parâmetro passado é reavaliado por uma função
- Redis
- Zod: Validador de dados

### Extensões:

- Rest Client: Ela permite fazer requisições HTTP direto do VSCode, sem precisar de um cliente externo. Basta criar um arquivo na raiz do projeto: ```client.http``` tanto faz o nome, e fazer as requisições, ex:
  ```http

  # A rota para testar
  POST  http://localhost:3000/api/links

  # Informa qual é o tipo do corpo da requisição, o header
  Content-Type: application/json

  # O corpo da requisição: O request.body da rota
  {
    "code": "react",
    "originalUrl": "https://reactjs.org/"
  }
  
  # Separando para outra requisição
  ###

  GET  http://localhost:3000/api/links

  ```
- Eslint
- Comment Tagged templates: Como não estamos usando nenhum ORM(Prisma e TypeOrm) para se conectar com o banco, estamos usando o proprio postgresql, quando escrevermos uma query, podemos usar essa extensão para identificar que é uma query, sem ficar parecendo um monte de string, ficando com uma sintaxe highlight, apos baixar ela, basta ir no seu codigo sql e fazer isso, ex: no arquivo *setup.ts*
  ```sql
  await sql /* sql */ `CREATE TABLE IF NOT EXISTS short_links`
  ```
- Não usei nem um ORM, pois quero aprender um pouco de sql, fazendo comandos ```Query SQL```

### Caso não queira usar Docker: 

> Todos possuem planos gratuitos

- Tem o serviço de BD online do postgres: ```Neon.tech```
- Tem o serviço de BD online do redir: ```upstash```

### Comandos:
```bash
# Install dependências
npm install ou yarn

# Rodar o projeto
npm run dev ou yarn dev

# Criar base de dados postgres
npm run setup ou yarn setup

# Rodar o docker: Esteja com o docker instalado e aberto, instale o WSL também
docker-compose up -d

# Parar o docker:
docker-compose down

# Para ver se tem algum erro no código:
npm run lint ou yarn lint

# Para corrigir os erros do lint:
npm run lint:fix ou yarn lint:fix
```

### Ordem de comandos:
```bash
# Install dependências
npm install ou yarn

# Rodar o projeto
npm run dev ou yarn dev

# Rodar o docker: Esteja com o docker instalado e aberto, instale o WSL também
docker-compose up -d

# Parar o docker:
docker-compose down

# Criar base de dados postgres
npm run setup ou yarn setup
```
### Ferramentas para ver o redis rodando:

- Windows: [Medis for windows](https://github.com/sinajia/medis/releases/tag/win)
- Mac [Medir for Mac](https://getmedis.com)

- Para conectar:
```bash
Redis Host:  localhost
Port:  6379
Password: docker

Click connect
```

### 👨‍💻 Autor:

- Linkedin: https://www.linkedin.com/in/pedro-henrique-vieira-fernandes
- Git: https://github.com/PedrohvFernandes
- Instagram: pedro17fernandes
- portfolio: https://pedrohvfernandes-web-page-portfolio.vercel.app
