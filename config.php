<?php
$host = '109.71.54.25';
$db = 'Kerssing_roosters';
$user = 'Kerssing_app';
$pass = '84-HzxY0sxB%';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Kan geen verbinding maken met de database: " . $e->getMessage());
}
?>
