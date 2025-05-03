class Powdercoat {

      /**
       * 
       * @param {*} areaM2 
       * @param {*} coatMethod - "Coat Only", "Prime and Coat", "Blast and Coat", "Blast, Prime and Coat"
       * @returns cost
       */
      static cost(areaM2, coatMethod) {
            switch(coatMethod) {
                  case "Coat Only": return 35 * areaM2;
                  case "Prime and Coat": return 70 * areaM2;
                  case "Blast and Coat": return 70 * areaM2;
                  case "Blast, Prime and Coat": return 105 * areaM2;
                  default: return 0;
            }
      }
}