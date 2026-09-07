"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type FlowVariables = Record<string, unknown>;

export type FlowVariableUpdater = unknown | ((prev: unknown) => unknown);

interface FlowStateValue {
  variables: FlowVariables;
  setVariable: (name: string, value: FlowVariableUpdater) => void;
}

const FlowStateContext = createContext<FlowStateValue | null>(null);

/**
 * Shared named-variable store for a running flow — deliberately separate
 * from FlowEngine (which only knows graph traversal) and from StyleProvider
 * (which only knows visual theme). Input components write into it; Connector
 * nodes read from it. Neither needs to know about the other's existence.
 *
 * `setVariable` accepts a plain value or a `(prev) => next` updater — the
 * same shape as `useState` — so a new use case (like accumulating a quiz
 * score) never needs a dedicated method added to this interface.
 */
export function FlowStateProvider({ children }: { children: React.ReactNode }) {
  const [variables, setVariables] = useState<FlowVariables>({});

  const setVariable = useCallback((name: string, value: FlowVariableUpdater) => {
    setVariables((prev) => ({
      ...prev,
      [name]: typeof value === "function" ? (value as (prev: unknown) => unknown)(prev[name]) : value,
    }));
  }, []);

  return (
    <FlowStateContext.Provider value={{ variables, setVariable }}>
      {children}
    </FlowStateContext.Provider>
  );
}

export function useFlowState(): FlowStateValue {
  const ctx = useContext(FlowStateContext);
  if (!ctx) throw new Error("useFlowState must be used within a FlowStateProvider");
  return ctx;
}
