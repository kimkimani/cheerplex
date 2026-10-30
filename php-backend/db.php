<?php
/**
 * SOKA Predictions - Database PDO Manager
 * Supports MySQL production connection with SQLite fallback and table scanner
 */

require_once __DIR__ . '/config.php';

class Database {
    private static $pdo = null;
    private static string $activeDriver = 'none';

    public static function getConnection() {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        // 1. Try MySQL
        try {
            $dsn = sprintf(
                "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
                DB_HOST,
                DB_PORT,
                DB_NAME
            );
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_SILENT,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 2,
            ];

            self::$pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            self::$activeDriver = 'mysql';
            return self::$pdo;
        } catch (\Throwable $e) {
            self::$pdo = null;
        }

        // 2. Try SQLite
        $sqliteFiles = [
            __DIR__ . '/../app/soka_king.sqlite',
            __DIR__ . '/soka_king.sqlite',
            __DIR__ . '/../soka_king.sqlite'
        ];

        foreach ($sqliteFiles as $f) {
            if (file_exists($f)) {
                try {
                    self::$pdo = new PDO('sqlite:' . $f, null, null, [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_SILENT,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]);
                    self::$activeDriver = 'sqlite';
                    return self::$pdo;
                } catch (\Throwable $e) {}
            }
        }

        return null;
    }

    public static function getDriverName(): string {
        return self::$activeDriver;
    }

    public static function scanDatabase(): array {
        $pdo = self::getConnection();
        $report = [
            'status'      => $pdo ? 'online' : 'offline',
            'driver'      => self::$activeDriver,
            'database'    => defined('DB_NAME') ? DB_NAME : 'soka_king',
            'timestamp'   => date('Y-m-d H:i:s'),
            'totalTables' => 0,
            'tables'      => [],
        ];

        if (!$pdo) {
            $report['error'] = 'Database connection failed';
            return $report;
        }

        try {
            $tables = [];
            if (self::$activeDriver === 'mysql') {
                $stmt = $pdo->query("SHOW FULL TABLES WHERE Table_Type = 'BASE TABLE'");
                $raw = $stmt ? $stmt->fetchAll(PDO::FETCH_NUM) : [];
                foreach ($raw as $r) $tables[] = $r[0];
            } else {
                $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC");
                $tables = $stmt ? $stmt->fetchAll(PDO::FETCH_COLUMN) : [];
            }

            $report['totalTables'] = count($tables);

            foreach ($tables as $t) {
                $count = 0;
                try {
                    $cStmt = $pdo->query("SELECT COUNT(*) FROM `$t`");
                    $count = $cStmt ? (int)$cStmt->fetchColumn() : 0;
                } catch (\Throwable $e) {}

                $report['tables'][$t] = [
                    'tableName' => $t,
                    'rowCount'  => $count
                ];
            }
        } catch (\Throwable $e) {
            $report['error'] = $e->getMessage();
        }

        return $report;
    }
}
