// src/main/frontend/src/shared/hooks/useModal.js
import { useCallback, useState } from "react";

export function useModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return { open, onOpen, onClose };
}

