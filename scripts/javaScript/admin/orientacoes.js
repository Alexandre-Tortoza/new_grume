let main = document.getElementById("main__content");

// Initial fetch (opcional, para carregar dados ao iniciar a página)
fetch("../../scripts/php/pesquisa/get_orientacoes.php")
  .then((response) => {
    if (!response.ok) {
      document.getElementById("contentContainer").innerHTML = "";
      throw new Error("Erro ao buscar os dados");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Dados iniciais:", data);
  })
  .catch((error) => {
    console.error("Erro no fetch inicial:", error);
  });

// Função para listar as orientações
function toggleListar() {
  fetch("../../scripts/php/pesquisa/get_orientacoes.php")
    .then((response) => {
      if (!response.ok) {
        main.innerHTML = "";
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      // Converte objeto com índices numéricos em array, se necessário
      const orientacoes = Object.values(data);

      if (orientacoes.length === 0) {
        main.innerHTML =
          "<p class='text-gray-500'>Nenhuma orientação encontrada.</p>";
      } else {
        main.innerHTML = `
          <table class="min-w-full border border-dark-700">
            <thead>
              <tr class="bg-dark-900">
                <th class="px-4 py-2 border border-dark-600">Tipo</th>
                <th class="px-4 py-2 border border-dark-600">Autor</th>
                <th class="px-4 py-2 border border-dark-600">Ano</th>
                <th class="px-4 py-2 border border-dark-600">Descrição</th>
                <th class="px-4 py-2 border border-dark-600">Download</th>
                <th class="px-4 py-2 border border-dark-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody id="tableBody"></tbody>
          </table>
        `;

        const tableBody = document.getElementById("tableBody");
        orientacoes.forEach((orientacao) => {
          tableBody.innerHTML += `
            <tr class="odd:bg-dark-950/40 *:text-dark-300">
              <td class="px-4 py-2 text-base border border-dark-800">${
                orientacao.tipo || "N/A"
              }</td>
              <td class="px-4 py-2 text-base border border-dark-800">${
                orientacao.autor || "N/A"
              }</td>
              <td class="px-4 py-2 text-base border border-dark-800">${
                orientacao.ano || "N/A"
              }</td>
              <td class="px-4 py-2 text-sm border border-dark-800">${
                orientacao.descricao && orientacao.descricao.length < 60
                  ? orientacao.descricao
                  : orientacao.descricao
                  ? `${orientacao.descricao.slice(0, 60)}...`
                  : "N/A"
              }</td>
              <td class="px-4 py-2 text-base border border-dark-800">${
                orientacao.download
                  ? `<a href="${
                      orientacao.download
                    }" target="_blank">${orientacao.download
                      .split("/")
                      .pop()}</a>`
                  : "Nenhum arquivo"
              }</td>
              <td class="px-4 py-2 border border-dark-800">
                <div class="flex gap-2 justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    data-edit-data='${JSON.stringify(orientacao)}'
                    class="hover:stroke-accent-default duration-200 transition-all feather feather-edit" 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    data-delete-id="${orientacao.id}"
                    class="hover:stroke-accent-default duration-200 transition-all feather feather-trash-2" 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </div>
              </td>
            </tr>
          `;
        });

        tableBody.addEventListener("click", (event) => {
          const deleteButton = event.target.closest("svg[data-delete-id]");
          if (deleteButton) {
            const id = deleteButton.dataset.deleteId;
            if (
              confirm("Você tem certeza que deseja deletar esta orientação?")
            ) {
              fetch(
                "../../scripts/php/admin/orientacoes/delete_orientacoes.php",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: id }),
                }
              )
                .then((response) => response.json())
                .then((result) => {
                  if (result.success) {
                    alert(`Orientação com ID ${id} deletada com sucesso.`);
                    window.location.reload();
                  } else {
                    alert(
                      "Erro ao deletar a orientação: " +
                        (result.error || "Erro desconhecido")
                    );
                  }
                })
                .catch((error) => {
                  console.error("Erro na requisição de deleção:", error);
                  alert("Ocorreu um erro ao tentar deletar a orientação.");
                });
            } else {
              alert("Ação de deleção cancelada.");
            }
            return;
          }

          const editButton = event.target.closest("svg[data-edit-data]");
          if (editButton) {
            const data = JSON.parse(editButton.dataset.editData);
            console.log("Dados para edição:", data);

            const modalTemplate = `
              <div class="fixed inset-0 bg-dark-950/80 flex items-center justify-center" id="modal">
                <div class="bg-dark-900 max-w-[80vw] max-h-[80vh] p-4 rounded-md ring ring-dark-600 shadow-lg overflow-auto">
                  <div class="flex justify-between items-center py-2 border-b mb-4 border-dark-600">
                    <h3 class="p-4">Editar Orientação</h3>
                    <span id="close-modal" class="hover:scale-125 transition-all duration-500 p-4 cursor-pointer">X</span>
                  </div>
                  <form id="edit-orientation-form" class="mx-auto p-6 space-y-2 text-sm grid grid-cols-2 gap-x-8" enctype="multipart/form-data">
                    <input type="hidden" name="id" value="${data.id || ""}" />
                    <input type="hidden" name="download_atual" value="${
                      data.download || ""
                    }" />
                      <div>
                        <label for="tipo" class="block mb-2 text-dark-700">Tipo</label>
                        <select 
                            id="tipo" 
                            name="tipo" 
                            class="w-full px-3 py-2 border border-dark-300 rounded-md bg-dark-900 text-dark-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none" 
                            required
                          >
                            <option value="Tese" ${
                              data.tipo === "Tese" ? "selected" : ""
                            }>Tese</option>
                            <option value="Dissertação" ${
                              data.tipo === "Dissertação" ? "selected" : ""
                            }>Dissertação</option>
                            <option value="TCC" ${
                              data.tipo === "TCC" ? "selected" : ""
                            }>TCC</option>
                            <option value="Relatório IC" ${
                              data.tipo === "Relatório IC" ? "selected" : ""
                            }>Relatório IC</option>
                          </select>
                      </div>
                    <div>
                      <label for="autor" class="block mb-2 text-dark-700">Autor</label>
                      <input id="autor" name="autor" type="text" placeholder="Autor(es)" value="${
                        data.autor || ""
                      }"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
                    </div>
                    <div>
                      <label for="ano" class="block mb-2 text-dark-700">Ano</label>
                      <input id="ano" name="ano" type="number" placeholder="Ano" value="${
                        data.ano || ""
                      }"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
                    </div>
                    <div>
                      <label for="download" class="block mb-2 text-dark-700">Arquivo (PDF, DOC, etc.)</label>
                      <input id="download" name="download" type="file" accept=".pdf,.doc,.docx,.txt"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                      <small class="text-dark-500">Arquivo atual: ${
                        data.download
                          ? data.download.split("/").pop()
                          : "Nenhum"
                      }</small>
                    </div>
                    <div class="col-span-2">
                      <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
                      <textarea id="descricao" name="descricao" placeholder="Descrição da orientação" 
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" rows="4" required>${
                          data.descricao || ""
                        }</textarea>
                    </div>
                    <div class="col-span-2">
                      <button type="submit" class="w-full py-2 px-4 bg-accent-default text-white rounded-md hover:bg-accent-700 transition-colors duration-150 mt-8">
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            `;

            document.body.insertAdjacentHTML("beforeend", modalTemplate);

            const closeModal = document.getElementById("close-modal");
            closeModal.addEventListener("click", () => {
              document.getElementById("modal")?.remove();
            });

            const editForm = document.getElementById("edit-orientation-form");
            editForm.addEventListener("submit", async (e) => {
              e.preventDefault();
              const formData = new FormData(editForm);

              // Log para depuração
              console.log("Dados enviados no FormData:");
              for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
              }

              try {
                const response = await fetch(
                  "../../scripts/php/admin/orientacoes/put_orientacoes.php",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const result = await response.json();
                console.log("Resposta do servidor:", result);

                if (response.ok && result.success) {
                  alert("Orientação editada com sucesso!");
                  document.getElementById("modal").remove();
                  window.location.reload();
                } else {
                  const errorMsg =
                    result.errors?.join("\n") ||
                    result.error ||
                    "Erro desconhecido";
                  alert("Erro ao editar a orientação:\n" + errorMsg);
                }
              } catch (error) {
                console.error("Erro na requisição:", error);
                alert(
                  "Ocorreu um erro ao editar a orientação: " + error.message
                );
              }
            });
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao listar orientações:", error);
    });
}

// Função para adicionar uma nova orientação
function toggleAdicionar() {
  main.innerHTML = `
    <form id="add-orientacao-form" class="mx-auto p-6 shadow-md space-y-2 ring ring-accent-default/30 text-sm rounded-md grid grid-cols-2 gap-x-8" enctype="multipart/form-data">
      <div>
        <label for="tipo" class="block mb-2 text-dark-700">Tipo</label> 
          <select 
        id="tipo" 
        name="tipo" 
        class="w-full px-3 py-2 border border-dark-300 rounded-md bg-dark-900 text-dark-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none" 
        required
      >
        <option value="Tese">Tese</option>
        <option value="Dissertação">Dissertação</option>
        <option value="TCC">TCC</option>
        <option value="Relatório IC">Relatório IC</option>
      </select>
      </div>
      <div>
        <label for="autor" class="block mb-2 text-dark-700">Autor</label>
        <input id="autor" name="autor" type="text" placeholder="Autor(es)"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
      </div>
      <div>
        <label for="ano" class="block mb-2 text-dark-700">Ano</label>
        <input id="ano" name="ano" type="number" placeholder="Ano"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
      </div>
      <div>
        <label for="download" class="block mb-2 text-dark-700">Arquivo (PDF, DOC, etc.)</label>
        <input id="download" name="download" type="file" accept=".pdf,.doc,.docx,.txt"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
      </div>
      <div class="col-span-2">
        <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
        <textarea id="descricao" name="descricao" placeholder="Descrição da orientação"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" rows="4" required></textarea>
      </div>
      <div class="col-span-2">
        <button type="submit" class="w-full py-2 px-4 bg-accent-default text-white rounded-md hover:bg-accent-700 transition-colors duration-150 mt-8">
          Enviar
        </button>
      </div>
    </form>
  `;

  const form = document.getElementById("add-orientacao-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Log para depuração
    console.log("Dados enviados no FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(
        "../../scripts/php/admin/orientacoes/post_orientacoes.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Resposta do servidor:", result);

      if (response.ok && result.success) {
        alert("Orientação adicionada com sucesso!");
        window.location.reload();
      } else {
        let errorMessage =
          result.errors?.join("\n") || result.error || "Erro desconhecido.";
        alert("Erro na requisição:\n" + errorMessage);
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Ocorreu um erro ao enviar o formulário!\n" + error.message);
    }
  });
}

// Configura os ouvintes de eventos após o DOM estar carregado
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn-outline-primary");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("btn-active"));
      button.classList.add("btn-active");

      console.log(button.innerText.trim().toLowerCase());
      switch (button.innerText.trim().toLowerCase()) {
        case "adicionar":
          toggleAdicionar();
          break;
        case "listar":
          toggleListar();
          break;
        default:
          console.error("Nenhuma função associada a esse botão.");
          break;
      }
    });
  });

  buttons[0]?.click(); // Simula clique no primeiro botão (opcional)
});
