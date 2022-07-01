<h1 align="center">
  The Movies DB - COM231
</h1>


## 👨🏻‍💻 Sobre o projeto

- <p style="color: yellow;">Projeto desenvolvido para trabalho de COM231 - O projeto tem como objetivo consumir os dados da API TheMovieDB e popular um banco de dados PostgresSQL. A partir daí disponibilizar para um usuário uma plataforma onde ele pode consultar todos os dados disponíveis a partir de filtros</p>

## 💻 Primeiros Passos

Clone o projeto e acesse a pasta

```bash
$ git clone https://github.com/franmoraiiss/moveit-nlw4-rocketseat.git 
```
<br>
Rode o comando a baixo para instalar as dependências

```bash
$ yarn install 
```

<br>
No arquivo .env altere a string de conexão

```js
DATABASE_URL="postgres.sql://seu_usuário:sua_senha:5432/seriesdb?schema=public"
```
<br>

Rode as migrations, para que criar as tabelas
```bash
$ yarn prisma migrate dev
```
<br>

Execute o projeto com:
```bash
$ yarn dev
```
<br>

Para executar o script que popula o banco de dados a partir da The Movie DB API, abra seu navegador e acesse a URL

<a href="http://localhost:4003/seriestmdb" target="_blank"> http://localhost:4003/seriestmdb </a>
<br>
<br>
Volte para seu projeto e os dados estarão sendo puxados da API 😊
<br>
# 

✍️ **Authors**

- Gustavo Salles
- Francisco Morais
- João Vitor Oliveira Araujo
- Natalia Mattos
- Pedro Lucas Guerra

Made with 💜

