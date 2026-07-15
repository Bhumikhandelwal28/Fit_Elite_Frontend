export function extractErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err.response?.data;
  if (!data) return fallback;

  if (data.message) return data.message;

  if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    const firstKey = Object.keys(data.errors)[0];
    return data.errors[firstKey]?.[0] || fallback;
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors[0];
  }


  return fallback;
}