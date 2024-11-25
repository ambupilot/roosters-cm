<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rooster Beheer</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isoWeek.min.js"></script>
<script>
  dayjs.extend(dayjs_plugin_isoWeek);
</script>

</head>
<body>
  <div class="container">
    <h1>Rooster Beheer</h1>
    <div id="feedback" class="feedback">Opmerkingen succesvol opgeslagen!</div>
    <div id="week-info">
  <h2 id="current-week">Kalenderweek: </h2>
  <p id="week-dates"></p>
</div>
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
  </div>
  <script src="app.js"></script>
</body>
</html>
