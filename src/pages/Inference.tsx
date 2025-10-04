import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Sparkles, Info, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Inference() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

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
                <SelectItem value="tess">TESS Mission (97.2% accuracy)</SelectItem>
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

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="border-primary/50">
                  <Info className="w-5 h-5 mr-2" />
                  Expected Columns
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border/50 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="gradient-text">Required Dataset Columns</DialogTitle>
                  <DialogDescription>
                    Your CSV file should include the following columns for optimal results
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <DatasetColumn
                    name="koi_period"
                    description="Orbital period in days - the time it takes for the planet to complete one orbit"
                    type="float"
                  />
                  <DatasetColumn
                    name="koi_duration"
                    description="Transit duration in hours - how long the planet blocks the star's light"
                    type="float"
                  />
                  <DatasetColumn
                    name="koi_depth"
                    description="Transit depth in parts per million (ppm) - the amount of light blocked"
                    type="float"
                  />
                  <DatasetColumn
                    name="koi_prad"
                    description="Planetary radius in Earth radii - the size of the planet"
                    type="float"
                  />
                  <DatasetColumn
                    name="koi_teq"
                    description="Equilibrium temperature in Kelvin - the planet's estimated surface temperature"
                    type="float"
                  />
                  <DatasetColumn
                    name="koi_insol"
                    description="Insolation flux in Earth flux - the amount of stellar energy received"
                    type="float"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
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
                    <TableHead>Star ID</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Orbital Period (days)</TableHead>
                    <TableHead>Planet Radius (R⊕)</TableHead>
                    <TableHead>Transit Depth (ppm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id} className="hover:bg-primary/5">
                      <TableCell className="font-mono">{result.star_id}</TableCell>
                      <TableCell>
                        <ClassificationBadge classification={result.classification} />
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-primary">{result.confidence}%</span>
                      </TableCell>
                      <TableCell>{result.orbital_period}</TableCell>
                      <TableCell>{result.planet_radius}</TableCell>
                      <TableCell>{result.transit_depth}</TableCell>
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
