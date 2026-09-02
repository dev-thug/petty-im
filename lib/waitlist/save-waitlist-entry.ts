export type SaveWaitlistEntry = (email: string) => Promise<void>;

export class DuplicateEmailError extends Error {
  constructor() {
    super("duplicate-email");
    this.name = "DuplicateEmailError";
  }
}

export type WaitlistStore = {
  insert(email: string): Promise<void>;
};

export function createSaveWaitlistEntry(store: WaitlistStore): SaveWaitlistEntry {
  return (email) => store.insert(email);
}
