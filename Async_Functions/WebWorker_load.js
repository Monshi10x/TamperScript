function createWorker(fn) {
      const url = URL.createObjectURL(
            new Blob([`\
      onmessage = ({ data }) => {
        const fn = ${fn.toString()};
        const result = fn(...JSON.parse(data));
        self.postMessage(result);
      };
    `])
      );
      const worker = new Worker(url);
      URL.revokeObjectURL(url);

      return (...args) => new Promise((resolve, reject) => {
            const message = JSON.stringify([...args]);
            worker.onmessage = ({data}) => resolve(data);
            worker.postMessage(message);
      });
}