export function createHeader() {
  const isPagesResult = isPages();
  return `
    <header class="relative w-full">
      <!-- Cabeçalho com logo e navegação -->
      <div class="flex justify-between items-center p-4">
        <div>
          <a href="/">
            <img src="${
              isPagesResult
                ? "../assets/grume_ufpr_logo.svg"
                : "./assets/grume_ufpr_logo.svg"
            }" alt="Logo Grume UFPR">
          </a>
        </div>
        <!-- Botão para menu mobile (visível apenas em telas menores) -->
        <button id="mobile-menu-button" class="md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" 
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <!-- Menu de navegação para desktop -->
        <nav class="hidden md:block">
          <ul class="flex gap-6 font-sans">
            <li ${isActive("/") ? 'class="text-accent-default"' : ""}>
              <a href="/">Home</a>
            </li>
            <li ${
              isActive("/pages/sobre-o-danilo-ramos.html")
                ? 'class="text-accent-default"'
                : ""
            }>
              <a href="/pages/sobre-o-danilo-ramos.html">Professor Danilo Ramos</a>
            </li>
            <li ${
              isActive("/pages/pesquisa.html")
                ? 'class="text-accent-default"'
                : ""
            }>
              <a href="/pages/pesquisa.html">Pesquisa</a>
            </li>
            <li ${
              isActive("/pages/artistico.html")
                ? 'class="text-accent-default"'
                : ""
            }>
              <a href="/pages/artistico.html">Artístico</a>
            </li>
            <li ${
              isActive("/pages/ensino-e-extensao.html")
                ? 'class="text-accent-default"'
                : ""
            }>
              <a href="/pages/ensino-e-extensao.html">Ensino e Extensão</a>
            </li>
            <li ${
              isActive("/pages/infraestrutura.html")
                ? 'class="text-accent-default"'
                : ""
            }>
              <a href="/pages/infraestrutura.html">Infraestrutura</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Sidebar Mobile -->
      <div id="mobile-sidebar" class="fixed inset-0 z-50 hidden">
        <!-- Fundo semi-transparente -->
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <!-- Conteúdo da sidebar -->
        <aside class="fixed inset-y-0 left-0 w-64 bg-dark-950 p-4 z-60">
          <!-- Botão para fechar a sidebar -->
          <button id="close-sidebar" class="mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" 
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <!-- Menu de navegação para mobile -->
          <nav>
            <ul class="flex flex-col gap-4">
              <li ${isActive("/") ? 'class="text-accent-default"' : ""}>
                <a href="/">Home</a>
              </li>
              <li ${
                isActive("/pages/sobre-o-danilo-ramos.html")
                  ? 'class="text-accent-default"'
                  : ""
              }>
                <a href="/pages/sobre-o-danilo-ramos.html">Professor Danilo Ramos</a>
              </li>
              <li ${
                isActive("/pages/pesquisa.html")
                  ? 'class="text-accent-default"'
                  : ""
              }>
                <a href="/pages/pesquisa.html">Pesquisa</a>
              </li>
              <li ${
                isActive("/pages/artistico.html")
                  ? 'class="text-accent-default"'
                  : ""
              }>
                <a href="/pages/artistico.html">Artístico</a>
              </li>
              <li ${
                isActive("/pages/ensino-e-extensao.html")
                  ? 'class="text-accent-default"'
                  : ""
              }>
                <a href="/pages/ensino-e-extensao.html">Ensino e Extensão</a>
              </li>
              <li ${
                isActive("/pages/infraestrutura.html")
                  ? 'class="text-accent-default"'
                  : ""
              }>
                <a href="/pages/infraestrutura.html">Infraestrutura</a>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </header>
  `;
}

function isActive(path) {
  return window.location.pathname === path;
}

function isPages() {
  return window.location.pathname.startsWith("/pages/");
}

// Adiciona os event listeners para abertura e fechamento da sidebar mobile
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const closeSidebar = document.getElementById("close-sidebar");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileSidebar.classList.remove("hidden");
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener("click", () => {
      mobileSidebar.classList.add("hidden");
    });
  }

  // Opcional: fecha a sidebar ao clicar fora do menu (na área semi-transparente)
  mobileSidebar.addEventListener("click", (e) => {
    if (e.target === mobileSidebar) {
      mobileSidebar.classList.add("hidden");
    }
  });
});
