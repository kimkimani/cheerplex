<?php
/**
 * Cheerplex - Database Management System
 * Connects directly to MySQL / MariaDB (Local XAMPP, Docker, or Production cPanel)
 * when DATA_SOURCE is set to 'database'.
 */

require_once __DIR__ . '/config.php';

class DB {
    private static ?PDO $instance = null;
    private static string $activeDriver = 'none';

    public static function getConnection(): ?PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // Direct MySQL connection
        try {
            $host = defined('DB_HOST') ? DB_HOST : (getenv('MYSQL_HOST') ?: '127.0.0.1');
            $port = defined('DB_PORT') ? DB_PORT : (getenv('MYSQL_PORT') ?: '3306');
            $name = defined('DB_NAME') ? DB_NAME : (getenv('MYSQL_DB_NAME') ?: 'soka_king');
            $user = defined('DB_USER') ? DB_USER : (getenv('MYSQL_USER') ?: 'root');
            $pass = defined('DB_PASS') ? DB_PASS : (getenv('MYSQL_PASSWORD') ?: '');

            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
            self::$instance = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_SILENT,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT            => 2,
            ]);
            self::$activeDriver = 'mysql';
            return self::$instance;
        } catch (\Throwable $e) {
            self::$instance = null;
            self::$activeDriver = 'none';
        }

        return null;
    }

    public static function getDriverName(): string {
        return self::$activeDriver;
    }

    public static function isConnected(): bool {
        return self::getConnection() !== null;
    }

    /**
     * Complete Table Scan: Scans all database tables, row counts, and column schemas
     */
    public static function scanDatabase(): array {
        $pdo = self::getConnection();
        $dbName = defined('DB_NAME') ? DB_NAME : 'soka_king';
        $report = [
            'status'      => 'online',
            'driver'      => self::$activeDriver,
            'database'    => $dbName,
            'timestamp'   => date('Y-m-d H:i:s'),
            'totalTables' => 0,
            'tables'      => [],
        ];

        if (!$pdo) {
            $report['status'] = 'offline';
            $report['error'] = 'No active PDO database connection available. Connect to MySQL or use API data source.';
            return $report;
        }

        try {
            $tables = [];
            $stmt = $pdo->query("SHOW FULL TABLES WHERE Table_Type = 'BASE TABLE'");
            $rawTables = $stmt ? $stmt->fetchAll(PDO::FETCH_NUM) : [];
            foreach ($rawTables as $row) {
                $tables[] = $row[0];
            }

            $report['totalTables'] = count($tables);

            foreach ($tables as $t) {
                $count = 0;
                try {
                    $cStmt = $pdo->query("SELECT COUNT(*) FROM `{$t}`");
                    $count = $cStmt ? (int)$cStmt->fetchColumn() : 0;
                } catch (\Throwable $e) {}

                $columns = [];
                try {
                    $colStmt = $pdo->query("DESCRIBE `{$t}`");
                    if ($colStmt) {
                        $columns = array_map(function($c) {
                            return [
                                'name' => $c['Field'],
                                'type' => $c['Type'],
                                'null' => $c['Null'],
                                'key'  => $c['Key'],
                            ];
                        }, $colStmt->fetchAll());
                    }
                } catch (\Throwable $e) {}

                $report['tables'][$t] = [
                    'tableName' => $t,
                    'rowCount'  => $count,
                    'columns'   => $columns,
                ];
            }
        } catch (\Throwable $e) {
            $report['error'] = $e->getMessage();
        }

        return $report;
    }
}
