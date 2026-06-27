export type NormalizedPosition = {
  deviceUniqueId: string;
  protocol: 'osmand';
  deviceTime: Date | null;
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null;
  course: number | null;
  accuracy: number | null;
  raw: Record<string, unknown>;
};

export type StoredPosition = NormalizedPosition & {
  id: number;
  deviceId: number;
  serverTime: Date;
};

