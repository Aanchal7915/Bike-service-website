/**
 * Basic bike price estimator based on year, km driven, condition
 */
const estimateBikePrice = ({ brand, model, year, kmDriven, condition, engineCC }) => {
  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - year;

  // Base prices by engine CC range
  let basePrice = 60000;
  if (engineCC >= 150 && engineCC < 200) basePrice = 90000;
  else if (engineCC >= 200 && engineCC < 400) basePrice = 130000;
  else if (engineCC >= 400) basePrice = 250000;

  // Depreciation: ~15% per year
  const depreciationFactor = Math.pow(0.85, ageYears);

  // Km-driven deduction
  const kmDeduction = Math.min(kmDriven * 0.5, basePrice * 0.4);

  // Condition multiplier
  const conditionMultipliers = {
    excellent: 1.0,
    good: 0.9,
    fair: 0.75,
    poor: 0.55,
  };
  const conditionFactor = conditionMultipliers[condition] || 0.8;

  const estimated = Math.round((basePrice * depreciationFactor - kmDeduction) * conditionFactor);
  return Math.max(estimated, 5000); // min Rs. 5000
};

module.exports = { estimateBikePrice };
