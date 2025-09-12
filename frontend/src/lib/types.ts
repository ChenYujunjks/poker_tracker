export type PlayerRecord = {
  id: number; // 记录的主键
  playerId: number; // 玩家 ID（外键）
  name: string;
  buyIn: number;
  cashOut: number;
  paid: boolean;
};

export type PlayerOption = { id: number; name: string };
