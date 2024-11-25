<?php
$host = '127.0.0.1'; // Lokaal draaien
$db = 'Kerssing_roosters'; // Jouw database naam
$user = 'Martijn'; // Standaard MySQL-gebruiker
$pass = 'Kerssing'; // Standaard wachtwoord in MAMP PRO
$port = 8889; // Poort voor MySQL in MAMP PRO

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Kan geen verbinding maken met de database: " . $e->getMessage());
}
?>
