<?php
include('../../config/dbConnection.php');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

// Captura e sanitiza os dados enviados via POST
$tipo      = isset($_POST['tipo'])      ? trim($_POST['tipo'])      : '';
$autor     = isset($_POST['autor'])     ? trim($_POST['autor'])     : '';
$ano       = isset($_POST['ano'])       ? trim($_POST['ano'])       : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';

$errors = [];

// Validações dos campos de texto
if ($tipo === '') {
    $errors[] = 'O tipo é obrigatório.';
}

if ($autor === '') {
    $errors[] = 'O autor é obrigatório.';
}

if ($ano === '') {
    $errors[] = 'O ano é obrigatório.';
} elseif (!is_numeric($ano) || $ano < 1900 || $ano > date('Y')) {
    $errors[] = 'O ano deve ser um número válido entre 1900 e ' . date('Y') . '.';
}

if ($descricao === '') {
    $errors[] = 'A descrição é obrigatória.';
}

$downloadPath = null;
$uploadDir = '../../../../assets/membros';

// Validação para o campo download (arquivo opcional)
if (isset($_FILES['download']) && $_FILES['download']['error'] === UPLOAD_ERR_OK) {
    $fileName  = basename($_FILES['download']['name']);
    $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    $allowedExtensions = ['pdf', 'doc', 'docx', 'txt']; // Ajuste conforme necessário
    if (!in_array($extension, $allowedExtensions)) {
        $errors[] = 'Formato de arquivo não permitido. Use PDF, DOC, DOCX ou TXT.';
    } elseif ($_FILES['download']['size'] > 5 * 1024 * 1024) { // Limite de 5MB
        $errors[] = 'O arquivo é muito grande (máximo 5MB).';
    } else {
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
            $errors[] = "Erro ao criar o diretório: $uploadDir";
        }
        $fileUniqueName = uniqid() . '.' . $extension;
        $targetFile = $uploadDir . '/' . $fileUniqueName;
        
        if (move_uploaded_file($_FILES['download']['tmp_name'], $targetFile)) {
            $downloadPath = $targetFile;
        } else {
            $errors[] = 'Falha ao fazer o upload do arquivo.';
        }
    }
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
        Tabela "orientacoes" com os campos:
        "id" (auto-increment), "tipo", "autor", "ano", "descricao", "download"
    */
    
    $stmt = $conexao_db->prepare("INSERT INTO orientacoes (tipo, autor, ano, descricao, download) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    $stmt->bind_param("ssiss", $tipo, $autor, $ano, $descricao, $downloadPath);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir dados: " . $stmt->error);
    }
    
    $lastInsertId = $conexao_db->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Orientação inserida com sucesso!',
        'data'    => [
            'id'         => $lastInsertId,
            'tipo'       => $tipo,
            'autor'      => $autor,
            'ano'        => $ano,
            'descricao'  => $descricao,
            'download'   => $downloadPath
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    // Se houve erro após upload, tenta remover o arquivo para evitar lixo
    if ($downloadPath && file_exists($downloadPath)) {
        unlink($downloadPath);
    }
    http_response_code(500);
    echo json_encode(["error" => "Erro ao inserir dados: " . $e->getMessage()]);
    exit;
}
?>