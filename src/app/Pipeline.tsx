import AppIcon from './AppIcon';
import { pipelineStyles } from './uiStyles';

type StepState = 'done' | 'current' | 'attention' | 'upcoming';

const STEPS = ['Ekstrakcja AI', 'Przegląd', 'Decyzja'] as const;

const STATE_TEXT: Record<StepState, string> = {
  done: 'ukończone',
  current: 'bieżący etap',
  attention: 'wymaga uzupełnienia',
  upcoming: 'oczekuje',
};

// Stan trzech etapów wynika wyłącznie ze statusu zapytania zapisanego w bazie.
function getStepStates(status: string): [StepState, StepState, StepState] {
  switch (status) {
    case 'EXTRACTED':
      return ['done', 'current', 'upcoming'];
    case 'NEEDS_INFO':
      return ['done', 'attention', 'upcoming'];
    case 'APPROVED':
      return ['done', 'done', 'done'];
    default:
      return ['current', 'upcoming', 'upcoming'];
  }
}

export default function Pipeline({ status }: { status: string }) {
  const states = getStepStates(status);

  return (
    <ol aria-label="Postęp zapytania" className={pipelineStyles.list}>
      {STEPS.map((label, index) => {
        const state = states[index];
        return (
          <li key={label} className={pipelineStyles.item}>
            {index > 0 && (
              <span
                aria-hidden="true"
                className={
                  states[index - 1] === 'done' ? pipelineStyles.line.done : pipelineStyles.line.todo
                }
              />
            )}
            <span className={pipelineStyles.stepWrap}>
              <span className={`${pipelineStyles.dotBase} ${pipelineStyles.dot[state]}`}>
                {state === 'done' ? (
                  <AppIcon name="check" className="size-3" />
                ) : state === 'attention' ? (
                  <AppIcon name="alert" className="size-3" />
                ) : (
                  index + 1
                )}
              </span>
              <span className={`${pipelineStyles.label[state]} ${pipelineStyles.labelVisibility}`}>
                {label}
              </span>
              <span className="sr-only">
                {label}: {STATE_TEXT[state]}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
