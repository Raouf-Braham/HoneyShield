
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusEndpoint {
  path: string;
  traps: string[];
  status: "active" | "inactive";
}

const endpoints: StatusEndpoint[] = [
  {
    path: "/admin-login",
    traps: ["SQL Injection", "Brute Force"],
    status: "active"
  },
  {
    path: "/search",
    traps: ["XSS", "SSTI"],
    status: "active"
  },
  {
    path: "/backup.sql",
    traps: ["Information Disclosure"],
    status: "active"
  },
  {
    path: "/admin123",
    traps: ["Reconnaissance"],
    status: "active"
  },
  {
    path: "/api/users",
    traps: ["IDOR", "Authorization Bypass"],
    status: "active"
  },
];

const HoneypotStatus = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Honeypot Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <div key={endpoint.path} className="p-3 border border-border rounded-md bg-secondary">
              <div className="flex justify-between items-center mb-2">
                <code className="text-sm font-medium terminal-text">{endpoint.path}</code>
                <Badge variant={endpoint.status === "active" ? "default" : "secondary"}>
                  {endpoint.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {endpoint.traps.map((trap) => (
                  <Badge key={trap} variant="outline" className="text-xs bg-accent">
                    {trap}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <Badge variant="outline" className="bg-primary/20 border-primary/50">
              All honeypot endpoints are operational
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HoneypotStatus;
