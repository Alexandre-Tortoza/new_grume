const buttons = document.querySelectorAll(".btn-outline-primary");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("btn-active"));
    button.classList.add("btn-active");

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
        document.getElementById("contentContainer").innerHTML = "";
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      const container = document.getElementById("contentContainer");
      container.innerHTML = `
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="content"></div>
`;

      const content = document.getElementById("content");

      if (data.length === 0) {
        content.innerHTML =
          "<p class='text-gray-500'>Nenhum membro encontrado.</p>";
      } else {
        data.forEach((membro) => {
          content.innerHTML += `
          <div class="rounded-md border border-accent-default p-4 max-w-3xl mx-auto hover:scale-105 hover:border-accent-600 transition-all duration-150 ease-in flex flex-col justify-between">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <img src="../assets/membros/${membro.imagem}" alt="Imagem do ${membro.nome}" class="w-full sm:w-auto rounded-md object-cover max-md:m-auto size-48">

                        <div class="sm:col-span-2">
                            <h3 class="font-semibold  ">${membro.nome}</h3>
                            <p class="mt-2 text-base text-dark-400">
                                ${membro.descricao}
                            </p>
                        </div>
                    </div>

                    <!-- Informações Adicionais -->
                    <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-accent-default">
                        <p class="text-sm ">${membro.data_inicio} - ${membro.data_fim}</p>
                        <ul class="flex gap-8 mt-2 sm:mt-0 font-sans">
                            <li>
                                <a href="${membro.curriculo}" target="_blank" class="flex gap-2 hover:brightness-125"><img src="../assets/icons/cv.svg" alt="Currículo">Currículo</a>
                            </li>
                            <li>
                                <a href="mailto:${membro.email}" class="flex gap-2 hover:brightness-125"><img src="../assets/icons/mail.svg" alt="Email"> Email</a>
                            </li>
                        </ul>
                    </div>
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
  fetch("../scripts/php/pesquisa/get_orientacoes.php")
    .then((response) => {
      if (!response.ok) {
        document.getElementById("contentContainer").innerHTML = "";
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      const container = document.getElementById("contentContainer");

      if (data.length === 0) {
        container.innerHTML =
          "<p class='text-gray-500'>Nenhuma pesquisa encontrado.</p>";
      } else {
        document.getElementById("contentContainer").innerHTML = "";
        data.forEach((orientacoes) => {
          container.innerHTML += ` <div class="flex flex-col align-middle md:grid grid-cols-1 md:grid-cols-6 text-center items-center justify-center gap-4 border-b-2 border-accent-700 py-4 
            last:border-0">
                <div class="flex justify-center items-center">
                    <h3>${orientacoes.tipo}</h3>
                </div>
                <div class="flex flex-col justify-center items-center">
                    <h3>${orientacoes.autor}</h3>
                    <h4 class="text-sm">${orientacoes.ano}</h4>
                </div>
                <div class="col-span-3 flex justify-center items-center font-base">
                    <p class="text-sm">${orientacoes.descricao}</p>
                </div>
                <div class="flex justify-center items-center">
                    <a href="../assets/orientacoes/${orientacoes.download}" download class="text-accent-default hover:underline">Download</a>
                </div>
            </div>`;
        });
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function publicacoes() {
  fetch("../scripts/php/pesquisa/get_publicacoes.php")
    .then((response) => {
      if (!response.ok) {
        document.getElementById("contentContainer").innerHTML = "";
        throw new Error("Erro ao buscar os dados");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dados recebidos:", data);

      const container = document.getElementById("contentContainer");

      if (data.length === 0) {
        container.innerHTML =
          "<p class='text-gray-500'>Nenhuma pesquisa encontrado.</p>";
      } else {
        document.getElementById("contentContainer").innerHTML = "";
        data.forEach((publicacoes) => {
          container.innerHTML += `  <div class="flex flex-col align-middle md:grid grid-cols-1 md:grid-cols-6 text-center items-center justify-center gap-4 border-b-2 border-accent-700 py-4
            last:border-0">
                <div class="flex justify-center items-center">
                    <h3>${publicacoes.tipo}</h3>
                </div>
                <div class="flex flex-col justify-center items-center">
                    <h3>${publicacoes.autor}</h3>
                     <h4 class="text-sm">${publicacoes.ano}</h4>
                </div>
                <div class="col-span-3 flex justify-center items-center font-base">
                    <p class="text-sm">${publicacoes.descricao}</p>
                </div>
                <div class="flex justify-center items-center">
                    <a href="${publicacoes.download}" target="_blank" class="text-accent-default hover:underline">Link</a>
                </div>
            </div>`;
        });
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function documentos() {
  document.getElementById("contentContainer").innerHTML = `
   <a href="#" target="_blank" class="border hover:text-accent-default border-accent-default max-w-40 mx-auto p-4 flex flex-col justify-center items-center rounded md hover:scale-105 hover:border-accent-600 transition-all text-center delay-100 duration-200">
                <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
                    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
                    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
                    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
                    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
                    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
                </svg>
                <p class="mt-8 ">Link para o Drive</p>
            </a>
  `;
}

buttons[0].click();
