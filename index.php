<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rooster Beheer</title>
  <!-- TailwindCSS -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Rooster Beheer</h1>

    <!-- Week Informatie -->
    <div id="week-info" class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 id="current-week" class="text-xl font-semibold">Kalenderweek:</h2>
      <p id="week-dates" class="text-gray-600"></p>
    </div>

    <!-- Week Select -->
    <div class="mb-4">
      <label for="week-select" class="block text-lg font-medium text-gray-700 mb-2">Kalenderweek:</label>
      <select id="week-select" class="block w-full p-2 border border-gray-300 rounded-lg shadow-sm">
      </select>
    </div>

    <!-- Rooster Tabel -->
    <div class="overflow-auto mb-6">
      <table class="table-auto w-full bg-white rounded-lg shadow-md">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-2 text-left text-gray-700">Dag</th>
            <th class="p-2 text-left text-gray-700">Datum</th>
            <th class="p-2 text-left text-gray-700">Dienst Carola</th>
            <th class="p-2 text-left text-gray-700">Aangevraagd</th>
          </tr>
        </thead>
        <tbody id="rooster-body" class="divide-y divide-gray-200">
        </tbody>
      </table>
    </div>

    <!-- Opslaan Knop en Bewerken Toggle -->
    <div class="flex justify-between items-center mt-4">
      <button id="save-button" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 disabled:bg-gray-300" disabled>
        Opslaan
      </button>
      <div>
        <label for="edit-toggle" class="text-gray-700 font-medium">Bewerken toestaan:</label>
        <select id="edit-toggle" class="ml-2 p-2 border border-gray-300 rounded-lg shadow-sm">
          <option value="uit">Uit</option>
          <option value="aan">Aan</option>
        </select>
      </div>
    </div>

    <!-- Feedback -->
    <div id="feedback" class="hidden mt-4 p-4 bg-green-100 text-green-700 rounded-lg shadow">
      Opmerkingen succesvol opgeslagen!
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isoWeek.min.js"></script>
  <script>
    dayjs.extend(dayjs_plugin_isoWeek);
  </script>
  <script src="app.js"></script>
</body>
</html>
