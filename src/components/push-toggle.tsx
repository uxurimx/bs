"use client";
import { useState, useEffect } from "react";
import { subscribeUserAction, unsubscribeUserAction, sendTestNotificationAction } from "@/app/(app)/actions";

// Función auxiliar para convertir la VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar estado inicial al cargar
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setIsSubscribed(true);
        });
      });
    }
  }, []);

  async function handleToggle() {
    setLoading(true);
    if (isSubscribed) {
      // Desuscribirse
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await unsubscribeUserAction();
      setIsSubscribed(false);
    } else {
      // Suscribirse
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      await subscribeUserAction(sub);
      setIsSubscribed(true);
    }
    setLoading(false);
  }

  async function sendTest() {
      await sendTestNotificationAction();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isSubscribed
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Procesando..." : isSubscribed ? "Desactivar Notificaciones" : "Activar Notificaciones"}
        </button>
        
        {isSubscribed && (
            <button onClick={sendTest} className="text-sm text-gray-500 underline">
                Enviarme prueba
            </button>
        )}
      </div>
    </div>
  );
}