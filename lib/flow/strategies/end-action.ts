/**
 * Actions a component can run when it reaches its end (e.g. the Grid's last
 * linked cell). Multiple actions stack — each is an independent class with
 * its own `execute`, so adding a new one is additive (Open/Closed).
 */
export interface EndActionContext {
  onAdvance: () => void;
  triggerConfetti: (colors: string[]) => void;
  showMessage: (text: string) => void;
  confettiColors: string[];
  defaultText: string;
}

export interface EndActionParams {
  text?: string;
}

export interface EndAction {
  key: string;
  label: string;
  execute(ctx: EndActionContext, params: EndActionParams): void;
}

class AdvanceStepEndAction implements EndAction {
  key = "advance-step";
  label = "Advance to next step";
  execute(ctx: EndActionContext): void {
    ctx.onAdvance();
  }
}

class ConfettiEndAction implements EndAction {
  key = "confetti";
  label = "Play confetti";
  execute(ctx: EndActionContext): void {
    ctx.triggerConfetti(ctx.confettiColors);
  }
}

class ShowMessageEndAction implements EndAction {
  key = "show-message";
  label = "Show a message";
  execute(ctx: EndActionContext, params: EndActionParams): void {
    ctx.showMessage(params.text ?? ctx.defaultText);
  }
}

const END_ACTIONS: EndAction[] = [
  new AdvanceStepEndAction(),
  new ConfettiEndAction(),
  new ShowMessageEndAction(),
];

const END_ACTION_MAP: Record<string, EndAction> = Object.fromEntries(
  END_ACTIONS.map((a) => [a.key, a]),
);

export function getEndAction(key: string): EndAction | undefined {
  return END_ACTION_MAP[key];
}

export function listEndActions(): EndAction[] {
  return END_ACTIONS;
}

export function runEndActions(
  actions: { key: string; params?: EndActionParams }[],
  ctx: EndActionContext,
): void {
  for (const { key, params } of actions) {
    getEndAction(key)?.execute(ctx, params ?? {});
  }
}
