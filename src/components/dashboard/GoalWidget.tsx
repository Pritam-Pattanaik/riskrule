import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useGoalStore } from '../../stores/goalStore';
import { getLocalYYYYMMDD } from '../../lib/dateUtils';

const panel = 'rounded-xl border border-primary/10 bg-surface p-5 sm:p-6';

export default function GoalWidget() {
  const userId = useAuthStore(state => state.user?.id);
  const [pending, setPending] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const { goals, loading, loadedFor, loadError, fetchGoals, completeGoal } = useGoalStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals, userId]);

  const today = getLocalYYYYMMDD(new Date());

  const handleComplete = async (goalId: string) => {
    setPending(goalId);
    setFailed(false);
    setFailed(!await completeGoal(goalId, today, true));
    setPending(null);
  };

  if (loading || loadedFor !== userId) {
    return (
      <div className={`${panel} flex h-[200px] items-center justify-center`}>
        <Loader2 size={16} className="animate-spin text-tertiary" aria-label="Loading goals" />
      </div>
    );
  }

  return (
    <section className={panel} aria-labelledby="goals-title">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="goals-title" className="text-base font-semibold text-primary">Goals</h2>
        <Link
          to="/app/goals"
          className="rounded-[4px] text-xs text-secondary transition-colors hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Manage
        </Link>
      </div>

      {failed && <p role="alert" className="mb-2 text-sm text-danger">Could not mark this goal done. Try again.</p>}
      {loadError ? <button className="text-sm text-accent" onClick={fetchGoals}>Could not load goals. Retry</button> : goals.length === 0 ? (
        <p className="py-8 text-center text-sm text-secondary">No goals set yet</p>
      ) : (
        <ul className="divide-y divide-primary/10">
          {goals.slice(0, 5).map(goal => {
            const isCompletedToday = goal.completions?.some((c: { date: string; completed: boolean }) => c.completed && c.date.startsWith(today));
            return (
              <li key={goal.id} className="flex min-h-12 items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-primary">{goal.description}</p>
                  <p className="mt-1 text-xs text-tertiary">
                    <span className="lowercase first-letter:uppercase">{goal.type}</span>
                    {goal.target && <span className="font-mono tabular-nums"> · {goal.target}</span>}
                  </p>
                </div>

                {isCompletedToday ? (
                  <Check size={16} strokeWidth={1.5} className="shrink-0 text-success" aria-label="Done today" />
                ) : (
                  <button
                    disabled={!!pending}
                    aria-label={`Mark ${goal.description} done`}
                    onClick={() => handleComplete(goal.id)}
                    className="h-8 shrink-0 rounded-sm border border-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-surface-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {pending === goal.id ? 'Saving…' : 'Done'}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
