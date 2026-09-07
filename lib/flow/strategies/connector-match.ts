/**
 * Decides whether one Connector case matches the flow variable's current
 * value. Each concrete strategy is an independent class — adding a new way
 * to match (e.g. "one of a list", "contains") never touches the others or
 * the Connector renderer itself (Open/Closed).
 */
export interface ConnectorMatchStrategy {
  key: string;
  label: string;
  matches(value: unknown, params: ConnectorMatchParams): boolean;
}

export interface ConnectorMatchParams {
  value?: string;
  min?: number;
  max?: number;
}

class ExactMatchStrategy implements ConnectorMatchStrategy {
  key = "exact";
  label = "Equals";
  matches(value: unknown, params: ConnectorMatchParams): boolean {
    return String(value) === (params.value ?? "");
  }
}

class RangeMatchStrategy implements ConnectorMatchStrategy {
  key = "range";
  label = "Between (numeric)";
  matches(value: unknown, params: ConnectorMatchParams): boolean {
    const n = Number(value);
    if (Number.isNaN(n)) return false;
    const min = params.min ?? -Infinity;
    const max = params.max ?? Infinity;
    return n >= min && n <= max;
  }
}

const CONNECTOR_MATCH_STRATEGIES: ConnectorMatchStrategy[] = [
  new ExactMatchStrategy(),
  new RangeMatchStrategy(),
];

const CONNECTOR_MATCH_STRATEGY_MAP: Record<string, ConnectorMatchStrategy> = Object.fromEntries(
  CONNECTOR_MATCH_STRATEGIES.map((s) => [s.key, s]),
);

export function getConnectorMatchStrategy(key: string): ConnectorMatchStrategy {
  return CONNECTOR_MATCH_STRATEGY_MAP[key] ?? CONNECTOR_MATCH_STRATEGY_MAP["exact"];
}

export function listConnectorMatchStrategies(): ConnectorMatchStrategy[] {
  return CONNECTOR_MATCH_STRATEGIES;
}
