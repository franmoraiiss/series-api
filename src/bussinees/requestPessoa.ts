// async function createPeople(id: number, idPessoasCadastras: number[]) {
//   if (id in idPessoasCadastras) { //tem cadastro
//     console.log(id);
//     //Chama CreateCriadorController ou a funçao dela.
//   }
//   else { //Nao tem cadastro
//     const idCriador = id; //salva id
//     const criadores = await axios.get(`https://api.themoviedb.org/3/person/${idCriador}?api_key=${api_key}`) //busca pessoa

//     //Cadastra pessoa
//     console.log(criadores)
//   }
// };