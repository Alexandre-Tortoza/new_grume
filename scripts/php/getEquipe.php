<?php
require('./config/dbConnection.php');
require('./config/defaultObject.php');

$query = mysqli_query($conexao_db, "SELECT * FROM teammember;");

if (!$query) {
    $response = [
        "httpStatus" => 500,
        "sucesso" => false,
        "mensagem" => "Erro na consulta: " . mysqli_error($conexao_db),
        "objeto" => null
    ];
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$resultado = array();
while ($registro = mysqli_fetch_assoc($query)) {
    $resultado[] = $registro;
}


// Retorna o JSON
echo json_encode(payload(200,true,$resultado), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

// Fecha a conexão
mysqli_close($conexao_db);
?>
