<?php
include('../config/dbConnection.php');
header('Content-Type: application/json');

// Verifica se o método é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

// Obtém os dados enviados via POST
$id        = isset($_POST['id'])        ? trim($_POST['id'])        : '';
$tipo      = isset($_POST['tipo'])      ? trim($_POST['tipo'])      : '';
$autor     = isset($_POST['autor'])     ? trim($_POST['autor'])     : '';
$ano       = isset($_POST['ano'])       ? trim($_POST['ano'])       : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$download  = isset($_POST['download'])  ? trim($_POST['download'])  : null; // Campo opcional

$errors = [];

// Validações dos campos obrigatórios
if (empty($id)) {
    $errors[] = 'O ID da publicação é obrigatório.';
}
if (empty($tipo)) {
    $errors[] = 'O tipo é obrigatório.';
}
if (empty($autor)) {
    $errors[] = 'O autor é obrigatório.';
}
if (empty($ano)) {
    $errors[] = 'O ano é obrigatório.';
} elseif (!is_numeric($ano) || $ano < 1900 || $ano > date('Y')) {
    $errors[] = 'O ano deve ser um número válido entre 1900 e ' . date('Y') . '.';
}
if (empty($descricao)) {
    $errors[] = 'A descrição é obrigatória.';
}

// Validação opcional para o campo download (se fornecido)
if (!empty($download) && !filter_var($download, FILTER_VALIDATE_URL)) {
    $errors[] = 'O link de download deve ser uma URL válida.';
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
    // Prepara a query para atualizar os dados da publicação
    $stmt = $conexao_db->prepare("UPDATE publicacoes SET tipo = ?, autor = ?, ano = ?, descricao = ?, download = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    // Bind dos parâmetros: "s" para string, "i" para inteiro
    $stmt->bind_param("ssissi", $tipo, $autor, $ano, $descricao, $download, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao atualizar dados: " . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Nenhuma publicação foi atualizada. Verifique se o ID está correto.']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Publicação atualizada com sucesso!',
        'data'    => [
            'id'        => $id,
            'tipo'      => $tipo,
            'autor'     => $autor,
            'ano'       => $ano,
            'descricao' => $descricao,
            'download'  => $download
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao atualizar publicação: " . $e->getMessage()]);
    exit;
}
?>