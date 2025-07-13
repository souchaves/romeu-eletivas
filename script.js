document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value;
    const matricula = document.getElementById("matricula").value;
    const serie = document.getElementById("serie").value;
    const curso1 = document.getElementById("curso1").value;
    const curso2 = document.getElementById("curso2").value;
  
    if (curso1 === curso2) {
      document.getElementById("mensagem").innerText = "Escolha dois cursos diferentes.";
      return;
    }
  
    const novaInscricao = { nome, matricula, serie, curso1, curso2 };
  
    let inscricoes = JSON.parse(localStorage.getItem("inscricoes")) || [];
  
    // Carregar os cursos do JSON
    const response = await fetch("data/cursos.json");
    const data = await response.json();
    const cursosDaSerie = data[serie];
  
    // Contar quantas inscrições já existem para cada curso
    const vagasRestantes = {};
    cursosDaSerie.forEach(curso => {
      const nomeCurso = curso.nome;
      const maxVagas = curso.vagas;
  
      const totalInscritos = inscricoes.filter(i => i.serie === serie && (i.curso1 === nomeCurso || i.curso2 === nomeCurso)).length;
  
      vagasRestantes[nomeCurso] = maxVagas - totalInscritos;
    });
  
    // Verificar se tem vaga
    if (vagasRestantes[curso1] <= 0 || vagasRestantes[curso2] <= 0) {
      let mensagem = "Não há vagas disponíveis para:\n";
      if (vagasRestantes[curso1] <= 0) mensagem += `- ${curso1}\n`;
      if (vagasRestantes[curso2] <= 0) mensagem += `- ${curso2}`;
      document.getElementById("mensagem").innerText = mensagem;
      return;
    }
  
    // Se passou, salva
    inscricoes.push(novaInscricao);
    localStorage.setItem("inscricoes", JSON.stringify(inscricoes));
  
    document.getElementById("mensagem").innerText = "Inscrição enviada com sucesso!";
    this.reset();
  });
  
  // Função para carregar os cursos quando o aluno escolhe a série
async function carregarCursos(serie) {
  const response = await fetch("data/cursos.json");
  const data = await response.json();

  const curso1 = document.getElementById("curso1");
  const curso2 = document.getElementById("curso2");

  curso1.innerHTML = "";
  curso2.innerHTML = "";

  if (!data[serie]) return;

  data[serie].forEach(curso => {
    const opt1 = document.createElement("option");
    opt1.value = curso.nome;
    opt1.textContent = curso.nome;
    curso1.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = curso.nome;
    opt2.textContent = curso.nome;
    curso2.appendChild(opt2);
  });
}

// Quando o usuário muda a série, os cursos aparecem
document.getElementById("serie").addEventListener("change", function () {
  carregarCursos(this.value);
});
