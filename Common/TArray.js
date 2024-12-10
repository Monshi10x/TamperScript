class TArray extends Array {

      isLast(index) {
            if(index == this.length - 1) return true;
            return false;
      }

      lastElement() {
            return this[this.length - 1];
      }

      /**
       * 
       * @returns [... , ... , ...] with each element being the first unique element found, evaluated against some comparison property
       */
      uniqueArrayElements() {
            let uniqueElements = [];

            for(let i = 0; i < this.length; i++) {
                  let firstElement = i == 0;
                  if(firstElement) {
                        uniqueElements.push(this[i]);
                        continue;
                  }

                  for(let j = 0; j < uniqueElements.length; j++) {
                        if(this[i] == uniqueElements[j]) {
                              break;
                        }
                        if(j == uniqueElements.length - 1) {
                              uniqueElements.push(this[i]);
                        }
                  }
            }
            return uniqueElements;
      }
}