
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { generateRandomId } from "@/utils/data";
import { Attack } from "../types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [attackType, setAttackType] = useState("");
  const [severity, setSeverity] = useState<"low" | "normal" | "high" | "critical">("low");
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkForMaliciousInput = (username: string, password: string) => {
    // Check for SQL injection
    const sqlInjectionPatterns = [
      /'\s*or\s*'1'='1/i,
      /'\s*or\s*1=1/i,
      /--/,
      /;\s*drop\s+table/i,
      /union\s+select/i,
      /SELECT\s+.*FROM/i,
      /admin'\s*--/i,
      /1'\s*or\s*'1'\s*=\s*'1/i
    ];

    // Check for common username/password pairs (brute force simulation)
    const commonAdminCredentials = [
      { user: "admin", pass: "admin" },
      { user: "admin", pass: "password" },
      { user: "admin", pass: "123456" },
      { user: "root", pass: "toor" },
      { user: "administrator", pass: "administrator" }
    ];

    // Check for SQL injection
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(username) || pattern.test(password)) {
        return {
          isAttack: true,
          type: "SQL Injection",
          severity: "critical" as const
        };
      }
    }

    // Check for common admin credentials
    for (const cred of commonAdminCredentials) {
      if (username === cred.user && password === cred.pass) {
        return {
          isAttack: true,
          type: "Brute Force/Dictionary Attack",
          severity: "high" as const
        };
      }
    }

    // Check for long input (potential buffer overflow simulation)
    if (username.length > 50 || password.length > 50) {
      return {
        isAttack: true,
        type: "Potential Buffer Overflow Attempt",
        severity: "normal" as const
      };
    }

    return { isAttack: false };
  };

  // Function to log attack to localStorage
  const logAttack = (attackData: Partial<Attack>) => {
    const existingAttacks = JSON.parse(localStorage.getItem('attacks') || '[]');
    const newAttack: Attack = {
      id: generateRandomId(),
      ip: "127.0.0.1", // Local simulation
      timestamp: new Date().toISOString(),
      path: "/admin-login",
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

    const payload = `username: ${username}, password: ${password}`;
    console.log("Login attempt:", payload);

    const check = checkForMaliciousInput(username, password);

    if (check.isAttack) {
      console.log(`${check.type} attempt detected`);
      setShowAlert(true);
      setAttackType(check.type);
      setSeverity(check.severity);
      
      logAttack({
        payload,
        attackType: check.type,
        severity: check.severity
      });
      
      return;
    }

    // Regular login attempt (no attack detected)
    if (username.trim() && password.trim()) {
      logAttack({
        payload: `username: ${username}`,
        attackType: "Regular Login Attempt",
        severity: "low",
        blocked: false
      });
    }

    // Show authentication error
    toast({
      title: "Authentication Failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-6 border rounded-lg shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">Enter your credentials to continue</p>
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

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
      </div>
    </div>
  );
};

export default AdminLogin;
