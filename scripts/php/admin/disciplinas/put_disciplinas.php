<?php
include('../../config/dbConnection.php');
header('Content-Type: application/json');

// Verifica se o método é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

// Obtém os dados enviados via POST
$id        = isset($_POST['id'])        ? trim($_POST['id'])        : '';
$nome      = isset($_POST['nome'])      ? trim($_POST['nome'])      : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$link      = isset($_POST['link'])      ? trim($_POST['link'])      : null; // Campo opcional

$errors = [];

// Validações dos campos obrigatórios
if (empty($id)) {
    $errors[] = 'O ID da disciplina é obrigatório.';
}
if (empty($nome)) {
    $errors[] = 'O nome da disciplina é obrigatório.';
}
if (empty($descricao)) {
    $errors[] = 'A descrição é obrigatória.';
}

// Validação opcional para o campo link (se fornecido)
if (!empty($link) && !filter_var($link, FILTER_VALIDATE_URL)) {
    $errors[] = 'O link deve ser uma URL válida.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors'  => $errors
    ]);
    exit;
}

// Verifica a conexão com o banco de dados
if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    // Prepara a query para atualizar os dados da disciplina
    $stmt = $conexao_db->prepare("UPDATE disciplina SET nome = ?, descricao = ?, link = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    // Bind dos parâmetros: "s" para string, "i" para inteiro
    $stmt->bind_param("sssi", $nome, $descricao, $link, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao atualizar dados: " . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Nenhuma disciplina foi atualizada. Verifique se o ID está correto.']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Disciplina atualizada com sucesso!',
        'data'    => [
            'id'        => $id,
            'nome'      => $nome,
            'descricao' => $descricao,
            'link'      => $link
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao atualizar disciplina: " . $e->getMessage()]);
    exit;
}
?>