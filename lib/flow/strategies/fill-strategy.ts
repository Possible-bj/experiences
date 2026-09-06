import { NAME_BANK, WORD_BANK, cycle } from "@/lib/flow/strategies/word-banks";

/**
 * Fills the Grid component's empty (non-linked) cells. Each concrete
 * strategy is an independent class — adding one never touches the others or
 * the Grid renderer itself (Open/Closed).
 */
export interface FillStrategy {
  key: string;
  label: string;
  fill(count: number, params: FillStrategyParams): string[];
}

export interface FillStrategyParams {
  customListItems?: string[];
}

class RandomNamesFillStrategy implements FillStrategy {
  key = "random-names";
  label = "Random names";
  fill(count: number): string[] {
    return cycle(NAME_BANK, count);
  }
}

class RandomWordsFillStrategy implements FillStrategy {
  key = "random-words";
  label = "Random words";
  fill(count: number): string[] {
    return cycle(WORD_BANK, count);
  }
}

class CustomListFillStrategy implements FillStrategy {
  key = "custom-list";
  label = "Custom list";
  fill(count: number, params: FillStrategyParams): string[] {
    const items = params.customListItems?.length ? params.customListItems : [""];
    return cycle(items, count);
  }
}

class BlankFillStrategy implements FillStrategy {
  key = "blank";
  label = "Blank";
  fill(count: number): string[] {
    return Array.from({ length: count }, () => "");
  }
}

const FILL_STRATEGIES: FillStrategy[] = [
  new RandomNamesFillStrategy(),
  new RandomWordsFillStrategy(),
  new CustomListFillStrategy(),
  new BlankFillStrategy(),
];

const FILL_STRATEGY_MAP: Record<string, FillStrategy> = Object.fromEntries(
  FILL_STRATEGIES.map((s) => [s.key, s]),
);

export function getFillStrategy(key: string): FillStrategy {
  return FILL_STRATEGY_MAP[key] ?? FILL_STRATEGY_MAP["random-names"];
}

export function listFillStrategies(): FillStrategy[] {
  return FILL_STRATEGIES;
}
