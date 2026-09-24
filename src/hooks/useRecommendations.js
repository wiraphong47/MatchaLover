import { useState } from "react";
import {
  profileSelection,
  rankMatcha,
  selectionNote,
} from "../utils/rankMatcha";
import useAsyncAction from "./useAsyncAction";

const INITIAL_RECOMMENDATION_COUNT = 3;

export default function useRecommendations(
  products,
  customer,
  onSavePreferences
) {
  const [draft, setDraft] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const owner = customer?.memberId || "guest";
  const current = draft?.owner === owner ? draft : null;
  const selected = current?.selected ?? profileSelection(customer);
  const budget = current?.budget ?? customer?.budget ?? "";
  const { run, busy, error, clearError } = useAsyncAction(async () => {
    if (!customer || !onSavePreferences)
      throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึก");
    await onSavePreferences({
      ...customer,
      note: selectionNote(customer.note, selected),
      budget,
    });
  });
  const update = (next) => {
    setDraft({ owner, selected, budget, ...next });
    setExpanded(false);
    setSaved(false);
    clearError();
  };
  const results = rankMatcha(products, selected, budget);
  return {
    selected,
    budget,
    busy,
    error,
    saved,
    isMember: Boolean(customer),
    personalized: !current && selected.length > 0,
    recommendations: expanded
      ? results
      : results.slice(0, INITIAL_RECOMMENDATION_COUNT),
    initialCount: INITIAL_RECOMMENDATION_COUNT,
    total: results.length,
    expanded,
    onToggle: (key) =>
      update({
        selected: selected.includes(key)
          ? selected.filter((s) => s !== key)
          : [...selected, key],
      }),
    onBudgetChange: (value) => update({ budget: value }),
    onReset: () => update({ selected: [], budget: "" }),
    onUseProfile: () => {
      setDraft(null);
      setExpanded(false);
      setSaved(false);
      clearError();
    },
    onSave: async () => {
      if (await run()) setSaved(true);
    },
    onExpand: () => setExpanded((value) => !value),
  };
}
