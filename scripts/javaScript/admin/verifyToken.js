document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Acesso negado. Por favor, faça login.");
    window.location.href = "login.html";
    return;
  }

  // Decodifica o token para verificar se está expirado
  const tokenPayload = JSON.parse(atob(token.split(".")[0]));

  if (tokenPayload.exp < Math.floor(Date.now() / 1000)) {
    alert("Sessão expirada. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  // Botão de logout
  // document.getElementById("logout").addEventListener("click", function () {
  //   localStorage.removeItem("token");
  //   window.location.href = "login.html";
  // });
});
