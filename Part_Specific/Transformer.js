function getCheapestTransformer(totalAmpRequired, ampTolerance, dimming, voltage) {
      var cheapestPrice = 10000000;
      var orderedArray = [];
      for(var t = 0; t < Transformer.length; t++) {
            if(
                  Transformer[t].dimming == dimming &&
                  Transformer[t].voltage == voltage
            ) {
                  Transformer[t].i_totalComputedPrice =
                        Transformer[t].price *
                        Math.ceil((totalAmpRequired - ampTolerance) / Transformer[t].amp);
                  Transformer[t].i_totalComputedQuantity = Math.ceil(
                        (totalAmpRequired - ampTolerance) / Transformer[t].amp
                  );
                  orderedArray.push(Transformer[t]);
            }
      }
      orderedArray.sort(
            compareCheapestTransformer(totalAmpRequired - ampTolerance)
      );
      return orderedArray[0];
}
function getCheapestTransformersInOrder(totalAmpRequired, ampTolerance, dimming, voltage) {
      var cheapestPrice = 10000000;
      var orderedArray = [];
      for(var t = 0; t < Transformer.length; t++) {
            if(
                  Transformer[t].dimming == dimming &&
                  Transformer[t].voltage == voltage
            ) {
                  Transformer[t].i_totalComputedPrice =
                        Transformer[t].price *
                        Math.ceil((totalAmpRequired - ampTolerance) / Transformer[t].amp);
                  Transformer[t].i_totalComputedQuantity = Math.ceil(
                        (totalAmpRequired - ampTolerance) / Transformer[t].amp
                  );
                  orderedArray.push(Transformer[t]);
            }
      }
      orderedArray.sort(
            compareCheapestTransformer(totalAmpRequired - ampTolerance)
      );
      return orderedArray;
}
function compareCheapestTransformer(totalAmpRequired) {
      return function innerSort(a, b) {
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) >
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            )
                  return 1;
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) <
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            )
                  return -1;
            if(
                  a.price * Math.ceil(totalAmpRequired / a.amp) ==
                  b.price * Math.ceil(totalAmpRequired / b.amp)
            ) {
                  if(a.warranty > b.warranty) return -1;
                  else return 1;
            }
            return 0;
      };
}