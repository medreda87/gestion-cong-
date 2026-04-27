import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyData = [
  { month: "Jan", conges: 12, maladies: 4 },
  { month: "Fév", conges: 8, maladies: 6 },
  { month: "Mar", conges: 15, maladies: 3 },
  { month: "Avr", conges: 10, maladies: 5 },
  { month: "Mai", conges: 18, maladies: 2 },
  { month: "Juin", conges: 22, maladies: 4 },
];

const leaveTypeData = [
  { name: "Congé annuel", value: 45, color: "hsl(217, 91%, 40%)" },
  { name: "Congé maladie", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Congé exceptionnel", value: 15, color: "hsl(142, 71%, 45%)" },
  { name: "Congé maternité", value: 10, color: "hsl(280, 67%, 50%)" },
  { name: "Autres", value: 10, color: "hsl(199, 89%, 48%)" },
];

export function MonthlyLeaveChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Évolution mensuelle des congés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="conges" name="Congés" fill="hsl(217, 91%, 40%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="maladies" name="Maladies" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LeaveTypePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Répartition par type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={leaveTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {leaveTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {leaveTypeData.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
