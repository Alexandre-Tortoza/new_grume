<?php
include('../../config/dbConnection.php'); // Ajustado para subir dois níveis até config/
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
    echo json_encode(['error' => 'ID da orientação não fornecido.']);
    exit;
}

// Converte o ID de string para inteiro
$id = (int)$data['id'];

// Valida se o ID é um número válido maior que 0
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID da orientação deve ser um número inteiro positivo.']);
    exit;
}

// Verifica a conexão com o banco de dados
if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    // Prepara a query para deletar a orientação pelo ID
    $stmt = $conexao_db->prepare("DELETE FROM orientacoes WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }

    $stmt->bind_param("i", $id); // 'i' para inteiro

    if (!$stmt->execute()) {
        throw new Exception("Erro ao deletar orientação: " . $stmt->error);
    }

    // Verifica se alguma linha foi afetada (orientação encontrada e deletada)
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Orientação não encontrada ou já deletada.']);
        exit;
    }

    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Orientação deletada com sucesso!'
    ]);

    $stmt->close();
    $conexao_db->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao deletar orientação: " . $e->getMessage()]);
    exit;
}
?>