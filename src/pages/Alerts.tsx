
import { useState, useEffect } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Attack, getSeverityBadgeColor } from "@/utils/data";
import { useToast } from "@/hooks/use-toast";

const Alerts = () => {
  const [recentAttacks, setRecentAttacks] = useState<Attack[]>([]);
  const [highSeverityAttacks, setHighSeverityAttacks] = useState<Attack[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load attacks from localStorage
    const storedAttacks = localStorage.getItem('attacks');
    let attacks: Attack[] = [];
    
    if (storedAttacks) {
      try {
        attacks = JSON.parse(storedAttacks);
        // Sort by timestamp (newest first)
        attacks.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Get the 10 most recent attacks
        setRecentAttacks(attacks.slice(0, 10));
        
        // Filter high and critical severity attacks
        const highSeverity = attacks.filter(
          attack => attack.severity === "high" || attack.severity === "critical"
        ).slice(0, 10);
        
        setHighSeverityAttacks(highSeverity);
        
        // Show toast for the most recent attack if it's high severity
        if (attacks.length > 0 && 
            (attacks[0].severity === "high" || attacks[0].severity === "critical")) {
          toast({
            title: `${attacks[0].severity.toUpperCase()} Severity Alert!`,
            description: `Detected ${attacks[0].attackType} attack.`,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error parsing stored attacks:", err);
      }
    }
  }, [toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Security Alerts</h1>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-muted-foreground">
              {highSeverityAttacks.length} high severity alerts
            </span>
          </div>
        </div>

        {highSeverityAttacks.length > 0 && (
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>High Severity Alerts Detected</AlertTitle>
            <AlertDescription>
              {highSeverityAttacks.length} high severity attacks have been detected. 
              Review them immediately.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Attack Type</TableHead>
                      <TableHead>Payload</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAttacks.length > 0 ? (
                      recentAttacks.map((attack) => (
                        <TableRow key={attack.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{format(new Date(attack.timestamp), "HH:mm:ss")}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(attack.timestamp), "yyyy-MM-dd")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{attack.ip}</span>
                              <span className="text-xs text-muted-foreground">{attack.country || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="terminal-text text-xs">{attack.path}</TableCell>
                          <TableCell>{attack.attackType}</TableCell>
                          <TableCell>
                            <span className="text-xs font-mono truncate block max-w-32" title={attack.payload}>
                              {attack.payload.length > 32 
                                ? `${attack.payload.substring(0, 32)}...` 
                                : attack.payload}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityBadgeColor(attack.severity)}`}>
                              {attack.severity.charAt(0).toUpperCase() + attack.severity.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {attack.blocked ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant="outline">Detected</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No alerts to display
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">High Severity Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Attack Type</TableHead>
                      <TableHead>Payload</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {highSeverityAttacks.length > 0 ? (
                      highSeverityAttacks.map((attack) => (
                        <TableRow key={attack.id} className="bg-red-50/10">
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{format(new Date(attack.timestamp), "HH:mm:ss")}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(attack.timestamp), "yyyy-MM-dd")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{attack.ip}</span>
                              <span className="text-xs text-muted-foreground">{attack.country || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="terminal-text text-xs">{attack.path}</TableCell>
                          <TableCell>{attack.attackType}</TableCell>
                          <TableCell>
                            <span className="text-xs font-mono truncate block max-w-32" title={attack.payload}>
                              {attack.payload.length > 32 
                                ? `${attack.payload.substring(0, 32)}...` 
                                : attack.payload}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityBadgeColor(attack.severity)}`}>
                              {attack.severity.charAt(0).toUpperCase() + attack.severity.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {attack.blocked ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant="outline">Detected</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No high severity alerts to display
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;
