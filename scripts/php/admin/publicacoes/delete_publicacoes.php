<?php
include('../config/dbConnection.php');
header('Content-Type: application/json');

// Verifica se o método de requisição é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

// Obtém os dados enviados no corpo da requisição (JSON)
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Valida se o campo 'id' foi informado
if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID da publicação não fornecido.']);
    exit;
}

$id = $data['id'];

// Verifica a conexão com o banco de dados
if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    // Prepara a query para deletar a publicação pelo ID
    $stmt = $conexao_db->prepare("DELETE FROM publicacoes WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception("Erro ao deletar publicação: " . $stmt->error);
    }

    // Verifica se alguma linha foi afetada (publicação encontrada e deletada)
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Publicação não encontrada ou já deletada.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Publicação deletada com sucesso!'
    ]);

    $stmt->close();
    $conexao_db->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao deletar publicação: " . $e->getMessage()]);
    exit;
}
?>