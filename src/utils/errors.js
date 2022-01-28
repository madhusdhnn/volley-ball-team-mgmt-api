class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = "IllegalArgumentError";
  }
}

export { IllegalArgumentError };
