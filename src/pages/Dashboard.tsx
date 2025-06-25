
import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Shield,
  Fingerprint
} from "lucide-react";

import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import HoneypotChart from "@/components/HoneypotChart";
import AttackTable from "@/components/AttackTable";
import AttackDetails from "@/components/AttackDetails";
import HoneypotStatus from "@/components/HoneypotStatus";

import { 
  Attack,
  mockAttacks,
  generateStatsData,
  generateTimelineData,
  generateAttackTypeData
} from "@/utils/data";

const Dashboard = () => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);
  
  useEffect(() => {
    // Try to load attacks from localStorage
    const storedAttacks = localStorage.getItem('attacks');
    if (storedAttacks) {
      try {
        const parsedAttacks = JSON.parse(storedAttacks);
        // Combine stored attacks with mock data for demo purposes
        const combinedAttacks = [...parsedAttacks, ...mockAttacks];
        setAttacks(combinedAttacks);
        setSelectedAttack(combinedAttacks[0]);
      } catch (err) {
        console.error("Error parsing stored attacks:", err);
        setAttacks(mockAttacks);
        setSelectedAttack(mockAttacks[0]);
      }
    } else {
      // No stored attacks, use mock data
      setAttacks(mockAttacks);
      setSelectedAttack(mockAttacks[0]);
    }
  }, []);

  // Calculate stats based on actual attacks
  const calculateStats = () => {
    const totalAttacks = attacks.length;
    const blockedAttacks = attacks.filter(attack => attack.blocked).length;
    const highSeverity = attacks.filter(attack => attack.severity === "high" || attack.severity === "critical").length;
    const uniqueIPs = new Set(attacks.map(attack => attack.ip)).size;
    
    return [
      { name: "Total Attacks", value: totalAttacks },
      { name: "Blocked", value: blockedAttacks },
      { name: "High Severity", value: highSeverity },
      { name: "Unique IPs", value: uniqueIPs },
    ];
  };

  const stats = calculateStats();
  const timelineData = generateTimelineData();
  const attackTypeData = generateAttackTypeData();

  const handleSelectAttack = (attack: Attack) => {
    setSelectedAttack(attack);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            stat={stats[0]} 
            icon={<ShieldAlert className="h-4 w-4 text-primary" />} 
            description="Total attacks detected in the last 24 hours"
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard 
            stat={stats[1]} 
            icon={<Shield className="h-4 w-4 text-primary" />} 
            description="Attacks successfully blocked"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard 
            stat={stats[2]} 
            icon={<AlertTriangle className="h-4 w-4 text-primary" />} 
            description="High and critical severity attacks"
            trend={{ value: 25, isPositive: false }}
          />
          <StatsCard 
            stat={stats[3]} 
            icon={<Fingerprint className="h-4 w-4 text-primary" />} 
            description="Distinct attackers identified"
            trend={{ value: 5, isPositive: false }}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <HoneypotChart timelineData={timelineData} attackTypeData={attackTypeData} />
          <HoneypotStatus />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AttackTable attacks={attacks} onSelectAttack={handleSelectAttack} />
          {selectedAttack && <AttackDetails attack={selectedAttack} />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
