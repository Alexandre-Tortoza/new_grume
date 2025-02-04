import { createHeader } from "../../components/headerComponent.js";
import { createFooter } from "../../components/footerComponent.js";

document.getElementById("header__container").innerHTML = createHeader();
document.getElementById("footer__container").innerHTML = createFooter();
