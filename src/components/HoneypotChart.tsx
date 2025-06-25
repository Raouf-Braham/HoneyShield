
import { useState } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TimelineData, AttackTypeData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HoneypotChartProps {
  timelineData: TimelineData[];
  attackTypeData: AttackTypeData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const HoneypotChart = ({ timelineData, attackTypeData }: HoneypotChartProps) => {
  const [activeTab, setActiveTab] = useState("timeline");

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Attack Analytics</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="attackTypes">Attack Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-2">
            <div className="h-[300px] w-full px-4 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563', color: '#E5E7EB' }} 
                    labelStyle={{ color: '#E5E7EB' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attacks" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 8, stroke: '#1e40af', strokeWidth: 2, fill: '#3b82f6' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="attackTypes" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] w-full px-4 pb-4">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {attackTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563', color: '#E5E7EB' }} 
                      labelStyle={{ color: '#E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attackTypeData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" stroke="#999" />
                    <YAxis type="category" dataKey="name" stroke="#999" width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563', color: '#E5E7EB' }}
                      labelStyle={{ color: '#E5E7EB' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HoneypotChart;
