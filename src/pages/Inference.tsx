import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Sparkles, Info, CheckCircle, AlertCircle, GitCompare  } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FEATURE_MAP, FEATURE_ORDER, type ModelKey } from "@/lib/featureMaps";
import { FileDown, FileJson } from "lucide-react";
import { useMemo, useEffect } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";




export default function Inference() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

// Features user can choose to visualize (supports common aliases + spaced headers)
const FEATURE_CHOICES = [
  { label: "Planet Orbital Period", keys: ["Planet Orbital Period", "planet_orbital_period", "pl_orbper", "orbital_period"] },
  { label: "Planet Radius",         keys: ["Planet Radius", "planet_radius", "pl_rade", "radius"] },
  { label: "Transit Duration",      keys: ["Transit Duration", "transit_duration", "pl_trandurh", "transit_dur", "duration_hours"] },
];

  const [metricKey, setMetricKey] = useState<string>("");


  const modelKey = (selectedModel || 'kepler') as ModelKey; // or show nothing until chosen
  const spec = FEATURE_MAP[selectedModel as ModelKey];
  const ordered = spec
    ? (FEATURE_ORDER[modelKey].length
        ? FEATURE_ORDER[modelKey].map(k => [k, spec[k]])
        : Object.entries(spec))
    : [];


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} is ready for analysis`,
      });
    }
  };

  const handlePredict = async () => {
    if (!file || !selectedModel) {
      toast({
        title: "Missing information",
        description: "Please select a model and upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', selectedModel);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Prediction failed');
      }

      const data = await response.json();
      setResults(data.results);
      
      toast({
        title: "Analysis complete",
        description: `Processed ${data.total} observations using ${data.model_used} model`,
      });
    } catch (error) {
      toast({
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "Failed to process the file",
        variant: "destructive",
      });
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert results[] → CSV string
const resultsToCSV = (rows: any[]) => {
  if (!rows.length) return "";
  const keys = getOrderedKeys(rows);
  const header = keys.join(",");
  const lines = rows.map(r =>
    keys.map(k => {
      let v = r[k];
      if (k === "Porbability Score") v = `${Number(v).toFixed(2)}%`;
      else if (typeof v === "number") v = Number(v).toFixed(2);
      return `"${v}"`;
    }).join(",")
  );
  return [header, ...lines].join("\n");
};

// Helper to trigger file download
const downloadText = (filename: string, text: string, mime = "text/csv") => {
  const blob = new Blob([text], { type: mime });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const handleDownloadCSV = () => {
  if (!results.length) return;
  const csv = resultsToCSV(results);
  downloadText("exoquest_predictions.csv", csv, "text/csv;charset=utf-8;");
};

const handleDownloadJSON = () => {
  if (!results.length) return;
  const json = JSON.stringify(results, null, 2);
  downloadText("exoquest_predictions.json", json, "application/json;charset=utf-8;");
};

const getOrderedKeys = (rows: any[]) => {
  if (!rows.length) return [];
  const base = ["star_id", "classification", "Porbability Score"];
  const rest = Object.keys(rows[0]).filter(
    (k) => !base.includes(k) && k !== "id"
  );
  return [...base, ...rest];
};

// ---- Charts data helpers ----
const CLASS_COLORS: Record<string, string> = {
  "CONFIRMED": "#22c55e",       // green
  "CANDIDATE": "#f59e0b",       // amber-yellow
  "FALSE POSITIVE": "#ef4444",  // red
  "UNKNOWN": "#a3a3a3"          // gray
};
// ----- chart data (safe useMemo at top level) -----
const pieData = useMemo(() => {
  if (!results?.length) return [];
  const counts: Record<string, number> = {};
  for (const r of results) {
    const cls = String(r.classification || "UNKNOWN").toUpperCase();
    counts[cls] = (counts[cls] || 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}, [results]);

const barData = useMemo(() => {
  if (!results?.length || !metricKey) return [] as { classification: string; value: number }[];
  const groups: Record<string, number[]> = {};
  for (const r of results) {
    const cls = String(r.classification || "UNKNOWN").toUpperCase();
    const v = Number(r[metricKey]);
    if (Number.isFinite(v)) (groups[cls] ||= []).push(v);
  }
  return Object.entries(groups).map(([classification, arr]) => ({
    classification,
    value: arr.reduce((a, b) => a + b, 0) / arr.length,
  }));
}, [results, metricKey]);


// ---- visual styles for charts ----
const TICK_COLOR = "#94a3b8"; // tailwind slate-400
const LEGEND_STYLE = { color: "#cbd5e1", fontSize: 12 }; // slate-300

const getGradId = (name: string) => `grad-${name.replace(/\s/g, "-").toLowerCase()}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="glass-card border border-border/50 px-3 py-2 rounded-lg shadow-md">
      <div className="text-xs text-muted-foreground">{label || p.name}</div>
      <div className="text-sm font-semibold" style={{ color: p.color || "white" }}>
        {p.name || p.dataKey}: {Number(p.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

const featureOptions = useMemo(() => {
  if (!results?.length) return [];
  const cols = Object.keys(results[0]);

  // map lowercased -> original so we can return the exact key that exists
  const colsMap = new Map(cols.map(c => [c.toLowerCase(), c]));

  return FEATURE_CHOICES.flatMap(opt => {
    const found = opt.keys
      .map(k => colsMap.get(k.toLowerCase()))
      .find(Boolean);
    return found ? [{ label: opt.label, key: found as string }] : [];
  });
}, [results]);


useEffect(() => {
  if (featureOptions.length && !metricKey) setMetricKey(featureOptions[0].key);
}, [featureOptions, metricKey]);


  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Exoplanet Inference</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload your observation data and let our AI models identify potential exoplanets
        </p>
      </div>

      {/* Upload Section */}
      <Card className="glass-card border-border/50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Data Upload & Model Selection
          </CardTitle>
          <CardDescription>
            Select a trained model and upload your CSV file containing transit observations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Mission Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="glass-card border-border/50">
                <SelectValue placeholder="Choose a model..." />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                <SelectItem value="kepler">Kepler Mission (87% accuracy)</SelectItem>
                <SelectItem value="k2">K2 Mission (92% accuracy)</SelectItem>
                <SelectItem value="tess">TESS Mission (77% accuracy)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload CSV File</label>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 transition-colors cursor-pointer glass-card"
              >
                <Upload className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <p className="font-medium">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-muted-foreground">CSV files only</p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handlePredict}
              disabled={!file || !selectedModel || isLoading}
              className="flex-1 gradient-cosmic glow-primary"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Predict Exoplanets
                </>
              )}
            </Button>

            {/* <Link to="/dashboard" className="flex-[1]">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-secondary/50 gradient-cosmic glow-primary"
                disabled={!file || !selectedModel || isLoading}
              >
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Data to Training
              </Button>
            </Link> */}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="border-primary/50">
                  <Info className="w-5 h-5 mr-2" />
                  Expected Columns
                </Button>
              </DialogTrigger>
              
              <DialogContent className="glass-card border-border/50 max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="gradient-text">Required Dataset Columns</DialogTitle>
                  <DialogDescription>
                    {selectedModel
                      ? <>Columns expected for the <b>{selectedModel.toUpperCase()}</b> model.</>
                      : 'Pick a model to see its required columns.'}
                  </DialogDescription>
                </DialogHeader>

                {/* Scrollable section */}
                <div className="space-y-4 mt-4">
                  {!selectedModel && <p className="text-muted-foreground">No model selected.</p>}
                  {selectedModel && ordered.map(([name, info]) => (
                    <DatasetColumn
                      key={name as string}
                      name={name as string}
                      description={(info as any).description}
                      type={(info as any).type}
                    />
                  ))}
                </div>
              </DialogContent>


            </Dialog>
          </div>
        </CardContent>
      </Card>
{/* Charts: pie + bar side by side (blended styling) */}
{results.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 mb-10">
    {/* PIE — donut with soft stroke + legend */}
    <div className="glass-card border-border/50 rounded-xl p-4 shadow-lg backdrop-blur-md bg-gradient-to-b from-background/70 to-background/40">
      <h3 className="text-lg font-semibold mb-3">Prediction Proportions</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          {/* gradients for nicer depth */}
          <defs>
            {pieData.map(d => (
              <linearGradient id={getGradId(d.name)} key={d.name} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={CLASS_COLORS[d.name] || CLASS_COLORS["UNKNOWN"]} stopOpacity="0.7" />
                <stop offset="100%" stopColor={CLASS_COLORS[d.name] || CLASS_COLORS["UNKNOWN"]} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>

          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={104}
            startAngle={90}
            endAngle={450}
            paddingAngle={2}
            cornerRadius={6}
            stroke="#0f172a80"     // slate-900/50 ring
            strokeWidth={2}
            isAnimationActive
            animationDuration={600}
          >
            {pieData.map((entry, idx) => (
              <Cell key={`slice-${idx}`} fill={`url(#${getGradId(entry.name)})`} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={LEGEND_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* BAR — rounded bars, selectable metric */}
<div className="glass-card border-border/50 rounded-xl p-4">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="text-lg font-semibold">
        Average {metricKey ? metricKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Metric"} by Class
      </h3>
      <p className="text-sm text-muted-foreground">
        Pick a feature to summarize by classification.
      </p>
    </div>

    {/* Feature selector */}
    <div className="min-w-[220px]">
      <Select value={metricKey} onValueChange={setMetricKey}>
        <SelectTrigger className="glass-card border-border/50 h-9">
          <SelectValue placeholder="Choose a feature…" />
        </SelectTrigger>
        <SelectContent className="glass-card border-border/50">
          {featureOptions.map(opt => (
            <SelectItem key={opt.key} value={opt.key}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  <ResponsiveContainer width="100%" height={260}>
    <BarChart data={(() => {
      if (!results?.length || !metricKey) return [];
      const groups: Record<string, number[]> = {};
      for (const r of results) {
        const cls = String(r.classification || "UNKNOWN").toUpperCase();
        const v = Number(r[metricKey]);
        if (Number.isFinite(v)) (groups[cls] ||= []).push(v);
      }
      return Object.entries(groups).map(([classification, arr]) => ({
        classification,
        value: arr.reduce((a, b) => a + b, 0) / arr.length,
      }));
    })()} barSize={36}>
      <XAxis dataKey="classification" tick={{ fill: TICK_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: TICK_COLOR, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
      <Tooltip content={<CustomTooltip />}
        cursor={{ fill: "transparent" }} />
      <Bar
        dataKey="value"
        radius={[10, 10, 0, 0]}
        isAnimationActive={false}
        activeBar={false}
        background={false}
      >
        {["FALSE POSITIVE", "CANDIDATE", "CONFIRMED"].map((cls, i) => (
          <Cell key={i} fill={CLASS_COLORS[cls] || "#a3a3a3"} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

  </div>
)}



          {results.length > 0 && (
            <Card className="glass-card border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-accent" />
                  Prediction Results
                </CardTitle>
                <CardDescription>
                  AI-powered classification of {results.length} observations
                </CardDescription>
                <div className="flex gap-2 mt-2 justify-end ml-auto">
                  <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                    <FileDown className="w-4 h-4 mr-2" /> Download CSV
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownloadJSON}>
                    <FileJson className="w-4 h-4 mr-2" /> JSON
                  </Button>
                </div>

              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {["star_id", "classification", "Porbability Score"]
                          .concat(
                            Object.keys(results[0]).filter(
                              (k) =>
                                !["star_id", "classification", "Porbability Score", "id"].includes(k)
                            )
                          )
                          .map((key) => (
                            <TableHead key={key}>
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {results.map((row, i) => (
                        <TableRow key={i} className="hover:bg-primary/5">
                          {["star_id", "classification", "Porbability Score"]
                            .concat(
                              Object.keys(row).filter(
                                (k) =>
                                  !["star_id", "classification", "Porbability Score", "id"].includes(k)
                              )
                            )
                            .map((key) => (
                              <TableCell key={key}>
                                {key === "classification" ? (
                                  <span
                                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
                                        row[key] === "CANDIDATE"
                                          ? "bg-amber-100 text-amber-800 border border-amber-400 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-500/50"
                                          : row[key] === "CONFIRMED"
                                          ? "bg-green-100 text-green-800 border border-green-400 dark:bg-green-900/40 dark:text-green-300 dark:border-green-500/50"
                                          : row[key] === "FALSE POSITIVE"
                                          ? "bg-red-100 text-red-800 border border-red-400 dark:bg-red-900/40 dark:text-red-300 dark:border-red-500/50"
                                          : "bg-gray-100 text-gray-800 border border-gray-400 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600/50"
                                      }`}
                                    >
                                      {row[key]}
                                    </span>
                                ) : key === "Porbability Score" ? (
                                  <span className="font-semibold text-primary">
                                    {Number(row[key]).toFixed(2)}%
                                  </span>
                                ) : (
                                  <span className="font-mono">
                                    {typeof row[key] === "number"
                                      ? Number(row[key]).toFixed(2)
                                      : row[key]}
                                  </span>
                                )}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

    </div>
  );
}

function DatasetColumn({ name, description, type }: { name: string; description: string; type: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <code className="text-primary font-mono text-sm">{name}</code>
        <Badge variant="outline" className="text-xs">
          {type}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ClassificationBadge({ classification }: { classification: string }) {
  const config = {
    Confirmed: { icon: CheckCircle, className: "bg-secondary/20 text-secondary border-secondary/50" },
    Candidate: { icon: AlertCircle, className: "bg-primary/20 text-primary border-primary/50" },
    "False Positive": { icon: AlertCircle, className: "bg-destructive/20 text-destructive border-destructive/50" },
  };

  const { icon: Icon, className } = config[classification as keyof typeof config] || config.Candidate;

  return (
    <Badge variant="outline" className={`${className} flex items-center gap-1 w-fit`}>
      <Icon className="w-3 h-3" />
      {classification}
    </Badge>
  );
}
