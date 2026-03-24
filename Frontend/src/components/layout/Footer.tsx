import { Link } from 'react-router-dom';
import { Car, Github, Linkedin, Mail, Heart, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Swayam Saarthi</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Your car, our driver. The reverse ride-hailing platform that lets you book 
              verified drivers for your own vehicle. Safe, secure, and convenient.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/register/driver" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/priyanshuranjan02"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/priyanshu-ranjan-74170a227"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:ranjanpriyanshu441@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://priyanshu02-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Swayam Saarthi. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made by 'Priyanshu Ranjan' for a better commute
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
