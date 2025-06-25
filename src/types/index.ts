
export interface Attack {
  id: string;
  ip: string;
  timestamp: string;
  path: string;
  userAgent: string;
  payload: string;
  severity: "low" | "normal" | "high" | "critical";
  attackType: string;
  country?: string;
  city?: string;
  blocked: boolean;
}

export interface StatData {
  name: string;
  value: number;
}

export interface TimelineData {
  time: string;
  attacks: number;
}

export interface AttackTypeData {
  name: string;
  value: number;
}

export interface LocationData {
  country: string;
  count: number;
}
