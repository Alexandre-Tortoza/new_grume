<?php
header('Content-Type: application/json');

// Simulação de usuários no sistema
$usuarios = [
    'admin@grume.com' => '20918248'
];

// Recebe os dados da requisição POST
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$senha = $input['password'] ?? '';

// Verifica se o usuário e a senha estão corretos
if (isset($usuarios[$email]) && $usuarios[$email] === $senha) {
    // Gera um token simples (em um sistema real, use um JWT)
    $tokenPayload = [
        'email' => $email,
        'exp' => time() + 3600 // Expira em 1 hora
    ];
    $token = base64_encode(json_encode($tokenPayload));

    echo json_encode([
        'success' => true,
        'token' => $token
    ]);
} else {
    // Retorna erro se o login falhar
    echo json_encode([
        'success' => false,
        'message' => 'E-mail ou senha inválidos.'
    ]);
}
?>
