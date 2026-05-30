import type { Action, GameState, Milestone, Requirement, ResourceKey } from "./types";

export const routineLabels: Record<ResourceKey, string> = {
  gold: "Odd jobs",
  martial: "Weapon forms",
  magic: "Candle study",
};

export const coreActions: Action[] = [
  {
    id: "odd-jobs",
    eyebrow: "Work",
    title: "Take odd jobs",
    body: "Carry ledgers, mend fences, and earn enough coin to choose your next risk.",
    reward: { gold: 14 },
    repeatable: true,
  },
  {
    id: "weapon-drills",
    eyebrow: "Martial",
    title: "Drill weapon forms",
    body: "Repeat the clean cuts until strain becomes structure.",
    reward: { martial: 12, resolve: 1 },
    repeatable: true,
  },
  {
    id: "candle-study",
    eyebrow: "Magic",
    title: "Study by candlelight",
    body: "Trace beginner sigils and learn how attention changes the world.",
    reward: { magic: 12, resolve: 1 },
    repeatable: true,
  },
  {
    id: "sparring-hall",
    eyebrow: "Unlock",
    title: "Enter the sparring hall",
    body: "Pay for harder bouts against fighters who will not flatter you.",
    reward: { martial: 26, resolve: 2 },
    cost: { gold: 10 },
    requirement: { martial: 36, gold: 10 },
    repeatable: true,
    unlockText: "Requires 36 Martial EXP and 10 Gold.",
  },
  {
    id: "arcane-tutor",
    eyebrow: "Unlock",
    title: "Hire an arcane tutor",
    body: "A stern mage compresses a month of mistakes into one bruising lesson.",
    reward: { magic: 26, resolve: 2 },
    cost: { gold: 10 },
    requirement: { magic: 36, gold: 10 },
    repeatable: true,
    unlockText: "Requires 36 Magic EXP and 10 Gold.",
  },
];

export const quests: Action[] = [
  {
    id: "market-guard",
    eyebrow: "Novice quest",
    title: "Guard the market road",
    body: "Walk a merchant path where petty theft becomes your first public test.",
    reward: { gold: 22, martial: 10, reputation: 1, noviceQuests: 1 },
    requirement: { resolve: 4 },
    repeatable: true,
    unlockText: "Requires 4 Resolve Reserve.",
  },
  {
    id: "haunted-errand",
    eyebrow: "Novice quest",
    title: "Carry wards to Low Chapel",
    body: "Deliver warm iron and simple runes to a place that refuses to stay quiet.",
    reward: { gold: 18, magic: 16, reputation: 1, noviceQuests: 1 },
    requirement: { resolve: 5, magic: 18 },
    repeatable: true,
    unlockText: "Requires 5 Resolve Reserve and 18 Magic EXP.",
  },
  {
    id: "goblin-den",
    eyebrow: "Contract",
    title: "Clear the gutter den",
    body: "A cramped fight under old stone. It takes nerve before it takes skill.",
    reward: { gold: 45, martial: 30, reputation: 3, noviceQuests: 1 },
    requirement: { resolve: 10, martial: 45 },
    repeatable: true,
    unlockText: "Requires 10 Resolve Reserve and 45 Martial EXP.",
  },
  {
    id: "candlelit-ruins",
    eyebrow: "Contract",
    title: "Search the candlelit ruins",
    body: "Map glyphs that bloom under flame and bring back proof you understood them.",
    reward: { gold: 38, magic: 32, reputation: 3, noviceQuests: 1 },
    requirement: { resolve: 10, magic: 45 },
    repeatable: true,
    unlockText: "Requires 10 Resolve Reserve and 45 Magic EXP.",
  },
  {
    id: "guild-trial",
    eyebrow: "Milestone",
    title: "Attempt guild admission",
    body: "Stand before the Adventurer's Guild with a record that says you are ready.",
    reward: {},
    requirement: {
      gold: 100,
      reputation: 10,
      resolve: 12,
      noviceQuests: 3,
      martialOrMagic: 50,
      status: "aspirant",
    },
    repeatable: false,
    unlockText: "Meet the admission requirements.",
  },
];

export function admissionMilestones(state: GameState): Milestone[] {
  const bestDiscipline = Math.max(state.martial, state.magic);

  return [
    {
      id: "gold",
      label: "100 Gold",
      current: state.gold,
      target: 100,
      complete: state.gold >= 100,
    },
    {
      id: "discipline",
      label: "50 Martial or Magic EXP",
      current: bestDiscipline,
      target: 50,
      complete: bestDiscipline >= 50,
    },
    {
      id: "resolve",
      label: "12 Resolve Reserve",
      current: state.resolve,
      target: 12,
      complete: state.resolve >= 12,
    },
    {
      id: "reputation",
      label: "10 Reputation",
      current: state.reputation,
      target: 10,
      complete: state.reputation >= 10,
    },
    {
      id: "novice",
      label: "3 Novice Quests",
      current: state.noviceQuests,
      target: 3,
      complete: state.noviceQuests >= 3,
    },
  ];
}

export function requirementLines(requirement?: Requirement): string[] {
  if (!requirement) return [];

  const lines: string[] = [];
  if (requirement.gold) lines.push(`${requirement.gold} Gold`);
  if (requirement.martial) lines.push(`${requirement.martial} Martial EXP`);
  if (requirement.magic) lines.push(`${requirement.magic} Magic EXP`);
  if (requirement.martialOrMagic) {
    lines.push(`${requirement.martialOrMagic} Martial or Magic EXP`);
  }
  if (requirement.resolve) lines.push(`${requirement.resolve} Resolve Reserve`);
  if (requirement.reputation) lines.push(`${requirement.reputation} Reputation`);
  if (requirement.noviceQuests) lines.push(`${requirement.noviceQuests} Novice Quests`);
  return lines;
}
