import { Link } from "react-router-dom";
import { Telescope, Github, Twitter, Mail, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-sm mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Telescope className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold gradient-text">ExoQuest</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI accelerating exoplanet discovery across Kepler, K2, and TESS — built for transparency and speed.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/sreeja-g/exoquest" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:hello@exoquest.ai" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground/90">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition">Home</Link></li>
              <li><Link to="/model" className="hover:text-foreground transition">Why Us?</Link></li>
              <li><Link to="/inference" className="hover:text-foreground transition">Inference</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground/90">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://prezi.com/view/TlddBdKy43pjdqtX5ppN/?referral_token=tTiPvIlnB3FN" className="hover:text-foreground transition">Docs</a></li>
              <li><a href="https://youtu.be/qjbGuhcjB5E" className="hover:text-foreground transition">Youtube</a></li>
              <li><a href="https://github.com/sreeja-g/exoquest" className="hover:text-foreground transition">GitHub Repo</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground/90">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Have questions or want to collaborate?<br />
              <a href="mailto:hello@exoquest.ai" className="underline hover:text-foreground">
                hello@exoquest.ai
              </a>
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-white/10">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">Open-source friendly</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-white/10 pt-6">
          <span>© {new Date().getFullYear()} ExoQuest. All rights reserved.</span>
          <span className="opacity-80">Made with <span className="text-primary">AI</span> & curiosity.</span>
        </div>
      </div>
    </footer>
  );
}
