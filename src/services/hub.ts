import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useAuthStore } from "@/modules/authentication/store/authStore";

export type TReceiveNotificationPayload = {
  id: string;
  title: string | null;
  message: string | null;
  type: string;
  targetType: "User";
  data: string | null;
  navigations: string | null;
  date: string;
};

type NotificationHandler = (notification: TReceiveNotificationPayload) => void;

const RECEIVE_NOTIFICATION_EVENT = "ReceiveNotification";

const listeners = new Set<NotificationHandler>();

let connection: HubConnection | null = null;
let lifecycleQueue: Promise<void> = Promise.resolve();

const enqueueHubLifecycle = (operation: () => Promise<void>) => {
  lifecycleQueue = lifecycleQueue.then(operation).catch(() => undefined);
};

const getNotificationHubUrl = () => {
  const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL ?? "");
  const hubBase = apiBaseUrl.replace(/\/api\/?$/, "");
  return `${hubBase}/notificationHub`;
};

const emitNotification = (notification: TReceiveNotificationPayload) => {
  for (const handler of listeners) {
    handler(notification);
  }
};

const stopConnection = async () => {
  const current = connection;
  connection = null;

  if (!current) {
    return;
  }

  current.off(RECEIVE_NOTIFICATION_EVENT);

  if (current.state === HubConnectionState.Disconnected) {
    return;
  }

  try {
    await current.stop();
  } catch {
    // Ignore stop failures during teardown.
  }
};

const startConnection = async () => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    await stopConnection();
    return;
  }

  if (
    connection &&
    (connection.state === HubConnectionState.Connected ||
      connection.state === HubConnectionState.Connecting ||
      connection.state === HubConnectionState.Reconnecting)
  ) {
    return;
  }

  await stopConnection();

  const nextConnection = new HubConnectionBuilder()
    .withUrl(getNotificationHubUrl(), {
      accessTokenFactory: () => useAuthStore.getState().accessToken ?? "",
    })
    .withAutomaticReconnect()
    .build();

  nextConnection.on(
    RECEIVE_NOTIFICATION_EVENT,
    (notification: TReceiveNotificationPayload) => {
      emitNotification(notification);
    },
  );

  connection = nextConnection;

  try {
    await nextConnection.start();
  } catch {
    if (connection === nextConnection) {
      connection = null;
    }
  }
};

export const subscribeToNotifications = (handler: NotificationHandler) => {
  listeners.add(handler);

  return () => {
    listeners.delete(handler);
  };
};

export const disconnectHub = () => {
  enqueueHubLifecycle(stopConnection);
};

export const connectHub = () => {
  enqueueHubLifecycle(startConnection);
};
