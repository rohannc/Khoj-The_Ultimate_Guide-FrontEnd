export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decodedPayload = JSON.parse(decodedJson);
    const expirationTime = decodedPayload.exp * 1000;
    return Date.now() > expirationTime;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return true;
  }
}
