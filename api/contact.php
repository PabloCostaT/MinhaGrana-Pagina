<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

// Validate required fields
$required_fields = ['nome', 'email', 'telefone'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Campo obrigatório: $field"]);
        exit();
    }
}

// Sanitize input
$nome = filter_var($input['nome'], FILTER_SANITIZE_STRING);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$telefone = filter_var($input['telefone'], FILTER_SANITIZE_STRING);
$tipo = isset($input['tipo']) ? filter_var($input['tipo'], FILTER_SANITIZE_STRING) : 'contato';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email inválido']);
    exit();
}

// Additional fields for affiliates
$origem = isset($input['origem']) ? filter_var($input['origem'], FILTER_SANITIZE_STRING) : '';
$area = isset($input['area']) ? filter_var($input['area'], FILTER_SANITIZE_STRING) : '';
$seguidores = isset($input['seguidores']) ? filter_var($input['seguidores'], FILTER_SANITIZE_STRING) : '';
$plataformas = isset($input['plataformas']) ? $input['plataformas'] : [];
$sobre = isset($input['sobre']) ? filter_var($input['sobre'], FILTER_SANITIZE_STRING) : '';

// Create data array
$data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'nome' => $nome,
    'email' => $email,
    'telefone' => $telefone,
    'tipo' => $tipo,
    'origem' => $origem,
    'area' => $area,
    'seguidores' => $seguidores,
    'plataformas' => is_array($plataformas) ? implode(', ', $plataformas) : $plataformas,
    'sobre' => $sobre,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Save to CSV file
$csv_file = '../leads.csv';
$csv_header = [
    'timestamp', 'nome', 'email', 'telefone', 'tipo', 'origem', 'area', 
    'seguidores', 'plataformas', 'sobre', 'ip', 'user_agent'
];

// Create CSV if it doesn't exist
if (!file_exists($csv_file)) {
    $fp = fopen($csv_file, 'w');
    fputcsv($fp, $csv_header);
    fclose($fp);
}

// Append data to CSV
$fp = fopen($csv_file, 'a');
fputcsv($fp, [
    $data['timestamp'],
    $data['nome'],
    $data['email'],
    $data['telefone'],
    $data['tipo'],
    $data['origem'],
    $data['area'],
    $data['seguidores'],
    $data['plataformas'],
    $data['sobre'],
    $data['ip'],
    $data['user_agent']
]);
fclose($fp);

// Send email notification (optional)
$to = 'contato@minhagrana.com'; // Change to your email
$subject = $tipo === 'afiliado' ? 'Nova solicitação de afiliado - MinhaGrana' : 'Novo lead - MinhaGrana';
$message = "Novo lead recebido:\n\n";
$message .= "Nome: $nome\n";
$message .= "Email: $email\n";
$message .= "Telefone: $telefone\n";
$message .= "Tipo: $tipo\n";

if ($tipo === 'afiliado') {
    $message .= "Origem: $origem\n";
    $message .= "Área: $area\n";
    $message .= "Seguidores: $seguidores\n";
    $message .= "Plataformas: " . $data['plataformas'] . "\n";
    $message .= "Sobre: $sobre\n";
}

$message .= "\nData: " . $data['timestamp'] . "\n";
$message .= "IP: " . $data['ip'] . "\n";

$headers = "From: noreply@minhagrana.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Uncomment to send email
// mail($to, $subject, $message, $headers);

// Log the submission
error_log("MinhaGrana Lead: $nome ($email) - $tipo");

// Return success response
echo json_encode([
    'success' => true,
    'message' => $tipo === 'afiliado' 
        ? 'Obrigado! Recebemos sua solicitação de afiliado. Entraremos em contato em até 24 horas.'
        : 'Obrigado pelo seu interesse! Entraremos em contato em breve com mais informações sobre o MinhaGrana.'
]);

// Optional: Send to external service (Zapier, Make, etc.)
$webhook_url = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/'; // Replace with your webhook
$webhook_data = [
    'nome' => $nome,
    'email' => $email,
    'telefone' => $telefone,
    'tipo' => $tipo,
    'origem' => $origem,
    'area' => $area,
    'seguidores' => $seguidores,
    'plataformas' => $data['plataformas'],
    'sobre' => $sobre,
    'timestamp' => $data['timestamp']
];

// Uncomment to send to webhook
/*
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $webhook_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($webhook_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_exec($ch);
curl_close($ch);
*/
?>
