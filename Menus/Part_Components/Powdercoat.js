class Powdercoat {
      static #rateMap = {
            "coat only": 35,
            "prime and coat": 70,
            "blast and coat": 70,
            "blast, prime and coat": 105
      };

      /**
       * Calculate powder coating cost based on area and method.
       * 
       * @param {number} areaM2 - Area in square meters
       * @param {string} coatMethod - One of:
       *     "Coat Only",
       *     "Prime and Coat",
       *     "Blast and Coat",
       *     "Blast, Prime and Coat"
       * @returns {number} Total cost
       */
      static cost(areaM2, coatMethod) {
            if(typeof areaM2 !== 'number' || areaM2 <= 0) {
                  throw new Error("areaM2 must be a positive number.");
            }

            const rate = this.#rateMap[coatMethod?.toLowerCase()];
            if(rate === undefined) {
                  console.warn(`Unknown coat method: "${coatMethod}". Returning cost 0.`);
                  return 0;
            }

            return rate * areaM2;
      }

      /**
       * List all available coating methods.
       * @returns {string[]}
       */
      static getAvailableMethods() {
            return Object.keys(this.#rateMap).map(
                  method => method.replace(/\b\w/g, c => c.toUpperCase())
            );
      }
}