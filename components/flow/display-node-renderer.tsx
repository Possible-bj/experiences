"use client";

import { motion } from "framer-motion";
import type { FlowNodeInstance } from "@/lib/flow/types";
import { getDisplayComponentType } from "@/lib/flow/components/registry";
import { useExperienceStyle } from "@/lib/flow/style-context";
import { resolveBackground } from "@/lib/flow/style";
import { FloatingHearts } from "@/lib/flow/components/shared/floating-hearts";

export function DisplayNodeRenderer({
  node,
  onComplete,
}: {
  node: FlowNodeInstance;
  onComplete: () => void;
}) {
  const { style, theme } = useExperienceStyle();
  const instances = node.componentInstances ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-y-auto overflow-x-hidden px-4 py-10 text-center"
      style={{ background: resolveBackground(style), color: theme.text }}
    >
      {theme.decorative === "hearts" && <FloatingHearts />}

      {instances.map((instance, i) => {
        const definition = getDisplayComponentType(instance.type);
        if (!definition) return null;
        const isLast = i === instances.length - 1;
        const Renderer = definition.Renderer;
        return (
          <Renderer
            key={instance.id}
            config={instance.config}
            onComplete={isLast ? onComplete : () => {}}
          />
        );
      })}
    </motion.div>
  );
}
