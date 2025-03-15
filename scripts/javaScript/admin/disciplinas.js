let main = document.getElementById("main__content");

// Initial fetch (opcional, para carregar dados ao iniciar a página)
fetch("../../scripts/php/ensinoExtensao/get_disciplinas.php")
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

// Função para listar as disciplinas
function toggleListar() {
  fetch("../../scripts/php/ensinoExtensao/get_disciplinas.php")
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
      const disciplinas = Array.isArray(data) ? data : Object.values(data);

      if (disciplinas.length === 0) {
        main.innerHTML =
          "<p class='text-gray-500'>Nenhuma disciplina encontrada.</p>";
      } else {
        main.innerHTML = `
          <table class="min-w-full border border-dark-700">
            <thead>
              <tr class="bg-dark-900">
                <th class="px-4 py-2 border border-dark-600">Nome</th>
                <th class="px-4 py-2 border border-dark-600">Link do Drive</th>
                <th class="px-4 py-2 border border-dark-600">Descrição</th>
                <th class="px-4 py-2 border border-dark-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody id="tableBody"></tbody>
          </table>
        `;

        const tableBody = document.getElementById("tableBody");
        disciplinas.forEach((disciplina) => {
          tableBody.innerHTML += `
            <tr class="odd:bg-dark-950/40 *:text-dark-300">
              <td class="px-4 py-2 text-base border border-dark-800">${
                disciplina.nome || "N/A"
              }</td>
              <td class="px-4 py-2 text-base border border-dark-800">${
                disciplina.link || "N/A"
              }</td>
              <td class="px-4 py-2 text-sm border border-dark-800">${
                disciplina.descricao && disciplina.descricao.length < 60
                  ? disciplina.descricao
                  : disciplina.descricao
                  ? `${disciplina.descricao.slice(0, 60)}...`
                  : "N/A"
              }</td>
              <td class="px-4 py-2 border border-dark-800">
                <div class="flex gap-2 justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    data-edit-data='${JSON.stringify(disciplina)}'
                    class="hover:stroke-accent-default duration-200 transition-all feather feather-edit" 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    data-delete-id="${disciplina.id}"
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

        // Único ouvinte de eventos para edit e delete
        tableBody.addEventListener("click", (event) => {
          const deleteButton = event.target.closest("svg[data-delete-id]");
          if (deleteButton) {
            const id = deleteButton.dataset.deleteId;
            console.log("Deletar disciplina com ID:", id);
            if (
              confirm("Você tem certeza que deseja deletar esta disciplina?")
            ) {
              fetch(
                "../../scripts/php/admin/disciplinas/delete_disciplinas.php",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id: id }),
                }
              )
                .then((response) => response.json()) // Alterado para obter JSON
                .then((result) => {
                  if (result.success) {
                    alert(`Disciplina com ID ${id} deletada com sucesso.`);
                    window.location.reload();
                  } else {
                    alert(
                      "Erro ao deletar a disciplina: " +
                        (result.error || "Erro desconhecido")
                    );
                  }
                })
                .catch((error) => {
                  console.error("Erro na requisição de deleção:", error);
                  alert("Ocorreu um erro ao tentar deletar a disciplina.");
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
                    <h3 class="p-4">Editar Disciplina</h3>
                    <span id="close-modal" class="hover:scale-125 transition-all duration-500 p-4 cursor-pointer">X</span>
                  </div>
                  <form id="edit-discipline-form" class="mx-auto p-6 space-y-2 text-sm grid grid-cols-2 gap-x-8">
                    <input type="hidden" name="id" value="${data.id || ""}" />
                    <div>
                      <label for="nome" class="block mb-2 text-dark-700">Nome da Disciplina</label>
                      <input id="nome" name="nome" type="text" placeholder="Nome da disciplina" value="${
                        data.nome || ""
                      }"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
                    </div>
                    <div>
                      <label for="link" class="block mb-2 text-dark-700">Link do Drive</label>
                      <input id="link" name="link" type="url" placeholder="Link do Drive" value="${
                        data.link || ""
                      }"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                    </div>
                    <div class="col-span-2">
                      <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
                      <textarea id="descricao" name="descricao" placeholder="Descrição da disciplina" 
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

            const editForm = document.getElementById("edit-discipline-form");
            editForm.addEventListener("submit", async (e) => {
              e.preventDefault();
              const formData = new FormData(editForm);

              // Log para verificar os dados enviados
              console.log("Dados enviados no FormData:");
              for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
              }

              try {
                const response = await fetch(
                  "../../scripts/php/admin/disciplinas/put_disciplinas.php",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const result = await response.json();
                console.log("Resposta do servidor:", result);

                if (response.ok && result.success) {
                  alert("Disciplina editada com sucesso!");
                  document.getElementById("modal").remove();
                  window.location.reload();
                } else {
                  const errorMsg =
                    result.errors?.join("\n") ||
                    result.error ||
                    "Erro desconhecido";
                  alert("Erro ao editar a disciplina:\n" + errorMsg);
                }
              } catch (error) {
                console.error("Erro na requisição:", error);
                alert(
                  "Ocorreu um erro ao editar a disciplina: " + error.message
                );
              }
            });
          }
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao listar disciplinas:", error);
    });
}

// Função para adicionar uma nova disciplina
function toggleAdicionar() {
  main.innerHTML = `
    <form class="mx-auto p-6 shadow-md space-y-2 ring ring-accent-default/30 text-sm rounded-md grid grid-cols-2 gap-x-8">
      <div>
        <label for="nome" class="block mb-2 text-dark-700">Nome da Disciplina</label>
        <input id="nome" name="nome" type="text" placeholder="Nome da disciplina"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" required />
      </div>
      <div>
        <label for="link" class="block mb-2 text-dark-700">Link do Drive</label>
        <input id="link" name="link" type="url" placeholder="Link do Drive"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
      </div>
      <div class="col-span-2">
        <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
        <textarea id="descricao" name="descricao" placeholder="Descrição da disciplina"
          class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" rows="4" required></textarea>
      </div>
      <div class="col-span-2">
        <button type="submit" class="w-full py-2 px-4 bg-accent-default text-white rounded-md hover:bg-accent-700 transition-colors duration-150 mt-8">
          Enviar
        </button>
      </div>
    </form>
  `;

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "../../scripts/php/admin/disciplinas/post_disciplinas.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        let errorMessage =
          result.errors?.join("\n") || result.error || "Erro desconhecido.";
        alert("Erro na requisição:\n" + errorMessage);
        return;
      }

      console.log("Sucesso:", result);
      alert("Disciplina adicionada com sucesso!");
      window.location.reload();
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
