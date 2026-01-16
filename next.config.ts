import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public", // Dónde se guardará el service worker
  cacheOnFrontEndNav: true, // Hace que la navegación se sienta instantánea
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true, // Recarga si recuperas conexión
  disable: process.env.NODE_ENV === "development", // Desactivar en desarrollo para no molestar
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* Tus opciones de configuración previas irían aquí */
};

export default withPWA(nextConfig);