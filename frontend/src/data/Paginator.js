class Paginator {
  constructor(data = [], size = 20) {
    this.start = -size;
    this.size = size;
    this._data = data;
  }

  getNextPage() {
    const nextPage = this._data.slice(this.start, this.start + this.size);
    this.start += this.size / 2;
    return nextPage;
  }
  get length() {
    return this._data.length;
  }

  reset() {
    this.start = 0;
    return this;
  }
  hasMore() {
    return this._data.length > this.start;
  }
}

export default Paginator;
