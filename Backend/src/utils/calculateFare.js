// calculateFare.js       # Fare estimation logic

const calculateFare = (distanceInKm) => {
  const baseFare = 50;        // base charge
  const perKmRate = 5;       // per km rate

  if (!distanceInKm || distanceInKm <= 0) return baseFare;

  return Math.round(baseFare + distanceInKm * perKmRate);
};

export default calculateFare;