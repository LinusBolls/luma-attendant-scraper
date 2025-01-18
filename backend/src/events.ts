type EventMap = {
  [key: string]: (...args: any[]) => void;
};

/**
 * an abstraction that we use for multiple classes that should be able to emit events that consumers can attach listeners to.
 */
export default class Events<T extends EventMap> {
  private events: { [K in keyof T]: Set<T[K]> } = {} as any;

  public addEventListener<Key extends keyof T>(
    key: Key,
    func: T[Key]
  ): () => void {
    if (!this.events[key]) {
      this.events[key] = new Set<T[Key]>();
    }

    this.events[key].add(func);

    return () => this.removeEventListener(key, func);
  }
  public removeEventListener<Key extends keyof T>(
    key: Key,
    func: T[Key]
  ): void {
    if (!this.events[key]) return;

    this.events[key].delete(func);
  }
  public dispatch<Key extends keyof T>(key: Key, ...args: Parameters<T[Key]>) {
    const listeners = this.events[key];

    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }
}
