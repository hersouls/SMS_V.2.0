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
    <footer className="@container bg-white border-t border-gray-200">
      <div className={cn(
        "mx-auto max-w-7xl px-6 py-8",
        "@container @lg:flex-row @lg:gap-6 @lg:items-center flex flex-col gap-4",
        "@lg:justify-between"
      )}>
        {/* 소셜 링크 */}
        <div className="@container flex justify-center @lg:justify-end @lg:order-2 space-x-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-gray-400 hover:text-gray-500 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1",
                  link.color
                )}
                aria-label={`${link.name} 팔로우하기`}
              >
                <span className="sr-only">{link.name}</span>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </a>
            );
          })}
        </div>
        
        {/* 저작권 정보 */}
        <div className="@container @lg:order-1 @lg:mt-0 mt-8">
          <p className={cn(
            "font-pretendard antialiased tracking-korean-normal break-keep-ko",
            "text-center @lg:text-left text-sm leading-5 text-gray-500"
          )}>
            &copy; {currentYear} Moonwave Company, Inc. All rights reserved.
          </p>
          <p className={cn(
            "font-pretendard antialiased tracking-korean-normal break-keep-ko",
            "text-center @lg:text-left text-xs text-gray-400 mt-1"
          )}>
            Made with ❤️ for subscription management
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;