import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Telescope, Brain, ChartBar, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-block mb-6">
          <div className="relative">
            <Telescope className="w-20 h-20 text-primary animate-float mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse-glow" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-6 gradient-text">
          Discover Exoplanets with AI
        </h1>

        <h2 className="text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          We are on a journey to accelerate exoplanet discovery for astronomers and researchers.
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          ExoQuest leverages advanced machine learning to analyze data from NASA's
          space missions—Kepler, K2, and TESS—to automatically identify exoplanets
          with unprecedented accuracy.
        </p>
        <Link to="/inference">
          <Button size="lg" className="gradient-cosmic text-lg px-8 py-6 glow-primary">
            Start Exploring
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <FeatureCard
          icon={<Brain className="w-10 h-10" />}
          title="AI-Powered Detection"
          description="State-of-the-art machine learning models trained on thousands of confirmed exoplanets from NASA missions."
          gradient="from-primary to-accent"
        />
        <FeatureCard
          icon={<ChartBar className="w-10 h-10" />}
          title="Real-Time Analysis"
          description="Upload your CSV data and receive instant predictions with detailed classification probabilities."
          gradient="from-secondary to-primary"
        />
        <FeatureCard
          icon={<Telescope className="w-10 h-10" />}
          title="Multi-Mission Support"
          description="Compatible with datasets from NASA’s exoplanet survey missions — Kepler, K2, and TESS."
          gradient="from-accent to-secondary"
        />
      </div>

      {/* About Section */}
      <div className="glass-card rounded-2xl p-10 mb-20">
        <h2 className="text-3xl font-bold mb-6 gradient-text">About the Project</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Thousands of exoplanets have been discovered through NASA's space-based
            missions, but most identifications were done manually by astrophysicists.
            With advances in artificial intelligence, we can now automate this process,
            enabling faster discoveries and more efficient analysis of vast datasets.
          </p>
          <p>
            ExoQuest uses the <strong className="text-foreground">transit method</strong> data,
            where scientists detect a decrease in light when a planet passes between a
            star and the surveying satellite. Our AI models analyze variables such as
            orbital period, transit duration, planetary radius, and more to classify
            observations as confirmed exoplanets, planetary candidates, or false positives.
          </p>
          <p>
            This project aims to democratize exoplanet discovery by providing researchers,
            students, and space enthusiasts with an intuitive interface to interact with
            cutting-edge AI models trained on NASA's open-source datasets.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center glass-card rounded-2xl p-12 glow-secondary">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Ready to Discover New Worlds?
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Upload your exoplanet data and let our AI models analyze it for you.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/inference">
            <Button size="lg" className="gradient-cosmic glow-primary">
              Try Inference
            </Button>
          </Link>
          <Link to="/model">
            <Button size="lg" variant="outline" className="border-primary/50">
              Learn About Models
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-8 hover:scale-105 transition-transform duration-300 group">
      <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${gradient} mb-4 group-hover:animate-pulse-glow`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
