function subscribe(eventName: string, listener: (event: any) => void) {
  document.addEventListener(eventName, listener);
}

function unsubscribe(eventName: string, listener: () => void) {
  document.removeEventListener(eventName, listener);
}

function publish(eventName: string, data?: any) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publish, subscribe, unsubscribe };
