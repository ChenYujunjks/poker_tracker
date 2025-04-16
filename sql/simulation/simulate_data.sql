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

-- 3. 检查每局牌局的差额（discrepancy）
-- 此查询显示每个 Session 的合计（cash_out - buy_in），理想状态下应该为 0，
-- 如果不为 0 则说明存在对账差异
SELECT
    s.session_id,
    s.date,
    s.description,
    SUM(g.cash_out - g.buy_in) AS discrepancy
FROM Session s
JOIN GameRecord g ON s.session_id = g.session_id
GROUP BY s.session_id, s.date, s.description;

-- 4. 计算每个玩家在所有牌局中的净盈利或亏损
-- 此查询按玩家进行分组，展示所有 Session 的数据合计
SELECT
    p.player_id,
    p.name,
    SUM(g.cash_out - g.buy_in) AS net_profit
FROM Player p
JOIN GameRecord g ON p.player_id = g.player_id
GROUP BY p.player_id, p.name;
