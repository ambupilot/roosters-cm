<?php
require 'config.php';

try {
    echo "Verbinding succesvol!";
} catch (Exception $e) {
    echo "Fout: " . $e->getMessage();
}
?>

