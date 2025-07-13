// Dados dos cursos direto no JS
const cursosData = {
  "1": [
    { "nome": "Teatro", "vagas": 20 },
    { "nome": "Robótica", "vagas": 15 }
  ],
  "2": [
    { "nome": "Fotografia", "vagas": 18 },
    { "nome": "Educação Financeira", "vagas": 20 }
  ]
};

// Carregar os cursos ao selecionar a série
function carregarCursos(serie) {
  const curso1 = document.getElementById("curso1");
  const curso2 = document.getElementById("curso2");

  curso1.innerHTML = "";
  curso2.innerHTML = "";

  if (!cursosData[serie]) return;

  cursosData[serie].forEach(curso => {
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

// Aciona quando o aluno escolhe a série
document.getElementById("serie").addEventListener("change", function () {
  carregarCursos(this.value);
});

// Submissão do formulário
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

  // Verificar vagas disponíveis
  const cursosDaSerie = cursosData[serie];
  const vagasRestantes = {};

  cursosDaSerie.forEach(curso => {
    const nomeCurso = curso.nome;
    const maxVagas = curso.vagas;

    const totalInscritos = inscricoes.filter(i => i.serie === serie && (i.curso1 === nomeCurso || i.curso2 === nomeCurso)).length;

    vagasRestantes[nomeCurso] = maxVagas - totalInscritos;
  });

  // Verifica se tem vaga
  if (vagasRestantes[curso1] <= 0 || vagasRestantes[curso2] <= 0) {
    let mensagem = "Não há vagas disponíveis para:\n";
    if (vagasRestantes[curso1] <= 0) mensagem += `- ${curso1}\n`;
    if (vagasRestantes[curso2] <= 0) mensagem += `- ${curso2}`;
    document.getElementById("mensagem").innerText = mensagem;
    return;
  }

  // Enviar para Google Sheets via fetch POST
fetch("https://script.google.com/a/macros/prof.ce.gov.br/s/AKfycbzCJ_OiFAP0cfhxJdORMl4wzz2V_q7KTh8Eh-Q3RLXAOztz9y2hMOvR4lRMNJITYsiY/exec", {
  method: "POST",
  body: JSON.stringify(novaInscricao)
})
.then(res => {
  document.getElementById("mensagem").innerText = "Inscrição enviada com sucesso!";
  document.getElementById("cadastroForm").reset();
})
.catch(err => {
  console.error("Erro ao enviar:", err);
  document.getElementById("mensagem").innerText = "Erro ao enviar inscrição.";
});
