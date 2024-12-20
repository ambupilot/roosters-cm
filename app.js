let roosters = [];
let comments = {};
let locoflexComments = {};
let isEditable = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchAllWeeks();

  // Bewerken toestaan
  document.getElementById("edit-toggle").addEventListener("change", (e) => {
    isEditable = e.target.value === "aan";
    updateEditableState();
  });

  // Opslaan gegevens
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
  });
}

function populateTable(week) {
  const tbody = document.getElementById("rooster-body");
  tbody.innerHTML = "";

  roosters
    .filter((r) => Number(r.startKalenderWeek) === week)
    .forEach((r) => {
      const key = `${r.startKalenderWeek}-${r.dagVanDeWeek}`;
      comments[key] = comments[key] !== undefined ? comments[key] : r.opmerkingen || "";
      locoflexComments[key] = locoflexComments[key] !== undefined ? locoflexComments[key] : r.locoflex || "";

      const year = new Date().getFullYear();
      const currentDate = dayjs().year(year).isoWeek(week).startOf("isoWeek").add(r.dagVanDeWeek - 1, "day");

      tbody.innerHTML += `
        <tr>
          <td class="p-2 text-gray-700">${["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"][r.dagVanDeWeek - 1]}</td>
          <td class="p-2 text-gray-700">${currentDate.format("DD MMMM YYYY")}</td>
          <td class="p-2 text-gray-700">${r.dienst}</td>
          <td class="p-2">
            <input type="text" value="${comments[key]}" data-key="${key}" ${!isEditable ? "disabled" : ""} class="w-full p-2 border border-gray-300 rounded-lg">
          </td>
          <td class="p-2">
            <input type="text" value="${locoflexComments[key]}" data-locoflex-key="${key}" ${!isEditable ? "disabled" : ""} class="w-full p-2 border border-gray-300 rounded-lg">
          </td>
        </tr>
      `;
    });

  document.querySelectorAll("input[data-key]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const key = e.target.dataset.key;
      comments[key] = e.target.value;
    });
  });

  document.querySelectorAll("input[data-locoflex-key]").forEach((input) => {
    input.addEventListener("input", (e) => {
      const key = e.target.dataset.locoflexKey;
      locoflexComments[key] = e.target.value;
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

      return {
        ...rooster,
        opmerkingen: opmerkingen || "",
        locoflex: locoflexComments[key] || "",
      };
    });

    const response = await fetch("save_comments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const result = await response.json();
    if (result.success) {
      showFeedback("Gegevens succesvol opgeslagen!", "success");
    } else {
      showFeedback("Opslaan mislukt!", "error");
    }
  } catch (err) {
    console.error("Fout bij opslaan van gegevens:", err);
    showFeedback("Fout bij opslaan van gegevens", "error");
  } finally {
    saveButton.textContent = "Opslaan";
    saveButton.disabled = false;
  }
}

function updateEditableState() {
  document.querySelectorAll("input").forEach((input) => {
    input.disabled = !isEditable;
  });
  document.getElementById("save-button").disabled = !isEditable;
}

function showFeedback(message, type) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `mt-4 p-4 rounded-lg shadow ${
    type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }`;

  feedback.style.display = "block";
  setTimeout(() => {
    feedback.style.display = "none";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllWeeks();

  // Bewerken toestaan
  document.getElementById("edit-toggle").addEventListener("change", (e) => {
    isEditable = e.target.value === "aan";
    updateEditableState();
  });

  // Opslaan gegevens
  document.getElementById("save-button").addEventListener("click", saveComments);

  // Overzicht genereren
  document.getElementById("generate-overview-button").addEventListener("click", generateOverview);
});

function generateOverview() {
  const selectedWeek = document.getElementById("week-select").value;

  // Haal de data op uit de opgeslagen waarden
  const overviewData = roosters
    .filter((r) => Number(r.startKalenderWeek) === Number(selectedWeek))
    .map((r) => {
      const day = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"][r.dagVanDeWeek - 1];
      const year = new Date().getFullYear();
      const date = dayjs().year(year).isoWeek(selectedWeek).startOf("isoWeek").add(r.dagVanDeWeek - 1, "day").format("DD-MM-YYYY");
      const availability = locoflexComments[`${r.startKalenderWeek}-${r.dagVanDeWeek}`] || r.locoflex || "";
      return { day, date, availability };
    });

  // Genereer ASCII-stijl tabel
  const header = "| Dag       | Datum       | Beschikbaarheid  |";
  const divider = "+-----------+-------------+------------------+";
  const rows = overviewData.map(({ day, date, availability }) =>
    `| ${day.padEnd(9)} | ${date.padEnd(11)} | ${availability.padEnd(16)} |`
  );

  const content = [divider, header, divider, ...rows, divider].join("\n");

  // Download het bestand
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Overzicht_Week_${selectedWeek}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
