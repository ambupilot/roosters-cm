<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

// Controleer of de invoer geldig is
if (!is_array($data) || empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ongeldige invoer']);
    exit;
}

try {
    foreach ($data as $comment) {
        // Bereid de SQL-statement voor om gegevens op te slaan of bij te werken
        $stmt = $pdo->prepare(
            "INSERT INTO RoosterCarolas (dagVanDeWeek, startKalenderWeek, roosterWeek, dienst, opmerkingen, locoflex)
             VALUES (:dagVanDeWeek, :startKalenderWeek, :roosterWeek, :dienst, :opmerkingen, :locoflex)
             ON DUPLICATE KEY UPDATE opmerkingen = :opmerkingen, locoflex = :locoflex"
        );

        // Voer de statement uit met de data
        $stmt->execute([
            ':dagVanDeWeek' => $comment['dagVanDeWeek'],
            ':startKalenderWeek' => $comment['startKalenderWeek'],
            ':roosterWeek' => $comment['roosterWeek'],
            ':dienst' => $comment['dienst'],
            ':opmerkingen' => $comment['opmerkingen'] ?? "",
            ':locoflex' => $comment['locoflex'] ?? "",
        ]);
    }

    // Retourneer een succesvolle respons
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Log fouten en retourneer een foutmelding
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Fout bij opslaan: ' . $e->getMessage()]);
}
?>
