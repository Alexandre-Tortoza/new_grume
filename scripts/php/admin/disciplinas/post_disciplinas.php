<?php
include('../../config/dbConnection.php');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

// Captura e sanitiza os dados enviados via POST
$nome      = isset($_POST['nome'])      ? trim($_POST['nome'])      : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$link      = isset($_POST['link'])      ? trim($_POST['link'])      : null; // Campo opcional

$errors = [];

// Validações dos campos obrigatórios
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

if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    /*
        Tabela "disciplina" com os campos:
        "id" (auto-increment), "nome", "descricao", "link"
    */
    
    $stmt = $conexao_db->prepare("INSERT INTO disciplina (nome, descricao, link) VALUES (?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    // Bind dos parâmetros: "s" para string
    $stmt->bind_param("sss", $nome, $descricao, $link);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir dados: " . $stmt->error);
    }
    
    $lastInsertId = $conexao_db->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Disciplina inserida com sucesso!',
        'data'    => [
            'id'         => $lastInsertId,
            'nome'       => $nome,
            'descricao'  => $descricao,
            'link'       => $link
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao inserir dados: " . $e->getMessage()]);
    exit;
}
?>