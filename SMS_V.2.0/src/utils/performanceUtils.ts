// Performance utility functions

// Utility function to get performance grade
export const getPerformanceGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// Utility function to get performance color
export const getPerformanceColor = (score: number): string => {
  if (score >= 90) return '#10b981'; // Green
  if (score >= 80) return '#f59e0b'; // Yellow
  if (score >= 70) return '#f97316'; // Orange
  return '#ef4444'; // Red
};