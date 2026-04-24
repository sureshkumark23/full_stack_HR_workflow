export const fetchAutomations = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8080/automations');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch automations:', error);
    // Fallback just in case the server is down
    return [{ id: 'error', name: 'Server Offline', icon: 'AlertCircle' }];
  }
};