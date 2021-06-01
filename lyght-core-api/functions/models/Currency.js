class Currency {
  constructor(data = {}) {
    this.currency = data.currency;
    this.value = Number(data.value);
  }

  toJson() {
    return {
      currency: this.currency,
      value: this.value,
    };
  }
}

module.exports = Currency;
