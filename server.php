<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['username'])) {
  http_response_code(400);
  echo "Invalid data";
  exit;
}

$usersFile = 'users.json';
$users = json_decode(file_get_contents($usersFile), true);

if (in_array($data['username'], $users)) {
  echo "Username already taken";
  exit;
}

$users[] = $data['username'];
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
echo "success";
?>
