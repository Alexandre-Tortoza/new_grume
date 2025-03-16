<?php
include('../../config/dbConnection.php');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.']);
    exit;
}

$nome      = isset($_POST['nome'])      ? trim($_POST['nome'])      : '';
$curriculo = isset($_POST['curriculo']) ? trim($_POST['curriculo']) : '';
$descricao = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$email     = isset($_POST['email'])     ? trim($_POST['email'])     : '';
$dataInicio= isset($_POST['dataInicio'])? trim($_POST['dataInicio']): '';
$dataFim   = isset($_POST['dataFim'])   ? trim($_POST['dataFim'])   : '';

$errors = [];

// Validações dos campos de texto
if (empty($nome)) {
    $errors[] = 'O nome é obrigatório.';
}

if (empty($curriculo)) {
    $errors[] = 'O currículo é obrigatório.';
}

if (empty($descricao)) {
    $errors[] = 'A descrição é obrigatória.';
}

if (empty($email)) {
    $errors[] = 'O email é obrigatório.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email inválido.';
}

if (empty($dataInicio)) {
    $errors[] = 'A data de início é obrigatória.';
}

if (empty($dataFim)) {
    $errors[] = 'A data de fim é obrigatória.';
}


$fotoPath = null;
$uploadDir = '../../../../assets/membros';

// Validação para o campo foto (obrigatório)
if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    $errors[] = 'A foto é obrigatória.';
} else {
    $fotoName  = basename($_FILES['foto']['name']);
    $extension = strtolower(pathinfo($fotoName, PATHINFO_EXTENSION));
    
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array($extension, $allowedExtensions)) {
        $errors[] = 'Formato de arquivo não permitido.';
    } elseif ($_FILES['foto']['size'] > 2 * 1024 * 1024) { // Limite de 2MB
        $errors[] = 'O arquivo é muito grande.';
    } else {
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
            $errors[] = "Erro ao criar o diretório: $uploadDir";
        }
        $fotoFileName = uniqid() . '.' . $extension;
        $targetFile   = $uploadDir . '/' . $fotoFileName;
        
        if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
            $fotoPath = $targetFile;
        } else {
            $errors[] = 'Falha ao fazer o upload da foto.';
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
        Tabela "equipe" com os campos:
        "id" (auto-increment), "nome", "descricao", "curriculo", "email", "data_inicio", "data_fim", "imagem"
    */
    
    $stmt = $conexao_db->prepare("INSERT INTO equipe (nome, descricao, curriculo, email, data_inicio, data_fim, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    $stmt->bind_param("sssssss", $nome, $descricao, $curriculo, $email, $dataInicio, $dataFim, $fotoPath);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao inserir dados: " . $stmt->error);
    }
    
    $lastInsertId = $conexao_db->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Dados inseridos com sucesso!',
        'data'    => [
            'id'         => $lastInsertId,
            'nome'       => $nome,
            'descricao'  => $descricao,
            'curriculo'  => $curriculo,
            'email'      => $email,
            'dataInicio' => $dataInicio,
            'dataFim'    => $dataFim,
            'imagem'     => $fotoPath
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao inserir dados: " . $e->getMessage()]);
    exit;
}
