import React from 'react';
import { Github, Twitter, Instagram, Heart, Facebook } from 'lucide-react';
import { cn } from '../../lib/utils';
import { DESIGN_TOKENS } from '../../lib/design-tokens';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer 디자인 가이드에 따른 소셜 링크 구성
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/moonwave_app',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/moonwave_app',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/moonwave_app',
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/hersouls',
      color: 'hover:text-gray-700'
    }
  ];

  return (
    <footer className="@container bg-white border-t border-gray-200">
      <div className={cn(
        "mx-auto max-w-7xl px-6 py-8",
        DESIGN_TOKENS.CONTAINER_RESPONSIVE,
        "@lg:justify-between"
      )}>
        {/* 소셜 링크 - Footer 디자인 가이드 표준 */}
        <div className="@container flex justify-center @lg:justify-end @lg:order-2 space-x-6">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-gray-400 hover:text-gray-500 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1",
                item.color
              )}
              aria-label={`${item.name} 팔로우하기`}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        
        {/* 저작권 정보 - Footer 디자인 가이드 표준 */}
        <div className="@container @lg:order-1 @lg:mt-0 mt-8">
          <p className={cn(
            DESIGN_TOKENS.KOREAN_TEXT_BASE,
            "text-center @lg:text-left text-sm leading-5 text-gray-500"
          )}>
            &copy; {currentYear} Moonwave Company, Inc. All rights reserved.
          </p>
          <p className={cn(
            DESIGN_TOKENS.KOREAN_TEXT_BASE,
            "text-center @lg:text-left text-xs leading-4 text-gray-400 mt-1"
          )}>
            Made with <Heart className="inline w-3 h-3 text-red-400" /> for better subscription management
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;