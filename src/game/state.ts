import { coreActions, quests, routineLabels } from "./content";
import type { Action, GameState, Requirement, ResourceKey, Reward } from "./types";

const SAVE_KEY = "luceat-save-v1";
const ROUTINE_MAX_PROGRESS = 100;
const ROUTINE_GAIN = 2;

export const initialState: GameState = {
  gold: 0,
  martial: 0,
  magic: 0,
  reputation: 0,
  resolve: 3,
  actionsTaken: 0,
  noviceQuests: 0,
  routine: "gold",
  routineProgress: 0,
  completed: {},
  status: "aspirant",
  log: [
    "You arrive at the low gate with a dull blade, a colder purse, and enough nerve to begin.",
  ],
};

export function loadGame(): GameState {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return initialState;

  try {
    const parsed = JSON.parse(saved) as GameState;
    return {
      ...initialState,
      ...parsed,
      completed: { ...initialState.completed, ...parsed.completed },
      log: parsed.log?.length ? parsed.log.slice(0, 8) : initialState.log,
    };
  } catch {
    return initialState;
  }
}

export function saveGame(state: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function clearGame() {
  localStorage.removeItem(SAVE_KEY);
}

export function getAction(actionId: string): Action | undefined {
  return [...coreActions, ...quests].find((action) => action.id === actionId);
}

export function canAfford(state: GameState, action: Action) {
  if (!action.cost) return true;
  return Object.entries(action.cost).every(([key, value]) => {
    const resourceKey = key as ResourceKey;
    return state[resourceKey] >= (value ?? 0);
  });
}

export function meetsRequirement(state: GameState, requirement?: Requirement) {
  if (!requirement) return true;
  if (requirement.status && state.status !== requirement.status) return false;
  if (requirement.gold && state.gold < requirement.gold) return false;
  if (requirement.martial && state.martial < requirement.martial) return false;
  if (requirement.magic && state.magic < requirement.magic) return false;
  if (requirement.reputation && state.reputation < requirement.reputation) return false;
  if (requirement.resolve && state.resolve < requirement.resolve) return false;
  if (requirement.noviceQuests && state.noviceQuests < requirement.noviceQuests) return false;
  if (requirement.martialOrMagic && Math.max(state.martial, state.magic) < requirement.martialOrMagic) {
    return false;
  }
  return true;
}

export function visibleActions(state: GameState, actions: Action[]) {
  return actions.filter((action) => {
    if (!action.requirement) return true;
    if (meetsRequirement(state, action.requirement)) return true;
    return Boolean(action.unlockText);
  });
}

export function applyAction(state: GameState, actionId: string): GameState {
  const action = getAction(actionId);
  if (!action) return state;
  if (!action.repeatable && state.completed[action.id]) return state;
  if (!canAfford(state, action) || !meetsRequirement(state, action.requirement)) return state;

  let next = { ...state };

  if (action.cost) {
    next = applyCost(next, action.cost);
  }

  if (action.id === "guild-trial") {
    return addLog(
      {
        ...next,
        status: "admitted",
        completed: { ...next.completed, [action.id]: 1 },
        actionsTaken: next.actionsTaken + 1,
      },
      "The guild accepts your record. Party contracts are now within reach.",
    );
  }

  next = applyReward(next, action.reward);
  next = {
    ...next,
    actionsTaken: next.actionsTaken + 1,
    completed: {
      ...next.completed,
      [action.id]: (next.completed[action.id] ?? 0) + 1,
    },
  };

  return addLog(next, rewardLine(action.title, action.reward));
}

export function advanceRoutine(state: GameState, amount: number): GameState {
  if (state.status === "admitted") return state;

  const progress = state.routineProgress + amount;
  if (progress < ROUTINE_MAX_PROGRESS) {
    return { ...state, routineProgress: progress };
  }

  const ticks = Math.floor(progress / ROUTINE_MAX_PROGRESS);
  const remaining = progress % ROUTINE_MAX_PROGRESS;
  let next = { ...state, routineProgress: remaining };

  for (let index = 0; index < ticks; index += 1) {
    next = applyReward(next, { [next.routine]: ROUTINE_GAIN });
  }

  return addLog(next, `${routineLabels[state.routine]} yielded a small gain.`);
}

export function setRoutine(state: GameState, routine: ResourceKey): GameState {
  if (state.routine === routine) return state;
  return addLog({ ...state, routine }, `Routine changed to ${routineLabels[routine]}.`);
}

function applyCost(
  state: GameState,
  cost: NonNullable<Action["cost"]>,
): GameState {
  return {
    ...state,
    gold: state.gold - (cost.gold ?? 0),
    martial: state.martial - (cost.martial ?? 0),
    magic: state.magic - (cost.magic ?? 0),
  };
}

function applyReward(state: GameState, reward: Reward): GameState {
  return {
    ...state,
    gold: state.gold + (reward.gold ?? 0),
    martial: state.martial + (reward.martial ?? 0),
    magic: state.magic + (reward.magic ?? 0),
    reputation: state.reputation + (reward.reputation ?? 0),
    resolve: state.resolve + (reward.resolve ?? 0),
    noviceQuests: state.noviceQuests + (reward.noviceQuests ?? 0),
  };
}

function addLog(state: GameState, message: string): GameState {
  return {
    ...state,
    log: [message, ...state.log].slice(0, 8),
  };
}

function rewardLine(title: string, reward: Reward) {
  const parts = [
    reward.gold ? `+${reward.gold} Gold` : "",
    reward.martial ? `+${reward.martial} Martial EXP` : "",
    reward.magic ? `+${reward.magic} Magic EXP` : "",
    reward.reputation ? `+${reward.reputation} Reputation` : "",
    reward.resolve ? `+${reward.resolve} Resolve` : "",
  ].filter(Boolean);

  return `${title}: ${parts.join(", ") || "completed"}.`;
}
