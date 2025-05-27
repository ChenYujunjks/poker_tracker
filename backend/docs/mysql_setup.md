```mysql
-- 切换到目标数据库
USE poker_db;

-- 1. 插入玩家数据（假设表 Player 结构为：player_id AUTO_INCREMENT, name VARCHAR(50)）
INSERT INTO Player (name)
VALUES ('will'), ('andras'), ('bruce');

-- 2. 插入模拟 Session 数据及对应的 GameRecord 数据
-- Session 1：日期 2023-03-15, 描述 "Session 1"
INSERT INTO Session (date, description)
VALUES ('2023-03-15', 'Session 1');
-- 假设自动生成的 Session ID 为 1，在这一局中：
-- will 买入 100, cash_out 50   (亏损50)
-- andras 买入 100, cash_out 150 (盈利50)
-- bruce 买入 100, cash_out 100   (盈亏0)
INSERT INTO GameRecord (session_id, player_id, buy_in, cash_out, paid)
VALUES
    (1, 1, 100.00, 50.00, TRUE),
    (1, 2, 100.00, 150.00, TRUE),
    (1, 3, 100.00, 100.00, TRUE);

-- Session 2：日期 2023-03-16, 描述 "Session 2"
INSERT INTO Session (date, description)
VALUES ('2023-03-16', 'Session 2');
-- 假设 Session ID 为 2，在这一局中：
-- will 买入 200, cash_out 300   (盈利100)
-- andras 买入 200, cash_out 150  (亏损50)
-- bruce 买入 200, cash_out 250   (盈利50)
-- 此局合计：100 + (-50) + 50 = 100 (存在 100 的差额，模拟对账错误)
INSERT INTO GameRecord (session_id, player_id, buy_in, cash_out, paid)
VALUES
    (2, 1, 200.00, 300.00, TRUE),
    (2, 2, 200.00, 150.00, TRUE),
    (2, 3, 200.00, 250.00, TRUE);

-- Session 3：日期 2023-03-17, 描述 "Session 3"
INSERT INTO Session (date, description)
VALUES ('2023-03-17', 'Session 3');
-- 假设 Session ID 为 3，在这一局中：
-- will 买入 150, cash_out 100   (亏损50)
-- andras 买入 150, cash_out 150  (盈亏0)
-- bruce 买入 150, cash_out 200   (盈利50)
-- 此局合计：-50 + 0 + 50 = 0（无差额）
INSERT INTO GameRecord (session_id, player_id, buy_in, cash_out, paid)
VALUES
    (3, 1, 150.00, 100.00, TRUE),
    (3, 2, 150.00, 150.00, TRUE),
    (3, 3, 150.00, 200.00, TRUE);

```
