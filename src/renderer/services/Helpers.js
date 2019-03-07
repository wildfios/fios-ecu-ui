export default class Helpers {
    static closest (data, val) {
        let smallestDiff = Math.abs(val - data[0]);
        let closest = 0; 
  
        for (let i = 1; i < data.length; i++) {
          let currentDiff = Math.abs(val - data[i]);
          if (currentDiff < smallestDiff) {
            smallestDiff = currentDiff;
            closest = i;
          }
        }
        return data[closest];
    }

    static closestIndex (data, val) {
      let smallestDiff = Math.abs(val - data[0]);
      let closest = 0; 

      for (let i = 1; i < data.length; i++) {
        let currentDiff = Math.abs(val - data[i]);
        if (currentDiff < smallestDiff) {
          smallestDiff = currentDiff;
          closest = i;
        }
      }
      return closest;
  }
};