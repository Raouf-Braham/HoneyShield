
import { Attack, StatData, TimelineData, AttackTypeData, LocationData } from "../types";

// Export the imported types to make them available when importing from this file
export type { Attack, StatData, TimelineData, AttackTypeData, LocationData };

// Mock data for attacks
export const mockAttacks: Attack[] = [
  {
    id: "1",
    ip: "45.33.102.89",
    timestamp: "2023-05-08T12:30:45Z",
    path: "/admin-login",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    payload: "admin' OR 1=1--",
    severity: "high",
    attackType: "SQL Injection",
    country: "Russia",
    city: "Moscow",
    blocked: true
  },
  {
    id: "2",
    ip: "103.21.244.2",
    timestamp: "2023-05-08T12:35:12Z",
    path: "/search",
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G960U)",
    payload: "<script>alert(document.cookie)</script>",
    severity: "critical",
    attackType: "XSS",
    country: "China",
    city: "Beijing",
    blocked: true
  },
  {
    id: "3",
    ip: "192.168.1.5",
    timestamp: "2023-05-08T12:40:23Z",
    path: "/backup.sql",
    userAgent: "curl/7.64.1",
    payload: "",
    severity: "normal",
    attackType: "Information Disclosure",
    country: "United States",
    city: "New York",
    blocked: false
  },
  {
    id: "4",
    ip: "91.234.23.45",
    timestamp: "2023-05-08T13:15:02Z",
    path: "/admin123",
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    payload: "",
    severity: "low",
    attackType: "Reconnaissance",
    country: "France",
    city: "Paris",
    blocked: false
  },
  {
    id: "5",
    ip: "185.143.223.67",
    timestamp: "2023-05-08T13:22:18Z",
    path: "/api/users",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    payload: "id=1 OR 1=1",
    severity: "high",
    attackType: "IDOR",
    country: "Iran",
    city: "Tehran",
    blocked: true
  },
  {
    id: "6",
    ip: "35.186.224.25",
    timestamp: "2023-05-08T13:30:40Z",
    path: "/wp-login.php",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124",
    payload: "admin:password123",
    severity: "normal",
    attackType: "Brute Force",
    country: "Brazil",
    city: "Sao Paulo",
    blocked: false
  },
  {
    id: "7",
    ip: "77.123.45.67",
    timestamp: "2023-05-08T13:45:22Z",
    path: "/admin/config",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    payload: "../../../etc/passwd",
    severity: "critical",
    attackType: "Path Traversal",
    country: "Ukraine",
    city: "Kiev",
    blocked: true
  },
  {
    id: "8",
    ip: "104.28.42.10",
    timestamp: "2023-05-08T14:05:11Z",
    path: "/search",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    payload: "{{7*7}}",
    severity: "high",
    attackType: "SSTI",
    country: "Germany",
    city: "Berlin",
    blocked: true
  },
  {
    id: "9",
    ip: "92.63.197.48",
    timestamp: "2023-05-08T14:15:30Z",
    path: "/api/upload",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/91.0.864.59",
    payload: "shell.php",
    severity: "critical",
    attackType: "File Upload",
    country: "Romania",
    city: "Bucharest",
    blocked: true
  },
  {
    id: "10",
    ip: "151.80.44.89",
    timestamp: "2023-05-08T14:25:12Z",
    path: "/api/users/delete/1",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)",
    payload: "",
    severity: "normal",
    attackType: "CSRF",
    country: "Canada",
    city: "Toronto",
    blocked: false
  }
];

// Generate a random ID for new attacks
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Stats data
export const generateStatsData = (): StatData[] => {
  const totalAttacks = mockAttacks.length;
  const blockedAttacks = mockAttacks.filter(attack => attack.blocked).length;
  const highSeverity = mockAttacks.filter(attack => attack.severity === "high" || attack.severity === "critical").length;
  const uniqueIPs = new Set(mockAttacks.map(attack => attack.ip)).size;
  
  return [
    { name: "Total Attacks", value: totalAttacks },
    { name: "Blocked", value: blockedAttacks },
    { name: "High Severity", value: highSeverity },
    { name: "Unique IPs", value: uniqueIPs },
  ];
};

// Timeline data
export const generateTimelineData = (): TimelineData[] => {
  return [
    { time: "00:00", attacks: 0 },
    { time: "03:00", attacks: 2 },
    { time: "06:00", attacks: 1 },
    { time: "09:00", attacks: 3 },
    { time: "12:00", attacks: 5 },
    { time: "15:00", attacks: 4 },
    { time: "18:00", attacks: 7 },
    { time: "21:00", attacks: 2 },
  ];
};

// Attack type distribution data
export const generateAttackTypeData = (): AttackTypeData[] => {
  const attackTypes: Record<string, number> = {};
  
  mockAttacks.forEach(attack => {
    if (attackTypes[attack.attackType]) {
      attackTypes[attack.attackType]++;
    } else {
      attackTypes[attack.attackType] = 1;
    }
  });
  
  return Object.entries(attackTypes).map(([name, value]) => ({ name, value }));
};

// Location data
export const generateLocationData = (): LocationData[] => {
  const locations: Record<string, number> = {};
  
  mockAttacks.forEach(attack => {
    if (attack.country) {
      if (locations[attack.country]) {
        locations[attack.country]++;
      } else {
        locations[attack.country] = 1;
      }
    }
  });
  
  return Object.entries(locations).map(([country, count]) => ({ country, count }));
};

// Get attack patterns for different vulnerabilities
export const attackPatterns = {
  sqlInjection: [
    "' OR '1'='1", 
    "admin' --", 
    "1'; DROP TABLE users; --", 
    "1' UNION SELECT username, password FROM users; --"
  ],
  xss: [
    "<script>alert(1)</script>", 
    "<img src=x onerror=alert('XSS')>", 
    "javascript:alert(document.cookie)"
  ],
  idor: [
    "/api/users/123", 
    "/profile?id=admin"
  ],
  pathTraversal: [
    "../../../etc/passwd", 
    "..%2f..%2f..%2fetc%2fpasswd"
  ],
  commandInjection: [
    "; cat /etc/passwd", 
    "| ls -la"
  ]
};

// Get severity color
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "critical":
      return "text-red-900 bg-red-200";
    case "high":
      return "text-red-700 bg-red-100";
    case "normal":
      return "text-amber-700 bg-amber-100";
    case "low":
      return "text-blue-700 bg-blue-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

export const getSeverityColorFull = (severity: string): string => {
  switch (severity) {
    case "critical":
      return "honeypot-critical";
    case "high":
      return "honeypot-high";
    case "normal":
      return "honeypot-normal";
    case "low":
      return "honeypot-low";
    default:
      return "honeypot-low";
  }
};

export const getSeverityBadgeColor = (severity: string): string => {
  switch (severity) {
    case "critical":
      return "bg-red-900 text-white";
    case "high":
      return "bg-red-600 text-white";
    case "normal":
      return "bg-amber-500 text-white";
    case "low":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
