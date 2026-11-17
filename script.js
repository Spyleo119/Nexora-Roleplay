
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

// Vytvoření ticketu
ticketButton.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Nejdříve se přihlas přes Discord.");
    return;
  }

  const reason = prompt("Napiš důvod, proč potřebuješ podporu:");

  if (reason === null) return;

  if (reason.trim().length === 0) {
    alert("Musíš vyplnit důvod ticketu.");
    return;
  }

  if (reason.trim().length > 300) {
    alert("Důvod může mít maximálně 300 znaků.");
    return;
  }

  ticketButton.disabled = true;
  ticketButton.textContent = "Vytvářím ticket...";

  try {
    const response = await fetch(`${API_URL}/api/tickets`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reason: reason.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ticket se nepodařilo vytvořit.");
    }

    if (data.channelId) {
      loginStatus.innerHTML =
        `Ticket byl vytvořen! <a href="https://discord.com/channels/1540371311568879626/${data.channelId}" target="_blank" rel="noopener noreferrer">Otevřít ticket na Discordu</a>`;
    } else {
      loginStatus.textContent =
        "Ticket byl vytvořen. Zkontroluj Discord.";
    }

  } catch (error) {
    alert(error.message || "Nastala chyba při vytváření ticketu.");
  } finally {
    ticketButton.disabled = false;
    ticketButton.textContent = "Vytvořit žádost";
  }
});

checkLogin();
