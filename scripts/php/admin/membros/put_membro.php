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
$id         = isset($_POST['id']) ? trim($_POST['id']) : '';
$nome       = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$curriculo  = isset($_POST['curriculo']) ? trim($_POST['curriculo']) : '';
$descricao  = isset($_POST['descricao']) ? trim($_POST['descricao']) : '';
$email      = isset($_POST['email']) ? trim($_POST['email']) : '';
$dataInicio = isset($_POST['dataInicio']) ? trim($_POST['dataInicio']) : '';
$dataFim    = isset($_POST['dataFim']) ? trim($_POST['dataFim']) : '';
// Campo oculto com a imagem atual, caso nenhuma nova seja enviada
$imagemAtual = isset($_POST['imagem_atual']) ? trim($_POST['imagem_atual']) : '';

$errors = [];

// Validações dos campos
if (empty($id)) {
    $errors[] = 'ID do membro é obrigatório.';
}
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

// Diretório de upload e valor padrão para a imagem (imagem atual)
$uploadDir = '../../../assets/membros';
$fotoPath = $imagemAtual;

// Processa o upload de uma nova foto, se fornecida
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
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

// Verifica a conexão com o banco de dados
if (!$conexao_db) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao conectar ao banco de dados: " . mysqli_connect_error()]);
    exit;
}

try {
    // Prepara a query para atualizar os dados do membro
    $stmt = $conexao_db->prepare("UPDATE equipe SET nome = ?, descricao = ?, curriculo = ?, email = ?, data_inicio = ?, data_fim = ?, imagem = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Erro na preparação da query: " . $conexao_db->error);
    }
    
    $stmt->bind_param("sssssssi", $nome, $descricao, $curriculo, $email, $dataInicio, $dataFim, $fotoPath, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao atualizar dados: " . $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Nenhum membro foi atualizado. Verifique se o ID está correto.']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Membro atualizado com sucesso!',
        'data'    => [
            'id'         => $id,
            'nome'       => $nome,
            'descricao'  => $descricao,
            'curriculo'  => $curriculo,
            'email'      => $email,
            'data_inicio'=> $dataInicio,
            'data_fim'   => $dataFim,
            'imagem'     => $fotoPath
        ]
    ]);
    
    $stmt->close();
    $conexao_db->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro ao atualizar membro: " . $e->getMessage()]);
    exit;
}
