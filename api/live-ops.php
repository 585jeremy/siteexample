<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$snapshot = api_read_snapshot();

api_json($snapshot);

