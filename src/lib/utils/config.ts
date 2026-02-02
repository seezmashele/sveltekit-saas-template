interface Config {
  backendUrl: string
  frontendUrl: string
}

export const config: Config = {
  // backendUrl: import.meta.env.VITE_BACKEND_URL || 'https://api.example.co.za',
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3220',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5210',
}

export default config
