let roosters = [];
let comments = {};
let isEditable = false;

document.addEventListener("DOMContentLoaded", () => {
  fetchRoosters();

  document.getElementById("edit-toggle").addEventListener("change", (e) => {
    isEditable = e.target.value === "aan";
    updateEditableState();
  });

  document.getElementById("save-button").addEventListener("click", saveComments);
});

async function fetchRoosters() {
  try {
    const response = await fetch("get_roosters.php");
    roosters = await response.json();

    populateWeekSelect();
    populateTable(51);
  } catch (err) {
    alert("Fout bij ophalen van gegevens");
  }
}

function populateWeekSelect() {
  const weeks = [...new Set(roosters.map((r) => r.startKalenderWeek))];
  const select = document.getElementById("week-select");

  select.innerHTML = weeks.map((week) => `<option value="${week}">Week ${week}</option>`).join("");
  select.addEventListener("change", (e) => populateTable(parseInt(e.target.value)));
}

function populateTable(week) {
  const tbody = document.getElementById("rooster-body");
  tbody.innerHTML = "";

  roosters
    .filter((r) => r.startKalenderWeek === week)
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
      comments[key] = e.target.value.slice(0, 12); // Max 12 tekens
    });
  });
}

async function saveComments() {
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
    if (result.success) alert("Opmerkingen succesvol opgeslagen!");
    else alert("Opslaan mislukt");
  } catch (err) {
    alert("Fout bij opslaan van opmerkingen");
  }
}

function updateEditableState() {
  document.querySelectorAll("input[data-key]").forEach((input) => {
    input.disabled = !isEditable;
  });
  document.getElementById("save-button").disabled = !isEditable;
}
