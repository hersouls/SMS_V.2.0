import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

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

        </div>
      </div>
    </footer>
  );
};

export default Footer;