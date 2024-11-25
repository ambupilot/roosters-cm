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
    updateWeekInfo(defaultWeek);
  } catch (err) {
    console.error("Fout bij ophalen van gegevens:", err);
    showFeedback("Fout bij ophalen van gegevens", "error");
  }
}

async function fetchWeekData(week) {
  try {
    const response = await fetch(`get_roosters.php?week=${week}`);
    const data = await response.json();
    roosters = data;
    populateTable(week);
    updateWeekInfo(week);
  } catch (err) {
    console.error("Fout bij ophalen van weekgegevens:", err);
    showFeedback("Fout bij ophalen van weekgegevens", "error");
  }
}

function updateWeekInfo(week) {
  const year = new Date().getFullYear();
  const startOfWeek = dayjs().year(year).isoWeek(week).startOf("isoWeek");
  const endOfWeek = dayjs().year(year).isoWeek(week).endOf("isoWeek");

  document.getElementById("current-week").textContent = `Kalenderweek: ${week}`;
  document.getElementById("week-dates").textContent = `${startOfWeek.format("DD MMMM YYYY")} tot en met ${endOfWeek.format("DD MMMM YYYY")}`;
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
          <td class="p-2 text-gray-700">${["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"][r.dagVanDeWeek - 1]}</td>
          <td class="p-2">
            <input type="text" value="${comments[key]}" data-key="${key}" ${!isEditable ? "disabled" : ""} class="w-full p-2 border border-gray-300 rounded-lg">
          </td>
          <td class="p-2 text-gray-700">${r.dienst}</td>
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
  saveButton.disabled = true;

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
      showFeedback("Opmerkingen succesvol opgeslagen!", "success");
    } else {
      showFeedback("Opslaan mislukt!", "error");
    }
  } catch (err) {
    console.error("Fout bij opslaan van opmerkingen:", err);
    showFeedback("Fout bij opslaan van opmerkingen", "error");
  } finally {
    saveButton.textContent = "Opslaan";
    saveButton.disabled = false;
  }
}

function updateEditableState() {
  document.querySelectorAll("input[data-key]").forEach((input) => {
    input.disabled = !isEditable;
  });
  document.getElementById("save-button").disabled = !isEditable;
}

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `mt-4 p-4 rounded-lg shadow ${type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`;
  feedback.style.display = "block";
  setTimeout(() => (feedback.style.display = "none"), 3000);
}
