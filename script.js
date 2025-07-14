document.addEventListener("DOMContentLoaded", () => {
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

    const url = `https://script.google.com/macros/s/AKfycbw39249PXac_lNMWYlmFGrB_L0FGaci-sxpdtGPsAgX7ymEaPNL2w8j5MSZwNg9UyU/exec?serie=${serie}&curso1=${encodeURIComponent(curso1)}&curso2=${encodeURIComponent(curso2)}`;

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

        // Envia inscrição
        fetch("https://script.google.com/macros/s/AKfycbw39249PXac_lNMWYlmFGrB_L0FGaci-sxpdtGPsAgX7ymEaPNL2w8j5MSZwNg9UyU/exec", {
          method: "POST",
          body: JSON.stringify(novaInscricao)
        })
          .then(() => {
            document.getElementById("mensagem").innerText = "Inscrição enviada com sucesso!";
            document.getElementById("cadastroForm").reset();
          })
          .catch(err => {
            console.error("Erro ao enviar inscrição:", err);
            document.getElementById("mensagem").innerText = "Erro ao enviar inscrição.";
          });
      })
      .catch(err => {
        console.error("Erro ao verificar vagas:", err);
        document.getElementById("mensagem").innerText = "Erro ao verificar vagas.";
      });
  });
});
