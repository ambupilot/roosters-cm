<?php
require 'config.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM RoosterCarolas");
    $stmt->execute();
    $roosters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($roosters);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Fout bij ophalen van gegevens: ' . $e->getMessage()]);
}
?>
