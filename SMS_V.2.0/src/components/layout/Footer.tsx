import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/hersouls',
      color: 'hover:text-gray-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/moonwave_app',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/moonwave_app',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:contact@moonwave.app',
      color: 'hover:text-red-500'
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors duration-200 ${link.color}`}
                  aria-label={link.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-500 break-keep-ko">
              © {currentYear} Moonwave. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1 break-keep-ko">
              Made with ❤️ for subscription management
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;