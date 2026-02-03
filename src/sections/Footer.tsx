import { Facebook, Twitter, Instagram, Youtube, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
];

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t('company'),
      links: [
        { name: t('aboutUs'), href: '#' },
        { name: t('careers'), href: '#' },
        { name: t('press'), href: '#' },
        { name: t('blog'), href: '#' },
      ],
    },
    {
      title: t('support'),
      links: [
        { name: t('helpCenter'), href: '#' },
        { name: t('contactUs'), href: '#' },
        { name: t('privacyPolicy'), href: '#' },
        { name: t('termsOfService'), href: '#' },
      ],
    },
    {
      title: t('discover'),
      links: [
        { name: t('movies'), href: '#movies' },
        { name: t('tvShows'), href: '#tv-shows' },
        { name: 'Originals', href: '#' },
        { name: t('newReleases'), href: '#' },
      ],
    },
    {
      title: t('account'),
      links: [
        { name: t('accountSettings'), href: '#' },
        { name: t('manageDevices'), href: '#' },
        { name: t('giftCards'), href: '#' },
      ],
    },
  ];
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#7B61FF] hover:text-white transition-all duration-300"
                aria-label={social.name}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/50 text-sm hover:text-[#7B61FF] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Service Code */}
        <div className="flex justify-center mb-8">
          <button className="px-4 py-2 text-xs text-white/40 border border-white/20 rounded hover:text-white hover:border-white/40 transition-colors">
            Service Code
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} 4Sides Play, Inc. All rights reserved.
          </p>
          <p className="text-white/30 text-xs mt-2">
            4Sides Play and all related marks are trademarks of 4Sides Play, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
