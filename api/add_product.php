<?php
require_once '../db/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $productName = $_POST['product-name'];
    $productPrice = $_POST['product-price'];
    $image = $_FILES['product-image'];

    $targetDir = "../uploads/";
    $targetFile = $targetDir . basename($image['name']);
    move_uploaded_file($image['tmp_name'], $targetFile);

    $stmt = $pdo->prepare("INSERT INTO products (name, price, image_url) VALUES (?, ?, ?)");
    $stmt->execute([$productName, $productPrice, basename($image['name'])]);

    echo "Produkt zostal dodany pomyslnie!";
}
?>
