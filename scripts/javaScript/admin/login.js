document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Faz a requisição POST para o backend
      const response = await fetch("../../scripts/php/admin/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Armazena o token no localStorage
        localStorage.setItem("token", data.token);
        window.location.href = "equipe.html";
      } else {
        // Exibe mensagem de erro
        document.getElementById("error-message").classList.remove("hidden");
        document.getElementById("error-message").innerText = data.message;
      }
    } catch (error) {
      console.error("Erro:", error);
      document.getElementById("error-message").classList.remove("hidden");
      document.getElementById("error-message").innerText =
        "Ocorreu um erro inesperado.";
    }
  });
