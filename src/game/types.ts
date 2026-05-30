export type ResourceKey = "gold" | "martial" | "magic";

export type GameStatus = "aspirant" | "admitted";

export type GameState = {
  gold: number;
  martial: number;
  magic: number;
  reputation: number;
  resolve: number;
  actionsTaken: number;
  noviceQuests: number;
  routine: ResourceKey;
  routineProgress: number;
  completed: Record<string, number>;
  status: GameStatus;
  log: string[];
};

export type Reward = Partial<Record<ResourceKey, number>> & {
  reputation?: number;
  resolve?: number;
  noviceQuests?: number;
};

export type Requirement = Partial<Record<ResourceKey, number>> & {
  reputation?: number;
  resolve?: number;
  noviceQuests?: number;
  martialOrMagic?: number;
  status?: GameStatus;
};

export type Action = {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
  reward: Reward;
  cost?: Partial<Record<ResourceKey, number>>;
  requirement?: Requirement;
  repeatable?: boolean;
  unlockText?: string;
};

export type Milestone = {
  id: string;
  label: string;
  current: number;
  target: number;
  complete: boolean;
};
