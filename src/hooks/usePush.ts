import { useState, useEffect } from "react";

export function usePushNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const ok =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;
    setSupported(ok);
    if (ok) setPermission(Notification.permission);
  }, []);

  async function requestPermission() {
    if (!supported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      scheduleLocalReminder();
    }
    return result === "granted";
  }

  function scheduleLocalReminder() {
    // Store preference — actual push needs a backend
    // For now we use a local notification check on app open
    localStorage.setItem("truvllo-notifications", "enabled");
    localStorage.setItem("truvllo-reminder-time", "20:00"); // 8pm default
  }

  function disableNotifications() {
    localStorage.removeItem("truvllo-notifications");
    localStorage.removeItem("truvllo-reminder-time");
  }

  async function sendTestNotification() {
    if (permission !== "granted") return;
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification("Truvllo reminder 🌿", {
      body: "Don't forget to log your expenses today! Keep your streak going.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "truvllo-test",
    });
  }

  const isEnabled =
    permission === "granted" &&
    localStorage.getItem("truvllo-notifications") === "enabled";

  return {
    supported,
    permission,
    isEnabled,
    requestPermission,
    disableNotifications,
    sendTestNotification,
  };
}
