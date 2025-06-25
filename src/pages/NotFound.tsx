
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// List of honeypot paths to monitor
const HONEYPOT_PATHS = [
  "/backup.sql",
  "/admin123",
  "/wp-admin",
  "/config.php",
  "/.env",
  "/phpinfo.php",
  "/phpmyadmin",
  "/etc/passwd"
];

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;
  
  useEffect(() => {
    // Check if the accessed path is one of our honeypot paths
    const isHoneypot = HONEYPOT_PATHS.includes(path);
    
    if (isHoneypot) {
      console.log(`Honeypot path accessed: ${path}`);
      // In a real implementation, this would log to your backend
    }
    
    console.error(
      "404 Error: User attempted to access non-existent route:",
      path
    );
  }, [path]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        </div>
        
        <p className="max-w-md text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
        
        {/* Hidden links as honeypot */}
        <div style={{ display: "none" }}>
          <a href="/backup.sql">Database Backup</a>
          <a href="/admin123">Admin Portal</a>
          <a href="/config.php">Configuration</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
