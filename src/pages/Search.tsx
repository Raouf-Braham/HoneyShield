
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Attack } from "../types";
import { generateRandomId } from "@/utils/data";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [attackType, setAttackType] = useState("");
  const [severity, setSeverity] = useState<"low" | "normal" | "high" | "critical">("low");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to check for common XSS patterns
  const checkForXSS = (input: string): boolean => {
    const xssPatterns = [
      /<script>/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /onclick=/i,
      /alert\s*\(/i,
      /prompt\s*\(/i,
      /confirm\s*\(/i,
      /<img[^>]+src[^>]+=/i
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  };

  // Function to check for SQL injection patterns
  const checkForSQLi = (input: string): boolean => {
    const sqliPatterns = [
      /'\s*or\s*'1'='1/i,
      /'\s*or\s*1=1/i,
      /--/,
      /;\s*drop\s+table/i,
      /union\s+select/i,
      /exec\s*\(/i,
      /SELECT\s+.*FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+.*SET/i,
      /DELETE\s+FROM/i
    ];
    
    return sqliPatterns.some(pattern => pattern.test(input));
  };

  // Function to log attack to localStorage
  const logAttack = (attackData: Partial<Attack>) => {
    const existingAttacks = JSON.parse(localStorage.getItem('attacks') || '[]');
    const newAttack: Attack = {
      id: generateRandomId(),
      ip: "127.0.0.1", // Local simulation
      timestamp: new Date().toISOString(),
      path: "/search",
      userAgent: navigator.userAgent,
      payload: attackData.payload || "",
      severity: attackData.severity || "low",
      attackType: attackData.attackType || "Unknown",
      blocked: true,
      country: "Local",
      city: "Simulation",
      ...attackData
    };
    
    const updatedAttacks = [newAttack, ...existingAttacks];
    localStorage.setItem('attacks', JSON.stringify(updatedAttacks));
    
    // Display toast notification
    toast({
      title: `${newAttack.severity.toUpperCase()} Severity Alert!`,
      description: `Detected ${newAttack.attackType} attack. Details logged.`,
      variant: "destructive",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Search query:", query);
    
    // Check for attack patterns
    if (checkForXSS(query)) {
      console.log("XSS attempt detected:", query);
      setShowAlert(true);
      setAttackType("XSS (Cross-Site Scripting)");
      setSeverity("high");
      logAttack({
        payload: query,
        attackType: "XSS (Cross-Site Scripting)",
        severity: "high"
      });
      return;
    }
    
    if (checkForSQLi(query)) {
      console.log("SQL Injection attempt detected:", query);
      setShowAlert(true);
      setAttackType("SQL Injection");
      setSeverity("critical");
      logAttack({
        payload: query,
        attackType: "SQL Injection",
        severity: "critical"
      });
      return;
    }
    
    // Normal search
    toast({
      title: "Searching",
      description: `Results for "${query}"`,
    });
    
    // Log a low severity regular search
    if (query.trim()) {
      logAttack({
        payload: query,
        attackType: "Regular Search",
        severity: "low",
        blocked: false
      });
    }
    
    // Simulate search delay
    setTimeout(() => {
      // No results in our honeypot
      toast({
        title: "Search complete",
        description: "No results found",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground">Find content across the site</p>
        </div>
        
        {showAlert && (
          <Alert variant="destructive" className="animate-pulse">
            <Shield className="h-4 w-4" />
            <AlertTitle>Attack Detected!</AlertTitle>
            <AlertDescription>
              Potential {attackType} attack detected. This activity has been logged.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="search-query"
                placeholder="Enter search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-12"
              />
              <Button 
                type="submit" 
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
              >
                Search
              </Button>
            </div>
          </div>
          
          {/* Hidden input with SQL suggestion */}
          <input 
            type="hidden" 
            id="sql-hint" 
            name="sql-hint" 
            value="SELECT * FROM users WHERE username = 'input'" 
          />
          
          <div className="pt-4">
            <p className="text-center text-sm text-muted-foreground">
              <a href="/" className="text-primary hover:underline">
                Back to Home
              </a>
              <span className="mx-2">•</span>
              <a href="/dashboard" className="text-primary hover:underline">
                View Dashboard
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Search;
