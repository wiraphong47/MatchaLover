export const memberIdFor = (customer) =>
  customer?.memberId ||
  `MM-${String(customer?.phone || "0000").slice(-4)}-${String(customer?.email || "member").length}`;

export const createMemberId = (customer) =>
  `MM-${String(customer?.phone || "0000").slice(-4)}-${Date.now()
    .toString()
    .slice(-4)}`;
