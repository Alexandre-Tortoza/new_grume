// Importar os componentes
import { createHeader } from '../components/headerComponent.js';
import { createFooter } from '../components/footerComponent.js';

// Inserir o Header no DOM
document.getElementById('header__container').innerHTML = createHeader();

// Inserir o Footer no DOM
document.getElementById('footer__container').innerHTML = createFooter();
