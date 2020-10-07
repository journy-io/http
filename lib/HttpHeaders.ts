export class HttpHeaders {
  constructor(private readonly headers: { [name: string]: string } = {}) {
    this.headers = Object.keys(this.headers).reduce((headers, name) => {
      return { ...headers, [name.toLowerCase()]: this.headers[name] };
    }, {});
  }

  byName(name: string) {
    if (name.toLowerCase() in this.headers) {
      return this.headers[name.toLowerCase()];
    }

    return undefined;
  }

  toObject() {
    return { ...this.headers };
  }
}
