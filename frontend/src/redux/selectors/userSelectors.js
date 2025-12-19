export const profileSelector = (state) => state.user?.profile ?? null;

export const profileLoadingSelector = (state) =>
  state.user?.loadingProfile ?? false;
export const profileErrorSelector = (state) => state.user?.profileError ?? null;

export const profileUpdatingSelector = (state) => state.user?.updating ?? false;
export const profileUpdateErrorSelector = (state) =>
  state.user?.updateError ?? null;

export const profileDeletingSelector = (state) => state.user?.deleting ?? false;
export const profileDeleteErrorSelector = (state) =>
  state.user?.deleteError ?? null;
