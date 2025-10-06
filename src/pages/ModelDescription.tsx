import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers, Zap, Target, Database, TrendingUp, LineChart  } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LabelList } from "recharts";



export default function ModelDescription() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center mb-16 animate-fade-in space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight drop-shadow-sm">
          Why Our AI?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We are a transparent, data-driven, and easy-to-use platform — ensuring precision, reliability, and trust in every discovery.
        </p>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore the cutting-edge machine learning models powering ExoQuest’s exoplanet detection capabilities.
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mx-auto mt-6 opacity-80"></div>
      </div>

      {/* Model Pipeline */}
      <div className="glass-card rounded-2xl p-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 gradient-text flex items-center gap-3">
          <Layers className="w-8 h-8 text-primary" />
          Our Approach
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <PipelineStep
            number={1}
            title="Preprocessing"
            description="Median imputation for numeric features, one-hot encoding for categoricals, and standardization with a saved feature order."
            icon={<Zap className="w-9 h-9 mt-3 text-primary" />}
          />

          <PipelineStep
            number={2}
            title="Hyperparameter Tuning"
            description="Bayesian over LightGBM/Random Forest hyperparameters, optimized for F1/AUC with cross-validation and early stopping."
            icon={<Database className="w-9 h-9 mt-3 text-primary" />}
          />

          <PipelineStep
            number={3}
            title="Model Training"
            description="Fit the best configuration, handle class imbalance, validate on the hold-out set, and persist artifacts (model, encoder, scaler, medians)."
            icon={<Brain className="w-9 h-9 mt-3 text-primary" />}
          />

          <PipelineStep
            number={4}
            title="Model Inference"
            description="Apply the same preprocessing to uploaded CSVs, generate predictions and confidence scores, and surface top feature importances for transparency."
            icon={<Brain className="w-9 h-9 mt-3 text-primary" />}
          />

          
        </div>
      </div>

      {/* Performance Metrics
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
      </div> */}

      {/* Experiments & Results (colored) */}
      <ExperimentsAndVisualsCard />

      {/* Model Tabs */}

      
      <Tabs defaultValue="kepler" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 glass-card">
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

        <TabsContent value="kepler" className="-mt-5">
          <ModelCard
            mission="Kepler"
            description={
            <span>
              The <strong>Kepler Mission</strong>, launched by NASA in 2009, was designed to discover Earth-sized exoplanets orbiting other stars 
              by monitoring over 150,000 stars for periodic dips in brightness (transits).
              <br /><br />
              The Kepler dataset includes planetary status labels such as  
              <em> PC</em> (planetary candidate), <em>CP</em> (confirmed planet), and <em>FP</em> (false positive). 
              These are standardized into three categories — 
              <strong> Confirmed</strong>, <strong>Candidate</strong>, and <strong>False Positive</strong> — for model training.
              <br /><br />
              A <strong>LightGBM classifier</strong>, optimized with <strong>Bayesian hyperparameter tuning</strong> 
              (via <em>BayesSearchCV</em>) on the <em>macro-F1 score</em>, achieved strong generalization performance:
              <br /><br />
              • <strong>Accuracy:</strong> 87% on test data <br />
              • <strong>Macro-F1:</strong> 83% (Weighted-F1: 87%) <br />
              • <strong>Class-wise F1 Scores:</strong> Confirmed (92%), Candidate (65%), False Positive (92%) <br />
              <br />
              <strong>Observation:</strong> The <strong>CANDIDATE</strong> class demonstrates moderate performance with a lower recall (59%) and F1-score (66%), 
              indicating that many candidate planets are being misclassified as either <strong>CONFIRMED</strong> or <strong>FALSE POSITIVE</strong>. 
              In contrast, both the <strong>CONFIRMED</strong> and <strong>FALSE POSITIVE</strong> classes show high precision (89–90%) and recall (95%), 
              leading to strong F1-scores of 0.92 each. Overall accuracy is high at 88%, with macro and weighted F1-scores at 0.83 and 0.87 respectively. 
              This suggests the model performs exceptionally well on confirmed and false positive classes, while still needing improvement in detecting candidate planets reliably.
            </span>
         }
            algorithm={
                          <>
              <span className="font-semibold text-lg text-primary">LightGBM</span>{" "}
              <em className="text-muted-foreground">(Light Gradient Boosting Machine)</em>
              <br />
              <span className="text-sm text-amber-300">
                Tuned Hyperparameters:&nbsp;
                <span className="text-muted-foreground">
                  n_estimators, max_depth, learning_rate, num_leaves, min_child_samples, subsample, colsample_bytree
                </span>
              </span>
            </>

            }
            accuracy={
              <div>
                  <div className="text-5xl font-extrabold tracking-tight leading-none text-secondary [font-variant-numeric:tabular-nums]">
                    87%
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Macro-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.83</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Weighted-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.87</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Macro-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.96</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Weighted-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.97</span>
                    </span>
                  </div>
                </div>

            }
            features={[
              "Orbital Period (koi_period)",
              "Transit Duration (koi_duration)",
              "Transit Depth (koi_depth)",
              "Planet Radius (koi_prad)",
              "Stellar Effective Temperature (koi_steff)",
              "Stellar Surface Gravity (koi_slogg)",
              "Stellar Radius (koi_srad)",
              "Stellar Metallicity (koi_smet)",
              "Signal-to-Noise Ratio (koi_model_snr)",
              "Right Ascension, Declination, Kepler Magnitude (ra, dec, koi_kepmag)"
]}
          />
        </TabsContent>

        <TabsContent value="k2" className="-mt-5">
          <ModelCard
            mission="K2"
            description={
              <span>
                The K2 Mission (2014–2018), NASA’s extended phase of the Kepler mission, was launched to continue the search for exoplanets 
                after Kepler’s partial hardware failure. By observing different regions along the ecliptic plane, K2 captured high-precision 
                light curves of thousands of stars to detect periodic dips in brightness caused by transiting planets.
                <br /><br />
                
                A <strong>LightGBM classifier</strong>, optimized using <strong>Bayesian hyperparameter tuning</strong> on the 
                <em> macro-F1 score</em>, demonstrated robust classification performance:
                <br /><br />
                • <strong>Accuracy:</strong> 92% on test data <br />
                • <strong>Macro-F1:</strong> 89% (Weighted-F1: 92%) <br />
                • <strong>Class-wise F1 Scores:</strong> Confirmed (96%), Candidate (89%), False Positive (84%) <br />
                <br />
                <strong>Observation:</strong> The <strong>CONFIRMED</strong> class shows outstanding performance with high precision (95%) 
                and recall (97%), correctly identifying nearly all true exoplanets. The <strong>CANDIDATE</strong> class maintains strong 
                recall (88%), though it is occasionally misclassified as confirmed — a natural outcome given their overlapping photometric 
                features. The <strong>FALSE POSITIVE</strong> class exhibits solid precision (88%) and balanced performance, indicating the 
                model rarely confuses spurious signals for genuine planets. Misclassification between <strong>CONFIRMED</strong> and 
                <strong> FALSE POSITIVE</strong> remains minimal (1–2%), validating the model’s ability to distinguish real exoplanet signals 
                from noise or artifacts.
              </span>
            }
            algorithm={
                          <>
              <span className="font-semibold text-lg text-primary">LightGBM</span>{" "}
              <em className="text-muted-foreground">(Light Gradient Boosting Machine)</em>
              <br />
              <span className="text-sm text-amber-300">
                Tuned Hyperparameters:&nbsp;
                <span className="text-muted-foreground">
                  n_estimators, max_depth, learning_rate, num_leaves, min_child_samples, subsample, colsample_bytree
                </span>
              </span>
            </>

            }
            accuracy={
              <div>
                <div className="text-5xl font-extrabold tracking-tight leading-none text-secondary [font-variant-numeric:tabular-nums]">
                  92%
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                    Macro-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.89</span>
                  </span>
                  <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                    Weighted-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.92</span>
                  </span>
                  <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                    Macro-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.981</span>
                  </span>
                  <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                    Weighted-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.982</span>
                  </span>
                </div>
              </div>
            }
            features={[
              "Transit Depth (pl_trandep)",
              "Orbital Period (pl_orbper)",
              "Parallax / Distance (sy_plx / sy_dist)",
              "Stellar Proper Motion (sy_pm / sy_pmra / sy_pmdec)",
              "Planet–Star Radius Ratio (pl_ratror / pl_ratdor)",
              "Transit Duration (pl_trandur)",
              "Planet Radius (pl_rade / pl_radj)",
              "Ecliptic / Galactic Position (elat, glat / elon, glon)",
              "Stellar Magnitudes (sy_w3mag, sy_w4mag)",
              "Kepler/ K2 observation counts (k2_campaigns_num, st_nphot)"
            ]}
          />
        </TabsContent>

        <TabsContent value="tess" className="-mt-5">
          <ModelCard
            mission="TESS"
            description={
              <span>
                The Transiting Exoplanet Survey Satellite (TESS) is a NASA mission launched in 2018 to discover exoplanets 
                by observing periodic dips in the brightness of over 200,000 nearby stars.
                <br /><br />
                The TESS Objects of Interest (TOI) dataset catalogs potential and confirmed planets, including  
                <em> APC</em> (ambiguous planetary candidate), <em>CP</em> (confirmed planet), <em>FA/FP</em> (false positive), 
                <em> KP</em> (known planet), and <em>PC</em> (planetary candidate). These are standardized into three categories — 
                <strong> Confirmed</strong>, <strong>Candidate</strong>, and <strong>False Positive</strong> — for model training.
                <br /><br />
                A <strong>LightGBM classifier</strong>, optimized with <strong>Bayesian hyperparameter tuning</strong> on the 
                <em> macro-F1 score</em>, achieved strong generalization performance:
                <br /><br />
                • <strong>Accuracy:</strong> 77% on test data <br />
                • <strong>Macro-F1:</strong> 65% (Weighted-F1: 76%) <br />
                • <strong>Class-wise F1 Scores:</strong> Confirmed (53%), Candidate (85%), False Positive (55%) <br />
                <br />
                <strong>Observation:</strong> The <strong>CANDIDATE</strong> class demonstrates high recall (91%) and F1 scores (85%), 
                while <strong>CONFIRMED</strong> and <strong>FALSE POSITIVE</strong> samples are occasionally misclassified 
                as candidates. However, confusion between confirmed and false positives remains minimal (1.7% and 4.3% misclassified as each other), an expected trend 
                given the stronger photometric similarity of both to planetary candidates rather than to each other.
                
              </span>
            }

            algorithm={
              <>
                <span className="font-semibold text-lg text-primary">LightGBM</span>{" "}
                <em className="text-muted-foreground">(Light Gradient Boosting Machine)</em>
                <br />
                <span className="text-sm text-amber-300">
                  Tuned Hyperparameters:&nbsp;
                  <span className="text-muted-foreground">
                    n_estimators, learning_rate, max_depth, num_leaves, min_child_samples, min_child_weight, subsample, subsample_freq, colsample_bytree, reg_alpha, reg_lambda
                  </span>
                </span>
              </>
            }
            accuracy={
                <div>
                  <div className="text-5xl font-extrabold tracking-tight leading-none text-secondary [font-variant-numeric:tabular-nums]">
                    77%
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Macro-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.65</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Weighted-F1 <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.76</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Macro-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.831</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                      Weighted-AUC <span className="font-semibold text-secondary-foreground text-white">&nbsp;0.812</span>
                    </span>
                  </div>
                </div>
              }
            features={[
              "Planet Radius (pl_rade)",
              "Transit Duration (pl_trandurh)",
              "Proper Motion (st_pmra / st_pmdec)",
              "Transit Period (pl_orbper)",
              "Distance (st_dist)",
              "Stellar logg (from Stellar Teff / logg / Radius)",
            ]}

          />
        </TabsContent>
      </Tabs>  
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

function ExperimentsAndVisualsCard() {
  const [showVisuals, setShowVisuals] = useState(true);

  type Row = {
    dataset: "Kepler" | "K2" | "TESS";
    model: "Random Forest" | "LightGBM";
    recall: number; precision: number; f1: number; auc: number; acc: number;
  };

  const rows: Row[] = [
    { dataset: "Kepler", model: "Random Forest", recall: 0.82, precision: 0.84, f1: 0.83, auc: 0.94,  acc: 0.87 },
    { dataset: "Kepler", model: "LightGBM",      recall: 0.85, precision: 0.82, f1: 0.83, auc: 0.96,  acc: 0.87 },
    { dataset: "K2",     model: "Random Forest", recall: 0.85, precision: 0.88, f1: 0.86, auc: 0.97,  acc: 0.90 },
    { dataset: "K2",     model: "LightGBM",      recall: 0.88, precision: 0.91, f1: 0.89, auc: 0.98,  acc: 0.92 },
    { dataset: "TESS",   model: "Random Forest", recall: 0.68, precision: 0.58, f1: 0.62, auc: 0.80,  acc: 0.74 },
    { dataset: "TESS",   model: "LightGBM",      recall: 0.71, precision: 0.61, f1: 0.65, auc: 0.83,  acc: 0.77 },
  ];

  const max = {
    recall: Math.max(...rows.map(r => r.recall)),
    precision: Math.max(...rows.map(r => r.precision)),
    f1: Math.max(...rows.map(r => r.f1)),
    auc: Math.max(...rows.map(r => r.auc)),
    acc: Math.max(...rows.map(r => r.acc)),
  };

  const fmt = (v:number) => `${(v*100).toFixed(1)}%`;

  const Chip = ({v, m}:{v:number; m:number}) => (
    <span className={[
      "px-2 py-1 rounded-full text-xs font-semibold border",
      v === m
        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
        : v >= 0.85
        ? "bg-primary/10 text-primary border-primary/30"
        : v >= 0.75
        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
        : "bg-rose-500/10 text-rose-300 border-rose-500/30",
    ].join(" ")}>
      {fmt(v)}
    </span>
  );

  // ---- chart helpers ----
  const toChart = (dataset: Row["dataset"]) => {
    const rf = rows.find(r => r.dataset === dataset && r.model === "Random Forest")!;
    const lg = rows.find(r => r.dataset === dataset && r.model === "LightGBM")!;
    return [
      { metric: "Recall",    "Random Forest": Math.round(rf.recall*100),    "LightGBM": Math.round(lg.recall*100) },
      { metric: "Precision", "Random Forest": Math.round(rf.precision*100), "LightGBM": Math.round(lg.precision*100) },
      { metric: "F1",        "Random Forest": Math.round(rf.f1*100),        "LightGBM": Math.round(lg.f1*100) },
    ];
  };

  const ChartBlock = ({ dataset }:{ dataset: Row["dataset"] }) => (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <p className="mb-3 font-semibold">{dataset}</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={toChart(dataset)}
            barCategoryGap={24}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <XAxis dataKey="metric" />
            <YAxis domain={[0, 100]} tickFormatter={(v)=>`${v}%`} />
            <Tooltip formatter={(v:number)=>`${v}%`} />
            <Legend />
            {/* use theme colors so bars aren’t black on dark mode */}
            <Bar dataKey="Random Forest" radius={[8,8,0,0]} fill="hsl(var(--primary))" />
            <Bar dataKey="LightGBM"     radius={[8,8,0,0]} fill="hsl(var(--secondary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <Card className="glass-card border-border/50 mb-12">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1 gradient-text flex items-center gap-3">
            <LineChart className="w-8 h-8 text-primary" />
            Our Performance Summary
          </h2>
          <CardDescription>Switch between table and charts for the same metrics.</CardDescription>
        </div>

        {/* Simple, intuitive switch */}
        <div className="flex items-center gap-3">
          <span className="text-m text-bold">Plots</span>
          <Switch checked={showVisuals} onCheckedChange={setShowVisuals} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {showVisuals ? (
          // ---------- CHARTS VIEW ----------
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ChartBlock dataset="Kepler" />
            <ChartBlock dataset="K2" />
            <ChartBlock dataset="TESS" />
          </div>
        ) : (
          // ---------- TABLE VIEW ----------
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.03]">
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-center">Recall</TableHead>
                  <TableHead className="text-center">Precision</TableHead>
                  <TableHead className="text-center">F1</TableHead>
                  <TableHead className="text-center">AUC</TableHead>
                  <TableHead className="text-center">Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} className="hover:bg-primary/5">
                    <TableCell className="font-medium">{r.dataset}</TableCell>
                    <TableCell className="text-foreground/90">{r.model}</TableCell>
                    <TableCell className="text-center"><Chip v={r.recall}    m={max.recall} /></TableCell>
                    <TableCell className="text-center"><Chip v={r.precision} m={max.precision} /></TableCell>
                    <TableCell className="text-center"><Chip v={r.f1}        m={max.f1} /></TableCell>
                    <TableCell className="text-center"><Chip v={r.auc}       m={max.auc} /></TableCell>
                    <TableCell className="text-center"><Chip v={r.acc}       m={max.acc} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


