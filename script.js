document.addEventListener("DOMContentLoaded", () => {
  // Cursos disponíveis (dados fixos no JS)
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

  // Carrega cursos ao escolher série
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

  document.getElementById("serie").addEventListener("change", function () {
    carregarCursos(this.value);
  });

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

    // Verificar vagas antes de enviar
    const url = `https://script.google.com/a/macros/prof.ce.gov.br/s/AKfycbzCJ_OiFAP0cfhxJdORMl4wzz2V_q7KTh8Eh-Q3RLXAOztz9y2hMOvR4lRMNJITYsiY/exec´ serie=${serie}&curso1=${encodeURIComponent(curso1)}&curso2=${encodeURIComponent(curso2)}`;

    fetch(url)
      .then(res => res.json())
      .then(vagas => {
        if (vagas.curso1Restantes <= 0 || vagas.curso2Restantes <= 0) {
          let mensagem = "Não há vagas disponíveis para:\n";
          if (vagas.curso1Restantes <= 0) mensagem += `- ${curso1}\n`;
          if (vagas.curso2Restantes <= 0) mensagem += `- ${curso2}`;
          document.getElementById("mensagem").innerText = mensagem;
          return;
        }

        // Envia para o Google Sheets se houver vaga
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
      })
      .catch(err => {
        console.error("Erro ao verificar vagas:", err);
        document.getElementById("mensagem").innerText = "Erro ao verificar vagas.";
      });
  });
});
