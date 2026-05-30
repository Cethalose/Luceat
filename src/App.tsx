import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Coins,
  Dumbbell,
  Flag,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import crest from "./assets/luceat-mark.svg";
import { admissionMilestones, coreActions, quests, requirementLines, routineLabels } from "./game/content";
import {
  advanceRoutine,
  applyAction,
  canAfford,
  clearGame,
  initialState,
  loadGame,
  meetsRequirement,
  saveGame,
  setRoutine,
  visibleActions,
} from "./game/state";
import type { Action, GameState, Milestone, ResourceKey } from "./game/types";

const routineKeys: ResourceKey[] = ["gold", "martial", "magic"];

function App() {
  const [state, setState] = useState<GameState>(() => loadGame());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => advanceRoutine(current, 8));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const milestones = useMemo(() => admissionMilestones(state), [state]);
  const allMilestonesMet = milestones.every((milestone) => milestone.complete);
  const actions = visibleActions(state, coreActions);
  const availableQuests = visibleActions(state, quests);

  return (
    <main className="shell">
      <section className="hero-panel">
        <div className="identity">
          <img src={crest} alt="" className="crest" />
          <div>
            <p className="eyebrow">Unaffiliated Aspirant</p>
            <h1>Luceat</h1>
            <p className="subhead">Earn a place in the Adventurer's Guild by building the person who can survive it.</p>
          </div>
        </div>

        <div className="status-strip" aria-label="Character state">
          <Stat icon={<Coins size={18} />} label="Gold" value={state.gold} />
          <Stat icon={<Swords size={18} />} label="Martial EXP" value={state.martial} />
          <Stat icon={<BookOpen size={18} />} label="Magic EXP" value={state.magic} />
          <Stat icon={<Award size={18} />} label="Reputation" value={state.reputation} />
          <Stat icon={<Shield size={18} />} label="Resolve" value={state.resolve} />
        </div>
      </section>

      <section className="layout-grid">
        <aside className="left-rail">
          <Panel title="Guild Admission" icon={<Flag size={18} />}>
            <div className="milestones">
              {milestones.map((milestone) => (
                <MilestoneBar key={milestone.id} milestone={milestone} />
              ))}
            </div>
            <div className={state.status === "admitted" ? "admission admitted" : "admission"}>
              {state.status === "admitted" ? (
                <>
                  <Trophy size={20} />
                  <span>Admitted. Party contracts unlocked in the next chapter.</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>{allMilestonesMet ? "The guild trial is ready." : "Build your record at your pace."}</span>
                </>
              )}
            </div>
          </Panel>

          <Panel title="Standing Routine" icon={<RotateCcw size={18} />}>
            <div className="routine-buttons">
              {routineKeys.map((key) => (
                <button
                  key={key}
                  className={state.routine === key ? "routine active" : "routine"}
                  onClick={() => setState((current) => setRoutine(current, key))}
                  type="button"
                >
                  {routineLabels[key]}
                </button>
              ))}
            </div>
            <div className="routine-meter">
              <span style={{ width: `${state.routineProgress}%` }} />
            </div>
          </Panel>

          <Panel title="Journal" icon={<BookOpen size={18} />}>
            <ol className="journal">
              {state.log.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ol>
          </Panel>
        </aside>

        <section className="play-area">
          <Panel title="Personal Actions" icon={<Dumbbell size={18} />}>
            <div className="card-grid">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  state={state}
                  onRun={() => setState((current) => applyAction(current, action.id))}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Quests And Trials" icon={<Swords size={18} />}>
            <div className="card-grid">
              {availableQuests.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  state={state}
                  onRun={() => setState((current) => applyAction(current, action.id))}
                />
              ))}
            </div>
          </Panel>
        </section>
      </section>

      <div className="footer-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            clearGame();
            setState(initialState);
          }}
        >
          <RotateCcw size={16} />
          Reset run
        </button>
      </div>
    </main>
  );
}

function Panel({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        {icon}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="stat">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MilestoneBar({ milestone }: { milestone: Milestone }) {
  const progress = Math.min(100, Math.round((milestone.current / milestone.target) * 100));

  return (
    <div className="milestone">
      <div className="milestone-label">
        <span>{milestone.label}</span>
        <strong>{Math.min(milestone.current, milestone.target)} / {milestone.target}</strong>
      </div>
      <div className="bar">
        <span className={milestone.complete ? "complete" : ""} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ActionCard({
  action,
  onRun,
  state,
}: {
  action: Action;
  onRun: () => void;
  state: GameState;
}) {
  const available = meetsRequirement(state, action.requirement) && canAfford(state, action);
  const alreadyComplete = !action.repeatable && Boolean(state.completed[action.id]);
  const locked = !available || alreadyComplete;

  return (
    <article className={available ? "action-card" : "action-card locked"}>
      <p className="eyebrow">{action.eyebrow}</p>
      <h3>{action.title}</h3>
      <p>{action.body}</p>
      <ActionMeta action={action} />
      <button type="button" disabled={locked} onClick={onRun}>
        {alreadyComplete ? "Complete" : available ? "Begin" : "Locked"}
      </button>
    </article>
  );
}

function ActionMeta({ action }: { action: Action }) {
  const requirements = requirementLines(action.requirement);
  const rewards = [
    action.reward.gold ? `+${action.reward.gold} Gold` : "",
    action.reward.martial ? `+${action.reward.martial} Martial` : "",
    action.reward.magic ? `+${action.reward.magic} Magic` : "",
    action.reward.reputation ? `+${action.reward.reputation} Rep` : "",
    action.reward.resolve ? `+${action.reward.resolve} Resolve` : "",
  ].filter(Boolean);

  return (
    <div className="meta">
      {requirements.length > 0 && <span>Needs {requirements.join(", ")}</span>}
      {action.cost?.gold && <span>Costs {action.cost.gold} Gold</span>}
      {rewards.length > 0 && <span>{rewards.join(", ")}</span>}
    </div>
  );
}

export default App;
