export function createHeader() {
  const isPagesResult = isPages();

  return `
    <div>
      <a href="/">
        <img src="${isPagesResult ? '../assets/grume_ufpr_logo.svg' : './assets/grume_ufpr_logo.svg'}" alt="Logo Grume UFPR">
      </a>
    </div>

    <nav>
      <ul>
        <li ${isActive('/') ? 'class="headerLink-active"' : ''}>
          <a href="/">Home</a>
        </li>
        <li ${isActive('/pages/sobre-o-danilo-ramos.html') ? 'class="headerLink-active"' : ''}>
          <a href="/pages/sobre-o-danilo-ramos.html">Professor Danilo Ramos</a>
        </li>
        <li ${isActive('/pages/pesquisa.html') ? 'class="headerLink-active"' : ''}>
          <a href="/pages/pesquisa.html">Pesquisa</a>
        </li>
        <li ${isActive('/pages/artistico.html') ? 'class="headerLink-active"' : ''}>
          <a href="/pages/artistico.html">Artístico</a>
        </li>
        <li ${isActive('/pages/ensino-e-extensao.html') ? 'class="headerLink-active"' : ''}>
          <a href="/pages/ensino-e-extensao.html">Ensino e Extensão</a>
        </li>
        <li ${isActive('/pages/infraestrutura.html') ? 'class="headerLink-active"' : ''}>
          <a href="/pages/infraestrutura.html">Infraestrutura</a>
        </li>
      </ul>
    </nav>
  `;
}

function isActive(path) {
  return window.location.pathname === path;
}

function isPages() {
  return window.location.pathname.startsWith('/pages/');
}
