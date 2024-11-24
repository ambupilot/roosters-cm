<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rooster Beheer</title>
  <style>
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f4f4f4; text-align: left; }
    input[disabled] { background-color: #f9f9f9; color: #999; }
  </style>
</head>
<body>
  <h1>Rooster Beheer</h1>
  <label for="week-select">Kalenderweek:</label>
  <select id="week-select"></select>
  <table>
    <thead>
      <tr>
        <th>Dag</th>
        <th>Opmerkingen</th>
        <th>Dienst</th>
      </tr>
    </thead>
    <tbody id="rooster-body"></tbody>
  </table>
  <button id="save-button" disabled>Opslaan</button>
  <br><br>
  <label>
    Bewerken toestaan:
    <select id="edit-toggle">
      <option value="uit">Uit</option>
      <option value="aan">Aan</option>
    </select>
  </label>
  <script src="app.js"></script>
</body>
</html>
