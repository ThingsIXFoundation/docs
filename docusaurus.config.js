// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ThingsIX | Documentation',
  tagline: 'ThingsIX brings Internet of Things owners and LoRa gateways owners together .',
  url: 'https://docs.thingsix.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'ThingsIXFoundation', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/ThingsIXFoundation/docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/ThingsIX/whitepaper',
            to: '/whitepaper',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
      },
      announcementBar: {
        id: 'wip',
        content:
          'Warning: Work in progress. ThingsIX is in early stages of development and the documentation could be inaccurate or missing',
        backgroundColor: '#bd0016',
        textColor: '#ffffff',
        isCloseable: false,
      },
      navbar: {
        title: 'ThingsIX',
        logo: {
          alt: 'ThingsIX Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Introduction',
          },
          {
            type: 'doc',
            docId: 'whitepaper',
            position: 'left',
            label: 'Whitepaper',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/Qt6A7VJVrd',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/Things_IX',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Homepage',
                href: "https://www.thingsix.com",
              },
              {
                label: 'Blog',
                href: "https://blog.thingsix.com",
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ThingsIXFoundation/',
              },
            ],
          },
        ],
        copyright: ` © ${new Date().getFullYear()} Stichting ThingsIX Foundation. All rights reserved. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rust'],
      },
    }),
};

module.exports = config;
