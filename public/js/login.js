const loginForm = document.getElementById("loginForm");
const usuarioInput = document.getElementById("usuario");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

function mostrarMensaje(mensaje) {
  loginMessage.textContent = mensaje;
  loginMessage.classList.add("is-visible");
}

function mostrarErrorDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (error === "credenciales") {
    mostrarMensaje("Usuario o contraseña incorrectos");
  }

  if (error === "campos") {
    mostrarMensaje("Ambos campos son obligatorios");
  }
}

loginForm.addEventListener("submit", function (event) {
  const usuario = usuarioInput.value.trim();
  const password = passwordInput.value.trim();

  if (!usuario || !password) {
    event.preventDefault();
    mostrarMensaje("Ambos campos son obligatorios");
  }
});

mostrarErrorDesdeUrl();

