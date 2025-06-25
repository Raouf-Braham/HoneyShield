
import { useState, useEffect } from "react";
import { History as HistoryIcon } from "lucide-react";
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
import { Attack, mockAttacks, getSeverityBadgeColor } from "@/utils/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AttackDetails from "@/components/AttackDetails";

const History = () => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);

  useEffect(() => {
    // Try to load attacks from localStorage and combine with mock data
    const storedAttacks = localStorage.getItem('attacks');
    let allAttacks = [...mockAttacks];
    
    if (storedAttacks) {
      try {
        const parsedAttacks = JSON.parse(storedAttacks);
        allAttacks = [...parsedAttacks, ...mockAttacks];
      } catch (err) {
        console.error("Error parsing stored attacks:", err);
      }
    }
    
    // Sort by timestamp (newest first)
    allAttacks.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setAttacks(allAttacks);
    if (allAttacks.length > 0) {
      setSelectedAttack(allAttacks[0]);
    }
  }, []);

  const filteredAttacks = attacks.filter(attack => 
    attack.ip.includes(searchTerm) || 
    attack.path.includes(searchTerm) || 
    attack.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attack.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (attack.payload && attack.payload.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Attack History</h1>
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{attacks.length} total records</span>
          </div>
        </div>
        
        <div className="w-full flex justify-between items-center gap-4">
          <Input
            placeholder="Search attacks by IP, path, type, payload or severity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setSearchTerm("")} variant="outline" size="sm">
            Clear
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-md border shadow-sm">
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
                  {filteredAttacks.map((attack) => (
                    <TableRow 
                      key={attack.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${selectedAttack?.id === attack.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedAttack(attack)}
                    >
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
                          {attack.payload && attack.payload.length > 20 
                            ? `${attack.payload.substring(0, 20)}...` 
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {selectedAttack && (
            <div className="md:col-span-1">
              <AttackDetails attack={selectedAttack} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
