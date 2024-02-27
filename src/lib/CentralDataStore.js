export class CentralDataStore {
  constructor() {
    this.sharedData = [];
    this.subscribers = [];
  }

  updateData(data) {
    this.sharedData = data;
    this.notifySubscribers();
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  getData() {
    return this.sharedData;
  }

  notifySubscribers() {
    this.subscribers.forEach(subscriber => {
      subscriber.update(this.sharedData);
    });
  }
}

// export const centralDataStore = new CentralDataStore();
