
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="flex justify-center">
          <Shield className="h-20 w-20 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">HoneyShield</h1>
          <p className="text-xl text-muted-foreground">
            Advanced web honeypot system for intrusion detection and threat analysis
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            View Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/admin-login")}>
            Admin Login
          </Button>
        </div>
        
        <div className="grid gap-8 pt-8 md:grid-cols-3">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Detect Attacks</h2>
            <p className="text-muted-foreground">
              Identify malicious behavior with advanced pattern matching and behavioral analysis
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Real-time Alerts</h2>
            <p className="text-muted-foreground">
              Receive instant notifications when suspicious activity is detected
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Comprehensive Analytics</h2>
            <p className="text-muted-foreground">
              Visualize and analyze attack patterns with detailed dashboards
            </p>
          </div>
        </div>
        
        {/* Hidden elements for honeypot */}
        <div style={{ display: "none" }}>
          <input type="hidden" name="admin_password" value="default_password123" />
          <a href="/admin123">Admin Portal</a>
          <a href="/backup.sql">Database Backup</a>
        </div>
      </div>
    </div>
  );
};

export default Index;
