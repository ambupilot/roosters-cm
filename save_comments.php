<?php
require 'config.php';

// Log de ontvangen data
file_put_contents("save_comments_debug.log", print_r($_POST, true), FILE_APPEND);

$data = json_decode(file_get_contents("php://input"), true);

// Log de JSON-decoding voor debugging
file_put_contents("save_comments_debug.log", print_r($data, true), FILE_APPEND);

// Controleer of de invoer geldig is
if (!is_array($data) || empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ongeldige invoer']);
    exit;
}

try {
    foreach ($data as $comment) {
        $stmt = $pdo->prepare(
            "INSERT INTO RoosterCarolas (dagVanDeWeek, startKalenderWeek, roosterWeek, dienst, opmerkingen, locoflex)
             VALUES (:dagVanDeWeek, :startKalenderWeek, :roosterWeek, :dienst, :opmerkingen, :locoflex)
             ON DUPLICATE KEY UPDATE opmerkingen = :opmerkingen, locoflex = :locoflex"
        );

        $stmt->execute([
            ':dagVanDeWeek' => $comment['dagVanDeWeek'],
            ':startKalenderWeek' => $comment['startKalenderWeek'],
            ':roosterWeek' => $comment['roosterWeek'],
            ':dienst' => $comment['dienst'],
            ':opmerkingen' => $comment['opmerkingen'] ?? "",
            ':locoflex' => $comment['locoflex'] ?? "",
        ]);
    }

    // Log een succesvolle invoer
    file_put_contents("save_comments_debug.log", "Data succesvol opgeslagen\n", FILE_APPEND);

    // Retourneer een succesvolle respons
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Log de foutmelding
    file_put_contents("save_comments_debug.log", "Fout: " . $e->getMessage() . PHP_EOL, FILE_APPEND);

    // Retourneer een foutmelding bij een uitzondering
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Fout bij opslaan: ' . $e->getMessage()]);
}
?>
