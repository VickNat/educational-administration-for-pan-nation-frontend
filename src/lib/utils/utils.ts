export function setToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token); // Use cookies for better security
    } else {
      localStorage.removeItem('token');
    }
  }
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}