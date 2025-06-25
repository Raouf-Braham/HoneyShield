
import { useState, useEffect } from "react";
import { GlobeIcon, SatelliteDish, Navigation, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Attack, getSeverityBadgeColor } from "@/utils/data";
import MapTilerMap from "@/components/MapTilerMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThreatMap = () => {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [countryCounts, setCountryCounts] = useState<{country: string, count: number, severity: string}[]>([]);

  useEffect(() => {
    // Try to load attacks from localStorage and combine with mock data
    const storedAttacks = localStorage.getItem('attacks');
    let allAttacks = [] as Attack[];
    
    // Define default coordinates for countries to ensure map has markers
    const countryCoordinates: Record<string, [number, number]> = {
      'United States': [-95.7129, 37.0902],
      'China': [104.1954, 35.8617],
      'Russia': [37.6173, 55.7558],
      'India': [78.9629, 20.5937],
      'Germany': [10.4515, 51.1657],
      'Brazil': [-51.9253, -14.2350],
      'United Kingdom': [-3.4359, 55.3781],
      'Canada': [-106.3468, 56.1304],
      'Japan': [138.2529, 36.2048],
      'Australia': [133.7751, -25.2744]
    };
    
    if (storedAttacks) {
      try {
        const parsedAttacks = JSON.parse(storedAttacks);
        // Add coordinates to stored attacks if missing
        const enhancedStoredAttacks = parsedAttacks.map((attack: Attack) => {
          if (!attack.coordinates && attack.country && countryCoordinates[attack.country]) {
            return {
              ...attack,
              coordinates: countryCoordinates[attack.country]
            };
          }
          return attack;
        });
        allAttacks = [...enhancedStoredAttacks];
      } catch (err) {
        console.error("Error parsing stored attacks:", err);
      }
    }
    
    // Add mock attacks with coordinates
    const mockAttacksWithCoordinates = [
      {
        id: "mock-1",
        type: "SQL Injection",
        path: "/login",
        payload: "' OR '1'='1",
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
        severity: "high",
        ip: "103.5.134.2",
        country: "China",
        coordinates: [104.1954, 35.8617]
      },
      {
        id: "mock-2",
        type: "XSS Attempt",
        path: "/search",
        payload: "<script>alert('XSS')</script>",
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        severity: "critical",
        ip: "91.123.45.67",
        country: "Russia",
        coordinates: [37.6173, 55.7558]
      },
      {
        id: "mock-3",
        type: "Path Traversal",
        path: "/api/files",
        payload: "../../../etc/passwd",
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        severity: "normal",
        ip: "172.58.29.11",
        country: "United States",
        coordinates: [-95.7129, 37.0902]
      }
    ];
    
    allAttacks = [...allAttacks, ...mockAttacksWithCoordinates];
    
    setAttacks(allAttacks);
    
    // Aggregate attacks by country
    const countryMap = new Map<string, {count: number, severityScore: number}>();
    
    allAttacks.forEach(attack => {
      if (!attack.country) return;
      
      const country = attack.country;
      const severityScore = attack.severity === 'critical' ? 4 :
                           attack.severity === 'high' ? 3 :
                           attack.severity === 'normal' ? 2 : 1;
      
      if (countryMap.has(country)) {
        const current = countryMap.get(country)!;
        countryMap.set(country, {
          count: current.count + 1,
          severityScore: current.severityScore + severityScore
        });
      } else {
        countryMap.set(country, { count: 1, severityScore });
      }
    });
    
    const countryData = Array.from(countryMap.entries())
      .map(([country, data]) => {
        const avgSeverity = data.severityScore / data.count;
        let severityLabel: string;
        
        if (avgSeverity >= 3.5) severityLabel = "critical";
        else if (avgSeverity >= 2.5) severityLabel = "high";
        else if (avgSeverity >= 1.5) severityLabel = "normal";
        else severityLabel = "low";
        
        return {
          country,
          count: data.count,
          severity: severityLabel
        };
      })
      .sort((a, b) => b.count - a.count);
      
    setCountryCounts(countryData);
    
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Threat Map</h1>
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{attacks.length} total attacks</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Global Attack Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <MapTilerMap attacks={attacks} />
          </CardContent>
        </Card>

        <Tabs defaultValue="countries" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="countries">
              <Navigation className="mr-2 h-4 w-4" /> Attack Sources
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <SatelliteDish className="mr-2 h-4 w-4" /> Regional Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="countries">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Top Attack Sources</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {countryCounts.map((item) => (
                    <div key={item.country} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityBadgeColor(item.severity)}>
                          {item.count} attacks
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {countryCounts.map((item) => (
                    <div
                      key={item.country}
                      className="p-4 rounded-md border flex flex-col items-center justify-center text-center gap-2"
                    >
                      <div className="text-2xl font-bold">{item.count}</div>
                      <Badge className={getSeverityBadgeColor(item.severity)}>
                        {item.severity}
                      </Badge>
                      <div className="text-sm font-medium">{item.country}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ThreatMap;
