self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Nueva Notificación';
  const options = {
    body: data.body || 'Tienes una nueva actualización.',
    icon: '/icon-192.png', // Asegúrate de tener este icono
    badge: '/icon-192.png',
    data: { url: data.url || '/' } // Guardamos la URL para el click
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Al hacer click, abrir la URL
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});