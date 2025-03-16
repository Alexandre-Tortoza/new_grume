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
$id         = isset($_POST['id'])         ? trim($_POST['id'])         : '';
$tipo       = isset($_POST['tipo'])       ? trim($_POST['tipo'])       : '';
$autor      = isset($_POST['autor'])      ? trim($_POST['autor'])      : '';
$ano        = isset($_POST['ano'])        ? trim($_POST['ano'])        : '';
$descricao  = isset($_POST['descricao'])  ? trim($_POST['descricao'])  : '';
// Campo oculto com o caminho do arquivo atual, caso nenhum novo seja enviado
$downloadAtual = isset($_POST['download_atual']) ? trim($_POST['download_atual']) : '';

$errors = [];

// Validações dos campos obrigatórios
if ($id === '') {
    $errors[] = 'O ID da orientação é obrigatório.';
}
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

$uploadDir = '../../../../assets/membros';
$downloadPath = $downloadAtual; // Mantém o caminho atual por padrão

// Processa o upload de um novo arquivo, se fornecido
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

// Verifica a conexão com o banco de dados
if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    // Prepara a query para atualizar os dados da orientação
    $stmt = $conexao_db->prepare("UPDATE orientacoes SET tipo = ?, autor = ?, ano = ?, descricao = ?, download = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    $stmt->bind_param("ssissi", $tipo, $autor, $ano, $descricao, $downloadPath, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao atualizar dados: " . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Nenhuma orientação foi atualizada. Verifique se o ID está correto.']);
        exit;
    }
    
    // Se um novo arquivo foi enviado e a atualização foi bem-sucedida, remove o arquivo antigo (se existir)
    if ($downloadPath !== $downloadAtual && $downloadAtual && file_exists($downloadAtual)) {
        unlink($downloadAtual);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Orientação atualizada com sucesso!',
        'data'    => [
            'id'         => $id,
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
    // Se houve erro após upload de novo arquivo, remove o arquivo para evitar lixo
    if ($downloadPath !== $downloadAtual && $downloadPath && file_exists($downloadPath)) {
        unlink($downloadPath);
    }
    http_response_code(500);
    echo json_encode(["error" => "Erro ao atualizar orientação: " . $e->getMessage()]);
    exit;
}
?>