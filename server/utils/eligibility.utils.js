/**
 * Core Eligibility Engine
 * Checks a user's profile against a scheme's eligibility criteria
 */

const checkSchemeEligibility = (profile, scheme) => {
  const reasons = [];
  const criteria = scheme.eligibilityCriteria;
  let matchScore = 100;

  // 1. Age check
  if (profile.age < criteria.minAge) {
    reasons.push(`Minimum age required: ${criteria.minAge} years`);
    matchScore -= 30;
  }
  if (profile.age > criteria.maxAge) {
    reasons.push(`Maximum age allowed: ${criteria.maxAge} years`);
    matchScore -= 30;
  }

  // 2. Income check
  if (profile.annualIncome > criteria.maxAnnualIncome) {
    reasons.push(`Annual income must be below ₹${criteria.maxAnnualIncome.toLocaleString('en-IN')}`);
    matchScore -= 40;
  }

  // 3. Category check
  const allowsAllCategories =
    criteria.categories.includes('All') || criteria.categories.length === 0;
  if (!allowsAllCategories && !criteria.categories.includes(profile.category)) {
    reasons.push(`Only for ${criteria.categories.join(', ')} category students`);
    matchScore -= 50;
  }

  // 4. Education level check
  if (criteria.educationLevels && criteria.educationLevels.length > 0) {
    if (!criteria.educationLevels.includes(profile.educationLevel)) {
      reasons.push(`Requires education level: ${criteria.educationLevels.join(' or ')}`);
      matchScore -= 25;
    }
  }

  // 5. State check
  const allowsAllStates = criteria.states.includes('All') || criteria.states.length === 0;
  if (!allowsAllStates && !criteria.states.includes(profile.state)) {
    reasons.push(`Only available in: ${criteria.states.join(', ')}`);
    matchScore -= 30;
  }

  // 6. Gender check
  const allowsAllGenders = criteria.genders.includes('All') || criteria.genders.length === 0;
  if (!allowsAllGenders && !criteria.genders.includes(profile.gender)) {
    reasons.push(`Only for ${criteria.genders.join(', ')} applicants`);
    matchScore -= 20;
  }

  // 7. Disability check
  if (criteria.disabilityRequired && !profile.disabilityStatus) {
    reasons.push('Only for persons with disability (PwD)');
    matchScore -= 40;
  }

  const eligible = reasons.length === 0;
  const finalScore = Math.max(0, matchScore);

  return { eligible, reasons, matchScore: finalScore };
};

/**
 * Run eligibility check across all schemes for a profile
 */
const runEligibilityCheck = (profile, schemes) => {
  const results = schemes.map((scheme) => {
    const { eligible, reasons, matchScore } = checkSchemeEligibility(profile, scheme);
    return {
      scheme: scheme._id,
      schemeData: scheme,
      eligible,
      reasons,
      matchScore,
    };
  });

  const totalEligible = results.filter((r) => r.eligible).length;

  return {
    results,
    totalChecked: schemes.length,
    totalEligible,
  };
};

module.exports = { checkSchemeEligibility, runEligibilityCheck };
