import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers, Zap, Target, Database, TrendingUp } from "lucide-react";

export default function ModelDescription() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 gradient-text">AI Model Architecture</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore the cutting-edge machine learning models powering ExoQuest's exoplanet detection capabilities.
        </p>
      </div>

      {/* Model Tabs */}
      <Tabs defaultValue="kepler" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 glass-card p-2">
          <TabsTrigger value="kepler" className="data-[state=active]:gradient-cosmic">
            Kepler Model
          </TabsTrigger>
          <TabsTrigger value="k2" className="data-[state=active]:gradient-cosmic">
            K2 Model
          </TabsTrigger>
          <TabsTrigger value="tess" className="data-[state=active]:gradient-cosmic">
            TESS Model
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kepler">
          <ModelCard
            mission="Kepler"
            description="Trained on NASA's Kepler mission data (2009-2018), this model analyzes over 150,000 stars and identifies exoplanets using transit photometry."
            algorithm="Random Forest Classifier with 500 estimators"
            accuracy="96.8%"
            features={[
              "Orbital Period",
              "Transit Duration",
              "Transit Depth",
              "Planetary Radius",
              "Stellar Parameters",
              "Signal-to-Noise Ratio"
            ]}
          />
        </TabsContent>

        <TabsContent value="k2">
          <ModelCard
            mission="K2"
            description="Built on K2 mission data (2014-2018), leveraging the same spacecraft with optimized algorithms for the extended mission's different observation strategy."
            algorithm="Gradient Boosting Classifier (XGBoost)"
            accuracy="95.3%"
            features={[
              "Transit Time",
              "Impact Parameter",
              "Stellar Magnitude",
              "Planetary Temperature",
              "Eccentricity",
              "Semi-major Axis"
            ]}
          />
        </TabsContent>

        <TabsContent value="tess">
          <ModelCard
            mission="TESS"
            description="Trained on TESS (Transiting Exoplanet Survey Satellite) data from 2018 onwards, optimized for all-sky survey observations with shorter observation periods."
            algorithm="Deep Neural Network (5 layers, 256 neurons)"
            accuracy="97.2%"
            features={[
              "Transit Frequency",
              "Light Curve Morphology",
              "Stellar Classification",
              "Planetary Equilibrium Temp",
              "Insolation Flux",
              "Density Estimation"
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Model Pipeline */}
      <div className="glass-card rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center gap-3">
          <Layers className="w-8 h-8 text-primary" />
          Model Pipeline
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <PipelineStep
            number={1}
            title="Data Ingestion"
            description="CSV upload with validation and format checking"
            icon={<Database className="w-6 h-6" />}
          />
          <PipelineStep
            number={2}
            title="Preprocessing"
            description="Feature scaling, normalization, and missing value handling"
            icon={<Zap className="w-6 h-6" />}
          />
          <PipelineStep
            number={3}
            title="Model Inference"
            description="Multi-model ensemble prediction with confidence scoring"
            icon={<Brain className="w-6 h-6" />}
          />
          <PipelineStep
            number={4}
            title="Classification"
            description="Final categorization: Confirmed, Candidate, or False Positive"
            icon={<Target className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          title="Overall Accuracy"
          value="96.4%"
          description="Across all three mission datasets"
          icon={<TrendingUp className="w-8 h-8" />}
          gradient="from-primary to-accent"
        />
        <MetricCard
          title="False Positive Rate"
          value="2.1%"
          description="Minimized through ensemble methods"
          icon={<Target className="w-8 h-8" />}
          gradient="from-secondary to-primary"
        />
        <MetricCard
          title="Processing Speed"
          value="< 3s"
          description="Average inference time per dataset"
          icon={<Zap className="w-8 h-8" />}
          gradient="from-accent to-secondary"
        />
      </div>
    </div>
  );
}

function ModelCard({
  mission,
  description,
  algorithm,
  accuracy,
  features,
}: {
  mission: string;
  description: string;
  algorithm: string;
  accuracy: string;
  features: string[];
}) {
  return (
    <Card className="glass-card border-border/50 mt-6">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">{mission} Mission Model</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground mb-1">Algorithm</p>
            <p className="font-semibold text-primary">{algorithm}</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
            <p className="font-semibold text-secondary text-2xl">{accuracy}</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            Key Features Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="outline" className="border-accent/50 text-accent">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineStep({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center group">
      <div className="relative inline-block mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold text-xl group-hover:animate-pulse-glow transition-all">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card className="glass-card border-border/50 hover:scale-105 transition-transform">
      <CardContent className="p-6">
        <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${gradient} mb-4`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
        <p className="text-4xl font-bold gradient-text mb-2">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
