export function calculateFare(distanceKm, durationMin) {
    const BASE_FARE = 40;

    const PER_KM = 12;

    const PER_MIN = 2;

    return Math.round(
        BASE_FARE +
        distanceKm * PER_KM +
        durationMin * PER_MIN
    );
}

// const calculateFare = (distanceInKm) => {
//   const baseFare = 50;        // base charge
//   const perKmRate = 5;       // per km rate

//   if (!distanceInKm || distanceInKm <= 0) return baseFare;

//   return Math.round(baseFare + distanceInKm * perKmRate);
// };

// export default calculateFare;