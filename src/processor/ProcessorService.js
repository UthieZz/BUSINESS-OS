class Processor {
  constructor() {
    this.modules = {};
    this.state = {};
    this.listeners = {};
    this.startedAt = Date.now();
  }

  register(name, module) {
    this.modules[name] = module;
    console.log(`[Processor] Registered: ${name}`);
    this.emit("moduleRegistered", {
      name,
      totalModules: Object.keys(this.modules).length,
    });
  }

  get(name) {
    return this.modules[name];
  }

  getModules() {
    return Object.keys(this.modules);
  }

  setState(key, value) {
    this.state[key] = value;
    this.emit("stateChanged", { key, value });
  }

  getState(key) {
    return this.state[key];
  }

  getAllState() {
    return this.state;
  }

  getStateCount() {
    return Object.keys(this.state).length;
  }

  getUptime() {
    return Math.floor((Date.now() - this.startedAt) / 1000);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    // Unsubscribe handle
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    // Copy array so off() during emit is safe
    [...this.listeners[event]].forEach((callback) => callback(data));
  }
}

export default new Processor();
