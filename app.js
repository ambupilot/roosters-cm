let roosters = [];
let comments = {};
let isEditable = false;
let lastSelectedWeek = null;

document.addEventListener("DOMContentLoaded", () => {
  fetchAllWeeks();

  document.getElementById("edit-toggle").addEventListener("change", (e) => {
    isEditable = e.target.value === "aan";
    updateEditableState();
  });

  document.getElementById("save-button").addEventListener("click", saveComments);
});

async function fetchAllWeeks() {
  try {
    const response = await fetch("get_roosters.php");
    const data = await response.json();
    roosters = data;
    populateWeekSelect();
    const defaultWeek = 51; // Start met week 51
    populateTable(defaultWeek);
    updateWeekInfo(defaultWeek); // Weekinformatie bijwerken
  } catch (err) {
    alert("Fout bij ophalen van gegevens");
  }
}

async function fetchWeekData(week) {
  try {
    const response = await fetch(`get_roosters.php?week=${week}`);
    const data = await response.json();
    roosters = data;
    populateTable(week);
    updateWeekInfo(week); // Weekinformatie bijwerken
  } catch (err) {
    alert("Fout bij ophalen van weekgegevens");
  }
}

function populateWeekSelect() {
  const weeks = [...new Set(roosters.map((r) => r.startKalenderWeek))];
  const select = document.getElementById("week-select");

  select.innerHTML = weeks.map((week) => `<option value="${week}">Week ${week}</option>`).join("");
  select.addEventListener("change", (e) => {
    const selectedWeek = parseInt(e.target.value);
    fetchWeekData(selectedWeek);
    lastSelectedWeek = selectedWeek;
  });
}

function populateTable(week) {
  const tbody = document.getElementById("rooster-body");
  tbody.innerHTML = "";

  roosters
    .filter((r) => Number(r.startKalenderWeek) === week)
    .forEach((r) => {
      const key = `${r.startKalenderWeek}-${r.dagVanDeWeek}`;
      comments[key] = r.opmerkingen || "";

      tbody.innerHTML += `
        <tr>
          <td>${["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"][r.dagVanDeWeek - 1]}</td>
          <td><input type="text" value="${comments[key]}" data-key="${key}" ${!isEditable ? "disabled" : ""}></td>
          <td>${r.dienst}</td>
        </tr>
      `;
    });

  document.querySelectorAll("input[data-key]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      comments[key] = e.target.value.slice(0, 12);
    });
  });
}

async function saveComments() {
  const saveButton = document.getElementById("save-button");
  saveButton.textContent = "Opslaan...";
  try {
    const input = Object.entries(comments).map(([key, opmerkingen]) => {
      const [startKalenderWeek, dagVanDeWeek] = key.split("-");
      const rooster = roosters.find(
        (r) => r.startKalenderWeek == startKalenderWeek && r.dagVanDeWeek == dagVanDeWeek
      );

      return { ...rooster, opmerkingen };
    });

    const response = await fetch("save_comments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json();
    if (result.success) {
      saveButton.textContent = "Opgeslagen!";
      const feedback = document.getElementById("feedback");
      feedback.style.display = "block";

      setTimeout(() => {
        saveButton.textContent = "Opslaan";
        feedback.style.display = "none";
      }, 2000);
    } else {
      saveButton.textContent = "Opslaan";
    }
  } catch (err) {
    saveButton.textContent = "Opslaan";
  }
}

function updateEditableState() {
  document.querySelectorAll("input[data-key]").forEach((input) => {
    input.disabled = !isEditable;
  });
  document.getElementById("save-button").disabled = !isEditable;
}

function updateWeekInfo(week) {
  // Huidig jaar ophalen
  const year = new Date().getFullYear();

  // Eerste dag van de week berekenen (maandag)
  const startOfWeek = dayjs().year(year).isoWeek(week).startOf('isoWeek');

  // Laatste dag van de week berekenen (zondag)
  const endOfWeek = dayjs().year(year).isoWeek(week).endOf('isoWeek');

  // Update de weekinformatie
  const weekHeader = document.getElementById("current-week");
  const weekDates = document.getElementById("week-dates");

  weekHeader.textContent = `Kalenderweek: ${week}`;
  weekDates.textContent = `${startOfWeek.format("DD MMMM YYYY")} tot en met ${endOfWeek.format("DD MMMM YYYY")}`;
}
