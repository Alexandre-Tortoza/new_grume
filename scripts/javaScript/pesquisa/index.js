const buttons = document.querySelectorAll(".btn-outline-primary");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("btn-active"));
    button.classList.add("btn-active");

    // Verifica o texto do botão para chamar a função correspondente
    switch (button.innerText.trim().toLowerCase()) {
      case "equipe":
        equipe();
        break;
      case "orientações":
        orientacoes();
        break;
      case "publicações":
        publicacoes();
        break;
      case "documentos":
        documentos();
        break;
      default:
        console.error("Nenhuma função associada a esse botão.");
        break;
    }
  });
});

function equipe() {
  fetch("../scripts/php/pesquisa/get_equipe.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      // Seleciona o container e inicializa a estrutura base
      const container = document.getElementById("contentContainer");
      container.innerHTML = `
  <div class="grid grid-cols-2 gap-8" id="content"></div>
`;

      // Seleciona o elemento onde os membros serão adicionados
      const content = document.getElementById("content");

      // Verifica se há dados antes de processar
      if (data.length === 0) {
        content.innerHTML =
          "<p class='text-gray-500'>Nenhum membro encontrado.</p>";
      } else {
        // Itera sobre os membros e adiciona os cards dinamicamente
        data.forEach((membro) => {
          content.innerHTML += `
      <div class="p-4 border rounded-md mb-4">
          <h3 class="font-bold">${membro.nome}</h3>
          <p><strong>Descrição:</strong> ${membro.descricao}</p>
          <p><strong>Email:</strong> ${membro.email}</p>
          <p><strong>Data de Início:</strong> ${membro.data_inicio}</p>
          <p><strong>Data de Fim:</strong> ${membro.data_fim}</p>
          <img src="data:image/png;base64,${membro.imagem_base64}" 
               alt="Imagem de ${membro.nome}" 
               class="mt-2 w-32 h-32 object-cover rounded-md">
      </div>
    `;
        });
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function orientacoes() {
  console.log("Função orientacoes() foi chamada.");
}

function publicacoes() {
  console.log("Função publicacoes() foi chamada.");
}

function documentos() {
  console.log("Função documentos() foi chamada.");
}

buttons[0].click();
