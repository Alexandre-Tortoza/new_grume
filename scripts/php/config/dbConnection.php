<?php
// db_connection.php

$localhost = 'localhost:3306'; 
$my_user = 'root'; 
$my_password = 'root'; 
$my_db = 'grume_db'; 

$conexao_db = mysqli_connect($localhost, $my_user, $my_password, $my_db);

if (!$conexao_db) {
    die("Erro na conexão com o banco de dados: " . mysqli_connect_error());
}