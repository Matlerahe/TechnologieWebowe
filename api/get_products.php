<?php
require_once '../db/db.php';

$stmt = $pdo->query("SELECT id, name, price, image_url FROM products");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($products as &$product) {
    $product['image_url'] = '../uploads/' . $product['image_url'];
}

echo json_encode($products);
?>