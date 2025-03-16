const buttons = document.querySelectorAll(".btn-outline-primary");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("btn-active"));
    button.classList.add("btn-active");

    switch (button.innerText.trim().toLowerCase()) {
      case "palestras e vídeos":
        palestrasVideos();
        break;

      case "disciplinas":
        disciplinas();
        break;
      default:
        console.error("Nenhuma função associada a esse botão.");
        break;
    }
  });
});

function disciplinas() {
  fetch("../scripts/php/ensinoExtensao/get_disciplinas.php")
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
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8" id="content"></div>
`;

      const content = document.getElementById("content");

      if (data.length === 0) {
        content.innerHTML =
          "<p class='text-gray-500'>Nenhuma disciplina encontrado.</p>";
      } else {
        data.forEach((disciplina) => {
          content.innerHTML += `
            <a href="${disciplina.link}" target="_blank" 
            class="group text-center hover:scale-105 transition-all duration-200 border border-accent-default hover:border-accent-700 rounded-md px-8 py-4">
            
            <h3>${disciplina.nome}</h3>
            
            <p class="text-sm my-6 text-justify">${disciplina.descricao}</p>
            
            <p class="transition-all duration-200 group-hover:text-accent-default">Link</p>
          </a>

          `;
        });
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

function palestrasVideos() {
  document.getElementById("contentContainer").innerHTML = `
  <div class="w-[80vw] md:w-[50vw] h-[50vh] mx-auto">
  <iframe 
    class="w-full h-full rounded-md" 
    src="https://www.youtube.com/embed/videoseries?si=gaCteSvJFN9Yy4k0&amp;controls=0&amp;list=PLeH4ADEEkI4_b_Z7pN9BXqQVNqh_56VHy" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" 
    allowfullscreen>
  </iframe>
</div>

`;
}
buttons[0].click();
