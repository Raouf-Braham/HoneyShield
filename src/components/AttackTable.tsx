
import { Attack } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getSeverityBadgeColor } from "@/utils/data";

interface AttackTableProps {
  attacks: Attack[];
  onSelectAttack?: (attack: Attack) => void;
}

const AttackTable = ({ attacks, onSelectAttack }: AttackTableProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Attacks</CardTitle>
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
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attacks.slice(0, 5).map((attack) => (
                <TableRow 
                  key={attack.id} 
                  onClick={() => onSelectAttack?.(attack)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    {format(new Date(attack.timestamp), "HH:mm:ss")}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackTable;
