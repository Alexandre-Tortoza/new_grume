async function getMembers() {
  try {
    // Faz a requisição para o PHP
    const response = await fetch("../scripts/php/getEquipe.php", {
      method: "GET",
    });

    // Verifica se a resposta é bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    // Converte a resposta para JSON
    const members = await response.json();

    // Seleciona o contêiner onde os membros serão inseridos
    const container = document.getElementById("member__container");

    // Constrói o HTML para os membros
    container.innerHTML = Object.values(members)
      .map(
        (member) => `
        <div class="member">
          <h3>${member.name}</h3>
          <p>${member.description}</p>
          <a href="${member.curriculum}" target="_blank">Currículo</a>
          <p>Período: ${member.start_year} - ${member.end_year}</p>
        </div>
      `
      )
      .join("");

    console.log("Membros carregados com sucesso!");
  } catch (error) {
    console.error("Erro ao carregar os membros:", error);
  }
}

// Chama a função
getMembers();
