# Estrutura do projeto

## Server Config
**server.ts** - Entry point, onde o programa começa a rodar

**app.ts** - Raiz da logica do sistema 

## Routing
**index.ts** - Raiz de todas as rotas

**xxxxxx.routes.ts** - Arquivo especifico de rotas de um determinado contexto

## Logica de requisições
**controllers** - Onde as requisições caem. Não contem regras de negócio, apenas logica de transação entre cliente e servidor.

**services** - Onde as regras de negócio são escritas. Aque ocorrem as consultas usando o Prisma


# Sistema de versionamento de dados
Como um dos requisitos do sistema de gerenciamento é funcionar offline para garantir operatividade durante momentos de instabilidade de rede, a arquitetura do sistema deve ser adaptada para este requisito.

## Workflow
O front-end armazena todos os dados relevantes a ele localmente usando IndexedDB, para que isso seja possível e barato, é necessário otimizar a transação de dados entre servidor e cliente. 

Este sistema implementará uma lógica de tipos de dados, sendo possível enviar ao front-end apenas os dados necessários. Exemplo:
Se um usuário instrutor somente precisa de dados relevantes as provas e as fichas dos alunos, uma lógica interna deverá ser criada onde, somente estes dados serão enviados.

No entando, existe um problema. Seria muito caro enviar todos os dados de alunos por exemplo o tempo todo, portanto devemos enviar somente os dados que foram atualiados. Faremos isso a partir de datas de versionamento.

O fluxo se dá pelo seguinte: O front-end envia um pedido de sincronização, enviando neste pedido um DateTime contendo o ultimo momento de sincronização. O back-end verifica que tipo de usuário está fazendo o pedido e prepara todos os dados que foram adicionados ou atualizados depois da ultima sincronização, e então envia para o front-end.

# Setup do banco de dados
Usamos PostgreSQL como linguagem de banco de dados e Prisma como ORM para facilitar montagem, migrations e manipulações.

## Criação do banco + usuário
`sudo -u postgres psql`

`create database velair_gerenciamento;`

`create user velair with password '1234';`

`ALTER DATABASE velair_gerenciamento OWNER TO velair;`

`grant all privileges on database velair_gerenciamento to velair;`

`GRANT ALL ON SCHEMA public TO velair;`

`ALTER USER velair CREATEDB;`

## Execução do código SQL para estruturação do banco

`psql -h localhost -U velair -d velair_gerenciamento`

`npx prisma init`

`npx prisma generate`

`npx prisma migrate dev --name init`

## Para reiniciar o banco

`sudo -u postgres psql`

`drop database velair_gerenciamento;` 

`create database velair_gerenciamento;`

`ALTER DATABASE velair_gerenciamento OWNER TO velair;`

`grant all privileges on database velair_gerenciamento to velair;`

`GRANT ALL ON SCHEMA public TO velair;`

`ALTER USER velair CREATEDB;`

`npx prisma init`

`npx prisma generate`

`npx prisma migrate dev`