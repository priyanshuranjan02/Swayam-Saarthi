import { Link } from 'react-router-dom';
import { Car, Github, Linkedin, Mail, Globe, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socials = [
    { href: 'https://github.com/priyanshuranjan02', icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com/in/priyanshu-ranjan-74170a227', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:ranjanpriyanshu441@gmail.com', icon: Mail, label: 'Email' },
    { href: 'https://priyanshu02-portfolio.vercel.app', icon: Globe, label: 'Portfolio' },
  ];

  return (
    <footer className="border-t border-border/30 bg-surface-muted/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">Swayam Saarthi</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              Your car, our driver. The reverse ride-hailing platform that lets you book
              verified drivers for your own vehicle. Safe, secure, and convenient.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
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
            <h4 className="font-display font-semibold mb-4 text-sm tracking-wide">Connect</h4>
            <div className="flex gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all elevate"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Swayam Saarthi. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> by Priyanshu Ranjan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
