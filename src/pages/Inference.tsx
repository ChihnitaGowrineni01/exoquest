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


export default function Inference() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

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
                <SelectItem value="kepler">Kepler Mission (96.8% accuracy)</SelectItem>
                <SelectItem value="k2">K2 Mission (95.3% accuracy)</SelectItem>
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

            <Link to="/dashboard" className="flex-[1]">
              <Button
                variant="secondary"
                size="lg"
                className="w-full border-secondary/50 gradient-cosmic glow-primary"
                disabled={!file || !selectedModel || isLoading}
              >
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Data to Training
              </Button>
            </Link>

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
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {["star_id", "classification", "confidence"]
                          .concat(
                            Object.keys(results[0]).filter(
                              (k) =>
                                !["star_id", "classification", "confidence", "id"].includes(k)
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
                          {["star_id", "classification", "confidence"]
                            .concat(
                              Object.keys(row).filter(
                                (k) =>
                                  !["star_id", "classification", "confidence", "id"].includes(k)
                              )
                            )
                            .map((key) => (
                              <TableCell key={key}>
                                {key === "classification" ? (
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      row[key] === "CANDIDATE"
                                        ? "bg-blue-900/40 text-blue-300 border border-blue-500/50"
                                        : row[key] === "CONFIRMED"
                                        ? "bg-green-900/40 text-green-300 border border-green-500/50"
                                        : row[key] === "FALSE POSITIVE"
                                        ? "bg-red-900/40 text-red-300 border border-red-500/50"
                                        : "bg-gray-800/40 text-gray-300 border border-gray-600/50"
                                    }`}
                                  >
                                    {row[key]}
                                  </span>
                                ) : key === "confidence" ? (
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
