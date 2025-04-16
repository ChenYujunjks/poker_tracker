-- 创建数据库并切换到该数据库
CREATE DATABASE IF NOT EXISTS poker_db;
USE poker_db;

-- 创建 Session 表：用于记录每局牌（poker session）的信息
CREATE TABLE IF NOT EXISTS Session (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) DEFAULT NULL
);

-- 创建 Player 表：用于记录所有玩家的基本信息
CREATE TABLE IF NOT EXISTS Player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- 创建 GameRecord 表：用于记录每个玩家在各牌局中的买入金额、最终收款以及支付状态
CREATE TABLE IF NOT EXISTS GameRecord (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    player_id INT NOT NULL,
    buy_in DECIMAL(10,2) NOT NULL,
    cash_out DECIMAL(10,2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES Session(session_id),
    FOREIGN KEY (player_id) REFERENCES Player(player_id)
);
