import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Database, Zap } from "lucide-react";

export default function Dashboard() {
  // Mock data for charts
  const accuracyData = [
    { name: "Kepler", train: 98.5, test: 96.8 },
    { name: "K2", train: 97.2, test: 95.3 },
    { name: "TESS", train: 98.9, test: 97.2 },
  ];

  const classDistribution = [
    { name: "Confirmed", value: 2341, color: "hsl(193, 82%, 50%)" },
    { name: "Candidate", value: 1876, color: "hsl(32, 95%, 55%)" },
    { name: "False Positive", value: 892, color: "hsl(330, 81%, 65%)" },
  ];

  const performanceMetrics = [
    { metric: "Precision", kepler: 96.2, k2: 94.8, tess: 96.9 },
    { metric: "Recall", kepler: 95.8, k2: 93.5, tess: 97.0 },
    { metric: "F1-Score", kepler: 96.0, k2: 94.1, tess: 96.9 },
  ];

  const featureImportance = [
    { feature: "Orbital Period", importance: 0.28 },
    { feature: "Transit Depth", importance: 0.24 },
    { feature: "Planet Radius", importance: 0.19 },
    { feature: "Transit Duration", importance: 0.15 },
    { feature: "Stellar Temp", importance: 0.08 },
    { feature: "Impact Parameter", importance: 0.06 },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Analytics Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive model performance metrics and data insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Total Predictions"
          value="5,109"
          change="+12.3%"
          icon={<Database className="w-6 h-6" />}
          gradient="from-primary to-accent"
        />
        <MetricCard
          title="Avg Accuracy"
          value="96.4%"
          change="+2.1%"
          icon={<Target className="w-6 h-6" />}
          gradient="from-secondary to-primary"
        />
        <MetricCard
          title="Confirmed Planets"
          value="2,341"
          change="+8.7%"
          icon={<TrendingUp className="w-6 h-6" />}
          gradient="from-accent to-secondary"
        />
        <MetricCard
          title="Processing Speed"
          value="2.8s"
          change="-15%"
          icon={<Zap className="w-6 h-6" />}
          gradient="from-primary to-secondary"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="accuracy" className="mb-12">
        <TabsList className="grid w-full grid-cols-4 glass-card p-2">
          <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
          <TabsTrigger value="distribution">Classification</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="features">Feature Impact</TabsTrigger>
        </TabsList>

        {/* Train vs Test Accuracy */}
        <TabsContent value="accuracy">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="gradient-text">Training vs Testing Accuracy</CardTitle>
              <CardDescription>
                Comparison of model performance on training and testing datasets across missions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[90, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="train" fill="hsl(32, 95%, 55%)" name="Training Accuracy" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="test" fill="hsl(193, 82%, 50%)" name="Testing Accuracy" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classification Distribution */}
        <TabsContent value="distribution">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="gradient-text">Classification Distribution</CardTitle>
              <CardDescription>
                Breakdown of exoplanet classifications across all analyzed observations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {classDistribution.map((item) => (
                  <div key={item.name} className="text-center p-4 rounded-lg glass-card">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                    <p className="font-semibold text-2xl gradient-text">{item.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="gradient-text">Model Performance Metrics</CardTitle>
              <CardDescription>
                Precision, recall, and F1-score comparison across all mission models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[90, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="kepler" stroke="hsl(32, 95%, 55%)" strokeWidth={3} name="Kepler" />
                  <Line type="monotone" dataKey="k2" stroke="hsl(193, 82%, 50%)" strokeWidth={3} name="K2" />
                  <Line type="monotone" dataKey="tess" stroke="hsl(330, 81%, 65%)" strokeWidth={3} name="TESS" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Importance */}
        <TabsContent value="features">
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="gradient-text">Feature Importance Analysis</CardTitle>
              <CardDescription>
                Relative importance of different features in exoplanet classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="importance" fill="url(#colorGradient)" radius={[0, 8, 8, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(32, 95%, 55%)" />
                      <stop offset="50%" stopColor="hsl(330, 81%, 65%)" />
                      <stop offset="100%" stopColor="hsl(193, 82%, 50%)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  const isPositive = change.startsWith("+");
  
  return (
    <Card className="glass-card border-border/50 hover:scale-105 transition-transform">
      <CardContent className="p-6">
        <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${gradient} mb-4`}>
          <div className="text-white">{icon}</div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold gradient-text mb-2">{value}</p>
        <p className={`text-sm font-medium ${isPositive ? "text-secondary" : "text-primary"}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
