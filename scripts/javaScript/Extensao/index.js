const buttons = document.querySelectorAll(".btn-outline-primary");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("btn-active"));
    button.classList.add("btn-active");

    switch (button.innerText.trim().toLowerCase()) {
      case "projetos de extensão":
        projetosdExtensao();
        break;
      case "dicas de piano":
        dicasPiano();
        break;
      default:
        console.error("Nenhuma função associada a esse botão.");
        break;
    }
  });
});

function projetosdExtensao() {
  document.getElementById("contentContainer").innerHTML = `
    <div>
        <div class="grid md:grid-cols-1 gap-4 items-center justify-items-center">
          <div class=" md:text-left">
            <h2>Projetos de Extenção</h2>
            <p>
              Quer saber mais sobre nossos projetos incríveis? Estamos trabalhando em iniciativas que fazem a diferença, e gostaríamos de compartilhar tudo isso com você! Clique no link abaixo para explorar detalhes, descobrir como participamos e se inspirar com o que estamos construindo juntos. Venha fazer parte dessa jornada!
            </p>
          </div>
          <div>
            <a href="https://drive.google.com/drive/u/1/folders/1ygOmb6Mgw-ItUBc431krZaHdPYmTZmp2" target="_blank" class="btn-outline-primary w-48">Explorar</a>
          </div>
        </div>
      </div>

`;
}

function dicasPiano() {
  document.getElementById("contentContainer").innerHTML = `
  <div class="w-[80vw] md:w-[50vw] h-[50vh] mx-auto">
  <iframe class="w-full h-full rounded-md"  src="https://www.youtube.com/embed/videoseries?si=dFBIH32f_BG0sHvT&amp;controls=0&amp;list=PLeH4ADEEkI4_nP6CCkLb8r0L7zbjE6H1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

`;
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
