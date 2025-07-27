import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

interface H1Props extends TypographyProps {}
interface H2Props extends TypographyProps {}
interface H3Props extends TypographyProps {}
interface BodyProps extends TypographyProps {}
interface CaptionProps extends TypographyProps {}

const H1: React.FC<H1Props> = ({ children, className }) => (
  <h1 className={cn(
    'text-4xl sm:text-5xl lg:text-6xl',
    'font-bold tracking-ko-tight',
    'text-gray-900 break-keep-ko font-pretendard',
    className
  )}>
    {children}
  </h1>
);

const H2: React.FC<H2Props> = ({ children, className }) => (
  <h2 className={cn(
    'text-3xl sm:text-4xl lg:text-5xl',
    'font-bold tracking-ko-tight',
    'text-gray-900 break-keep-ko font-pretendard',
    className
  )}>
    {children}
  </h2>
);

const H3: React.FC<H3Props> = ({ children, className }) => (
  <h3 className={cn(
    'text-2xl sm:text-3xl lg:text-4xl',
    'font-semibold tracking-ko-normal',
    'text-gray-900 break-keep-ko font-pretendard',
    className
  )}>
    {children}
  </h3>
);

const Body: React.FC<BodyProps> = ({ children, className }) => (
  <p className={cn(
    'text-base lg:text-lg',
    'font-normal tracking-ko-normal',
    'text-gray-700 leading-relaxed break-keep-ko font-pretendard',
    className
  )}>
    {children}
  </p>
);

const Caption: React.FC<CaptionProps> = ({ children, className }) => (
  <p className={cn(
    'text-sm',
    'font-normal tracking-ko-normal',
    'text-gray-600 break-keep-ko font-pretendard',
    className
  )}>
    {children}
  </p>
);

const Typography = {
  H1,
  H2,
  H3,
  Body,
  Caption,
};

export default Typography;