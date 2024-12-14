<?php
function payload($_status,$_sucesso,$_data){

  $response = [
    "httpStatus" => $_status,
    "sucesso" => $_sucesso,
    "objeto" => $_data
  ];

  return $response;

}