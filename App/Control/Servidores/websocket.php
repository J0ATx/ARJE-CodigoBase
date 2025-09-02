<?php
// Simple WebSocket server for chat between user1 and user2
set_time_limit(0);
$address = '0.0.0.0';
$port = 8080;
$clients = [];
// Store clients as ['conn' => resource, 'type' => 'chat'|'notifs'|'jsondataA'|'jsondataB']

$server = stream_socket_server("tcp://$address:$port", $errno, $errstr);
if (!$server) {
    die("Error: $errstr ($errno)\n");
}

function encode($payload) {
    $frame = chr(129);
    $len = strlen($payload);
    if ($len <= 125) {
        $frame .= chr($len);
    } elseif ($len <= 65535) {
        $frame .= chr(126) . pack('n', $len);
    } else {
        $frame .= chr(127) . pack('J', $len);
    }
    return $frame . $payload;
}

function decode($data) {
    $opcode = ord($data[0]) & 0x0F;
    $length = ord($data[1]) & 127;
    if ($length == 126) {
        $masks = substr($data, 4, 4);
        $payload = substr($data, 8);
    } elseif ($length == 127) {
        $masks = substr($data, 10, 4);
        $payload = substr($data, 14);
    } else {
        $masks = substr($data, 2, 4);
        $payload = substr($data, 6);
    }
    $text = '';
    for ($i = 0; $i < strlen($payload); ++$i) {
        $text .= $payload[$i] ^ $masks[$i % 4];
    }
    return ['opcode' => $opcode, 'text' => $text];
}

while (true) {
    $read = array_map(function($c) { return is_array($c) ? $c['conn'] : $c; }, $clients);
    $read[] = $server;
    $write = $except = null;
    if (stream_select($read, $write, $except, 0, 10) > 0) {
        if (in_array($server, $read)) {
            $client = stream_socket_accept($server);
            // Peek at the first request to determine protocol
            $peek = fread($client, 2048);
            if (strpos($peek, 'GET') === 0 && strpos($peek, 'Upgrade: websocket') !== false) {
                // WebSocket handshake
                preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $peek, $matches);
                $key = trim($matches[1]);
                $accept = base64_encode(pack('H*', sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
                $response = "HTTP/1.1 101 Switching Protocols\r\n" .
                    "Upgrade: websocket\r\n" .
                    "Connection: Upgrade\r\n" .
                    "Sec-WebSocket-Accept: $accept\r\n\r\n";
                fwrite($client, $response);
                // Determine client type from URL (chat, notifs, jsondataA, jsondataB)
                $type = 'chat';
                if (strpos($peek, 'GET /notifs') !== false) {
                    $type = 'notifs';
                } else if (strpos($peek, 'GET /jsondataA') !== false) {
                    $type = 'jsondataA';
                } else if (strpos($peek, 'GET /jsondataB') !== false) {
                    $type = 'jsondataB';
                }
                $clients[] = ['conn' => $client, 'type' => $type];
            } else if (strpos($peek, 'POST') === 0) {
                // Basic HTTP handshake for integration
                // Example: Accept POST /handshake with token
                preg_match('/POST \/handshake HTTP\/[0-9.]+\r\n/', $peek, $matches);
                if ($matches) {
                    // Parse token from body (simple example)
                    $body = explode("\r\n\r\n", $peek, 2)[1] ?? '';
                    $token = trim($body);
                    // Respond with 200 OK and echo token
                    $response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: " . strlen($token) . "\r\n\r\n" . $token;
                    fwrite($client, $response);
                }
                fclose($client);
            } else {
                fclose($client);
            }
        }
        foreach ($clients as $key => $clientInfo) {
            $client = $clientInfo['conn'];
            $ctype = $clientInfo['type'];
            if (in_array($client, $read)) {
                $data = fread($client, 2048);
                if (!$data) {
                    fclose($client);
                    unset($clients[$key]);
                    continue;
                }
                // Only handle WebSocket frames
                $decoded = decode($data);
                $opcode = $decoded['opcode'];
                $msg = $decoded['text'];
                if ($opcode === 8) { // Close frame
                    // Send close frame back
                    $closeFrame = chr(136) . chr(0);
                    fwrite($client, $closeFrame);
                    fclose($client);
                    unset($clients[$key]);
                    continue;
                }
                // Broadcast logic
                if ($ctype === 'chat' || $ctype === 'notifs') {
                    // Chat/notifs: broadcast as antes
                    foreach ($clients as $sendClientInfo) {
                        if ($sendClientInfo['conn'] !== $client && ($sendClientInfo['type'] === 'chat' || $sendClientInfo['type'] === 'notifs')) {
                            fwrite($sendClientInfo['conn'], encode($msg));
                        }
                    }
                } else if ($ctype === 'jsondataA' || $ctype === 'jsondataB') {
                    // JSON modules: validate JSON, bidirectional entre A y B
                    $isJson = false;
                    if (!empty($msg)) {
                        json_decode($msg);
                        $isJson = (json_last_error() === JSON_ERROR_NONE);
                    }
                    if ($isJson) {
                        foreach ($clients as $sendClientInfo) {
                            if ($sendClientInfo['conn'] !== $client &&
                                (($ctype === 'jsondataA' && $sendClientInfo['type'] === 'jsondataB') ||
                                 ($ctype === 'jsondataB' && $sendClientInfo['type'] === 'jsondataA'))) {
                                fwrite($sendClientInfo['conn'], encode($msg));
                            }
                        }
                    } else {
                        // Enviar error al cliente
                        $error = json_encode(['error' => 'Invalid JSON']);
                        fwrite($client, encode($error));
                    }
                }
            }
        }
    }
}
?>
