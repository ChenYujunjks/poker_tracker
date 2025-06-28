export type PlayerRecord = {
  playerId: number; // 新增 playerId
  name: string; // 从已知玩家列表中显示
  buyIn: number;
  cashOut: number;
  paid: boolean;
};
