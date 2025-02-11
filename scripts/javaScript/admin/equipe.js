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
  main.innerHTML = `
    <table class="min-w-full border border-dark-700">
      <thead>
        <tr class="bg-dark-950/50">
          <th class="px-4 py-2 border border-dark-300">Nome</th>
          <th class="px-4 py-2 border border-dark-300">Descrição</th>
          <th class="px-4 py-2 border border-dark-300">Email</th>
          <th class="px-4 py-2 border border-dark-300">Imagem</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-4 py-2 border border-dark-300">Alexandre Marques</td>
          <td class="px-4 py-2 border border-dark-300">
            Lorem ipsum dolor s...
          </td>
          <td class="px-4 py-2 border border-dark-300">alexandre@email.com</td>
          <td class="px-4 py-2 border border-dark-300">
            a
            b
            c

          </td>
        </tr>
      </tbody>
    </table>
    `;
}

function toggleAdicionar() {
  main.innerHTML = `
    <form
    class="mx-auto p-6 shadow-md space-y-4 ring ring-accent-default/30 rounded-md grid grid-cols-2 gap-x-8"
  >
    <div>
      <label for="nome" class="block mb-2 text-dark-700">Nome</label>
      <input
        id="nome"
        name="nome"
        type="text"
        placeholder="Seu nome"
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
      <label for="email" class="block mb-2 text-dark-700">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Seu email"
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
    </div>
    <div>
      <label for="dataInicio" class="block mb-2 text-dark-700">Data de Início</label>
      <input
        id="dataInicio"
        name="dataInicio"
        type="date"
        class="w-full px-3 py-2 border border-dark-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
      />
    </div>
    <div>
      <label for="dataFim" class="block mb-2 text-dark-700">Data de Fim</label>
      <input
        id="dataFim"
        name="dataFim"
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

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const result = await response.json();
        console.log("Sucesso:", result);
        alert("Formulário enviado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        alert("Ocorreu um erro ao enviar o formulário!");
      }
    });
  });
}

buttons[0].click();
