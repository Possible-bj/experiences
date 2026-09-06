"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type FlowVariables = Record<string, unknown>;

interface FlowStateValue {
  variables: FlowVariables;
  setVariable: (name: string, value: unknown) => void;
}

const FlowStateContext = createContext<FlowStateValue | null>(null);

/**
 * Shared named-variable store for a running flow — deliberately separate
 * from FlowEngine (which only knows graph traversal) and from StyleProvider
 * (which only knows visual theme). Input components write into it; Connector
 * nodes read from it. Neither needs to know about the other's existence.
 */
export function FlowStateProvider({ children }: { children: React.ReactNode }) {
  const [variables, setVariables] = useState<FlowVariables>({});

  const setVariable = useCallback((name: string, value: unknown) => {
    setVariables((prev) => ({ ...prev, [name]: value }));
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
