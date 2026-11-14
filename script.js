
const API_URL = "https://delicate-sun-63ef.kilian-jakub10.workers.dev";

const loginButton = document.getElementById("loginButton");
const ticketButton = document.getElementById("ticketButton");
const loginStatus = document.getElementById("loginStatus");

let currentUser = null;

// Přihlášení přes Discord
loginButton.addEventListener("click", () => {
  window.location.href = `${API_URL}/auth/discord`;
});

// Kontrola přihlášení
async function checkLogin() {
  try {
    const response = await fetch(`${API_URL}/api/me`, {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (data.loggedIn && data.user) {
      currentUser = data.user;

      loginButton.textContent = currentUser.username;
      loginStatus.textContent =
        `Jsi přihlášený jako ${currentUser.username}.`;

      ticketButton.disabled = false;
    } else {
      currentUser = null;
      loginStatus.textContent = "Nejsi přihlášený přes Discord.";
      ticketButton.disabled = true;
    }
  } catch (error) {
    loginStatus.textContent = "Nepodařilo se ověřit přihlášení.";
    ticketButton.disabled = true;
  }
}

// Zatím zobrazíme informaci, že tvorba tiketů bude následovat.
ticketButton.addEventListener("click", () => {
  if (!currentUser) {
    alert("Nejdříve se přihlas přes Discord.");
    return;
  }

  alert("Systém vytváření tiketů právě připravujeme.");
});

checkLogin();
