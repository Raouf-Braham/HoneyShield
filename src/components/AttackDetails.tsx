
import { useState } from "react";
import { Attack } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getSeverityBadgeColor } from "@/utils/data";

interface AttackDetailsProps {
  attack: Attack;
}

const AttackDetails = ({ attack }: AttackDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Attack Details</CardTitle>
          <Badge className={`${getSeverityBadgeColor(attack.severity)}`}>
            {attack.severity.charAt(0).toUpperCase() + attack.severity.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payload">Payload</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-2 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">IP Address</span>
                <span className="font-mono text-sm">{attack.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Timestamp</span>
                <span className="font-mono text-sm">
                  {format(new Date(attack.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">URL Path</span>
                <span className="font-mono text-sm">{attack.path}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Attack Type</span>
                <span className="font-mono text-sm">{attack.attackType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Location</span>
                <span className="font-mono text-sm">{attack.city ? `${attack.city}, ${attack.country}` : "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant={attack.blocked ? "destructive" : "outline"}>
                  {attack.blocked ? "Blocked" : "Detected"}
                </Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payload" className="mt-2">
            <div className="rounded-md bg-secondary p-4 mt-2">
              <pre className="terminal-text text-xs whitespace-pre-wrap">
                {attack.payload || "No payload captured"}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="headers" className="mt-2">
            <div className="rounded-md bg-secondary p-4 mt-2">
              <pre className="terminal-text text-xs whitespace-pre-wrap">
                {`User-Agent: ${attack.userAgent}
Referer: https://example.com/search
X-Forwarded-For: ${attack.ip}
Accept: text/html,application/xhtml+xml
Accept-Language: en-US,en;q=0.9
Connection: keep-alive`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttackDetails;
