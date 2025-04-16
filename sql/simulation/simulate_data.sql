
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
