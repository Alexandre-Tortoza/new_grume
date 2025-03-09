let main = document.getElementById("main__content");

fetch("../../scripts/php/pesquisa/get_equipe.php")
  .then((response) => {
    if (!response.ok) {
      document.getElementById("contentContainer").innerHTML = "";
      throw new Error("Erro ao buscar os dados");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });

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

function toggleListar() {
  fetch("../../scripts/php/pesquisa/get_equipe.php")
    .then((response) => {
      if (!response.ok) {
        main.innerHTML = "";
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      if (data.length === 0) {
        main.innerHTML =
          "<p class='text-gray-500'>Nenhum membro encontrado.</p>";
      } else {
        main.innerHTML = `
          <table class="min-w-full border border-dark-700">
            <thead>
              <tr class="bg-dark-900">
                <th class="px-4 py-2 border border-dark-600">Nome</th>
                <th class="px-4 py-2 border border-dark-600">Descrição</th>
                <th class="px-4 py-2 border border-dark-600">Email</th>
                <th class="px-4 py-2 border border-dark-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody id="tableBody">
             
            </tbody>
          </table>
          `;
        const tableBody = document.getElementById("tableBody");
        data.forEach((membro) => {
          tableBody.innerHTML += `
            <tr class="odd:bg-dark-950/40 *:text-dark-300">
              <td class="px-4 py-2 text-base border border-dark-800">
                ${membro.nome}
              </td>
              <td class="px-4 py-2 text-sm border border-dark-800">
                ${
                  membro.descricao.length < 60
                    ? membro.descricao
                    : `${membro.descricao.slice(0, 60)}...`
                }
              </td>
              <td class="px-4 py-2 border text-base border-dark-800">
                ${membro.email}
              </td>
              <td class="px-4 py-2 border border-dark-800 ">

                <div class="flex gap-2 justify-center">
                           
                <svg 
                ${JSON.stringify(membro)}
                    xmlns="http://www.w3.org/2000/svg" 
                    data-editData='${JSON.stringify(membro)}'
                    class="hover:stroke-accent-default duration-200 transition-all feather feather-edit" 
                    width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    data-deleteId="${membro.id}"
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
        const deleteButtons = document.querySelectorAll("svg[data-deleteId]");
        deleteButtons.forEach(async (button) => {
          button.addEventListener("click", async () => {
            const id = button.dataset.deleteid;
            console.log("Valor de id:", id);
            if (confirm("Você tem certeza que deseja deletar este membro?")) {
              try {
                const response = await fetch(
                  "../../scripts/php/admin/deleteMembroId.php",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: id }),
                  }
                );

                console.log(response);

                if (response.ok) {
                  alert(`Membro com ID ${id} deletado com sucesso.`);
                  window.location.reload();
                } else {
                  alert("Erro ao deletar o membro.");
                }
              } catch (error) {
                console.error("Erro na requisição de deleção:", error);
                alert("Ocorreu um erro ao tentar deletar o membro.");
              }
            } else {
              alert("Ação de deleção cancelada.");
            }
          });
        });

        const editButtons = document.querySelectorAll("svg[data-editData]");
        editButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const data = JSON.parse(button.dataset.editdata);

            const modalTemplate = `
              <div class="fixed inset-0 bg-dark-950/80 flex items-center justify-center" id="modal">
                <div class="bg-dark-900 max-w-[80vw] max-h-[80vh] p-4 rounded-md ring ring-dark-600 shadow-lg overflow-auto">
                  <div class="flex justify-between items-center py-2 border-b mb-4 border-dark-600">
                    <h3 class="p-4">Editar</h3>
                    <span id="close-modal" class="hover:scale-125 transition-all duration-500 p-4 cursor-pointer">
                      X
                    </span>
                  </div>
                  <!-- Formulário de edição -->
                  <form id="edit-member-form" class="mx-auto p-6 space-y-2 text-sm grid grid-cols-2 gap-x-8">
                    <!-- Campo oculto para o ID -->
                    <input type="hidden" name="id" value="${data.id}" />
                    <div>
                      <label for="nome" class="block mb-2 text-dark-700">Nome</label>
                      <input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        value="${data.nome}"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div>
                      <label for="curriculo" class="block mb-2 text-dark-700">Currículo</label>
                      <input
                        id="curriculo"
                        name="curriculo"
                        type="text"
                        placeholder="Link para o Currículo"
                        value="${data.curriculo}"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div class="col-span-2">
                      <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
                      <textarea
                        id="descricao"
                        name="descricao"
                        placeholder="Digite uma descrição"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                        rows="4"
                      >${data.descricao}</textarea>
                    </div>
                    <div>
                      <label for="email" class="block mb-2 text-dark-700">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Seu email"
                        value="${data.email}"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div>
                      <label for="foto" class="block mb-2 text-dark-700">Foto de Perfil</label>
                      <input
                        id="foto"
                        name="foto"
                        type="file"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                      <img src="${data.imagem}" alt="Foto atual" class="w-16 h-16 object-cover mt-2 rounded-md" />
                    </div>
                    <div>
                      <label for="dataInicio" class="block mb-2 text-dark-700">Data de Início</label>
                      <input
                        id="dataInicio"
                        name="dataInicio"
                        type="date"
                        value="${data.data_inicio}"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div>
                      <label for="dataFim" class="block mb-2 text-dark-700">Data de Fim</label>
                      <input
                        id="dataFim"
                        name="dataFim"
                        type="date"
                        value="${data.data_fim}"
                        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div class="col-span-2">
                      <button
                        type="submit"
                        class="w-full py-2 px-4 bg-accent-default text-white rounded-md hover:bg-accent-700 transition-colors duration-150 mt-8"
                      >
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
              const modal = document.getElementById("modal");
              if (modal) {
                modal.remove();
              }
            });

            const editForm = document.getElementById("edit-member-form");
            editForm.addEventListener("submit", async (e) => {
              e.preventDefault();
              const formData = new FormData(editForm);

              try {
                const response = await fetch(
                  "../../scripts/php/admin/putMembro.php",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const result = await response.json();
                if (response.ok) {
                  alert("Membro editado com sucesso!");
                  document.getElementById("modal").remove();

                  window.location.reload();
                } else {
                  alert("Erro ao editar o membro: " + result.error);
                }
              } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Ocorreu um erro ao editar o membro.");
              }
            });
          });
        });
      }
    });
}

function toggleAdicionar() {
  main.innerHTML = `
    <form
    class="mx-auto p-6 shadow-md space-y-2 ring ring-accent-default/30 text-sm rounded-md grid grid-cols-2 gap-x-8"
  >
    <div>
      <label for="Categoria" class="block mb-2 text-dark-700">Categoria</label>
      <input
        id="Categoria"
        name="Categoria"
        type="text"
        placeholder="Qual a Categoria ?"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
    <div>
      <label for="Autor" class="block mb-2 text-dark-700">Autor</label>
      <input
        id="Autor"
        name="Autor"
        type="text"
        placeholder="Qual o Autor ?"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
    <div class="col-span-2">
      <label for="descricao" class="block mb-2 text-dark-700">Descrição</label>
      <textarea
        id="descricao"
        name="descricao"
        placeholder="Digite uma descrição"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        rows="4"
      ></textarea>
    </div>
    <div>
      <label for="donwload" class="block mb-2 text-dark-700">Link para download</label>
      <input
        id="donwload"
        name="donwload"
        type="donwload"
        placeholder="Seu donwload"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
   
    <div>
      <label for="data" class="block mb-2 text-dark-700">Data de publicação</label>
      <input
        id="data"
        name="data"
        type="date"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
 
    <div class="col-span-2">
      <button
        type="submit"
        class="w-full py-2 px-4 bg-accent-default text-white rounded-md hover:bg-accent-700 transition-colors duration-150 mt-8"
      >
        Enviar
      </button>
    </div>
  </form>

    `;

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch(
          "../../scripts/php/admin/postMembros.php",
          {
            method: "POST",
            body: formData,
          }
        );

        // Obtém o resultado da resposta em JSON
        const result = await response.json();

        // Se a resposta não for ok, exibe os erros via alert e interrompe a execução
        if (!response.ok) {
          let errorMessage = "";

          // Se houver um array de erros, junta as mensagens; caso contrário, verifica a propriedade "error"
          if (result.errors && Array.isArray(result.errors)) {
            errorMessage = result.errors.join("\n");
          } else if (result.error) {
            errorMessage = result.error;
          } else {
            errorMessage = "Erro desconhecido.";
          }

          alert("Erro na requisição:\n" + errorMessage);
          return;
        }

        console.log("Sucesso:", result);
        alert("Formulário enviado com sucesso!");
        window.location.reload();
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert("Ocorreu um erro ao enviar o formulário!\n" + error.message);
      }
    });
  });
}

buttons[0].click();
