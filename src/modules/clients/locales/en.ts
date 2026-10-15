const clients = {
  navLabel: "Clients",
  title: "Clients",
  subtitle: "Find clients with search.",
  loading: "Loading clients…",
  loadError: "Couldn't load clients.",
  retry: "Retry",
  searchPlaceholder: "Search by name",
  apply: "Apply",
  clear: "Clear",
  matchCount: "{{count}} matching",
  pageLabel: "Page {{page}} of {{total}}",
  emptyTitle: "No clients yet",
  emptyDescription: "No clients are available.",
  emptySearchTitle: "No matching clients",
  emptySearchDescription: "Try a different search.",
  unnamed: "Unnamed client",
  idLabel: "ID {{id}}",
  filters: {
    search: "Search",
  },
} as const;

export default clients;
