// Save new analysis
export const saveHistory = (analysis) => {
  const history = JSON.parse(localStorage.getItem("analysisHistory")) || [];

  history.unshift(analysis); // newest first

  localStorage.setItem("analysisHistory", JSON.stringify(history));
};

// Get all history
export const getHistory = () => {
  return JSON.parse(localStorage.getItem("analysisHistory")) || [];
};

// Delete one history
export const deleteHistory = (index) => {
  const history = getHistory();

  history.splice(index, 1);

  localStorage.setItem("analysisHistory", JSON.stringify(history));
};

// Clear all history
export const clearHistory = () => {
  localStorage.removeItem("analysisHistory");
};