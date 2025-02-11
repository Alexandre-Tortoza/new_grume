<?php
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

if (empty($nome)) {
    $errors[] = 'O nome é obrigatório.';
}

if (empty($email)) {
    $errors[] = 'O email é obrigatório.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email inválido.';
}

$fotoPath = null;
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../../../assets/membros';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $fotoName     = basename($_FILES['foto']['name']);
    $fotoFileName = uniqid() . '-' . $fotoName;
    $targetFile   = $uploadDir . $fotoFileName;

    if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
        $fotoPath = $targetFile;
    } else {
        $errors[] = 'Falha ao fazer o upload da foto.';
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


echo json_encode([
    'success' => true,
    'message' => 'Dados recebidos com sucesso!',
    'data'    => [
        'nome'       => $nome,
        'curriculo'  => $curriculo,
        'descricao'  => $descricao,
        'email'      => $email,
        'dataInicio' => $dataInicio,
        'dataFim'    => $dataFim,
        'foto'       => $fotoPath
    ]
]);
