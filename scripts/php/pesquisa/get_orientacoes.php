<?php
include('../config/dbConnection.php');

if (!$conexao_db) {
    die("Erro ao conectar ao banco de dados: " . mysqli_connect_error());
}

try {
    $query = "SELECT * FROM orientacoes";
    $result = mysqli_query($conexao_db, $query);

    if ($result) {
        $orientacoes = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $orientacoes[] = $row;
        }

        header('Content-Type: application/json');
        echo json_encode($orientacoes);
    } else {
        echo json_encode(["erro" => "Nenhum dado encontrado."]);
    }

    mysqli_close($conexao_db);

} catch (Exception $e) {
    echo json_encode(["erro" => "Erro ao buscar dados: " . $e->getMessage()]);
}
