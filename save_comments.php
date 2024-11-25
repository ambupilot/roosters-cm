<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ongeldige invoer']);
    exit;
}

try {
    foreach ($data as $comment) {
        $stmt = $pdo->prepare(
            "INSERT INTO RoosterCarolas (dagVanDeWeek, startKalenderWeek, roosterWeek, dienst, opmerkingen)
             VALUES (:dagVanDeWeek, :startKalenderWeek, :roosterWeek, :dienst, :opmerkingen)
             ON DUPLICATE KEY UPDATE opmerkingen = :opmerkingen"
        );

        $stmt->execute([
            ':dagVanDeWeek' => $comment['dagVanDeWeek'],
            ':startKalenderWeek' => $comment['startKalenderWeek'],
            ':roosterWeek' => $comment['roosterWeek'],
            ':dienst' => $comment['dienst'],
            ':opmerkingen' => $comment['opmerkingen'] !== null ? $comment['opmerkingen'] : "",
        ]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Fout bij opslaan: ' . $e->getMessage()]);
}
?>
