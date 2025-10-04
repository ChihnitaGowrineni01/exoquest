import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/model", label: "Model Description" },
    { path: "/inference", label: "Inference" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Rocket className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-accent/20 transition-colors" />
              </div>
              <span className="text-2xl font-bold gradient-text">ExoQuest</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all hover:text-primary ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-cosmic animate-glow" />
                  )}
                </Link>
              ))}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-primary/20"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 relative z-10">{children}</main>
    </div>
  );
};
