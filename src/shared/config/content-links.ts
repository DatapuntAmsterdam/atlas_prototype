export interface ContentLinkBase {
  testId: string
  title: string
  description?: string
}

export interface ArticleIdMap {
  acceptance: string
  production: string
}

export interface ContentLinkArticle extends ContentLinkBase {
  id: ArticleIdMap
  slug: string
}

export interface ContentLinkHref extends ContentLinkBase {
  href: string
}

export type ContentLink = ContentLinkArticle | ContentLinkHref

export type ContentRedirectTo = Pick<ContentLinkArticle, 'id' | 'slug'>

export interface ContentRedirect {
  from: string
  to: ContentRedirectTo
}

export const FOOTER_LINKS_COLOFON: ContentLinkArticle[] = [
  {
    testId: 'Databeleid',
    title: 'Databeleid',
    id: {
      acceptance: '29160257-dd4b-4349-a5df-d6f7715615ed',
      production: '8af0598f-12a0-47c5-9327-938fade1159a',
    },
    slug: 'amsterdam-en-data',
  },
  {
    testId: 'Bronnen',
    title: 'Bronnen',
    id: {
      acceptance: 'e3bd02bc-ce8a-4ff3-8d2c-4d5138ef0115',
      production: '6f095138-5e73-4388-8300-489270fdd60a',
    },
    slug: 'bronnen',
  },
  {
    testId: 'OverDezeSite',
    title: 'Over deze site',
    id: {
      acceptance: '6b474539-32fb-4a1c-929a-bbfefadadc08',
      production: 'a5176bed-cad4-46d2-b501-a628370c9099',
    },
    slug: 'over-deze-site',
  },
  {
    testId: 'OverOIS',
    title: 'Over OIS',
    id: {
      acceptance: '4dba60f2-7161-4fd8-81e9-03eddb52d259',
      production: '8cf61560-0f90-4b81-84bf-900a6755159d',
    },
    slug: 'over-ois',
  },
]

export const FOOTER_LINKS_SOCIAL: ContentLinkHref[] = [
  {
    testId: 'SocialNieuwsbriefOIS',
    title: 'Nieuwsbrief OIS',
    href: 'https://www.amsterdam.nl/nieuwsbrieven/bestuur-organisatie/dienstverlening/nieuwsbrief-data/nieuwsbrief-data/',
  },
  {
    testId: 'SocialVacatures',
    title: 'Vacatures',
    href: 'https://www.amsterdam.nl/bestuur-organisatie/werkenbij/externe/?zoeken=true&zoeken_term=&selectie_zoeken_op_maanden=AllYears&zoek_clustered_keywords_cluster=3669_3670_3671_3672_3673_3674_3675_3676_3677_3678_3679_3717_3681_3682_3683_3684_3685_3686_3688&zoek_clustered_keywords=3717&zoek_clustered_keywords_cluster=3662_3664_3665_3666_3667_3668_3715&zoek_clustered_keywords_cluster=3689_3690_3692_3693',
  },
  {
    testId: 'SocialTwitter',
    title: 'Twitter',
    href: 'https://twitter.com/AmsterdamNL',
  },
  {
    testId: 'SocialFacebook',
    title: 'Facebook',
    href: 'https://www.facebook.com/gemeenteamsterdam',
  },
  {
    testId: 'SocialLinkedIn',
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/gemeente-amsterdam',
  },
  {
    testId: 'SocialGitHub',
    title: 'GitHub',
    href: 'https://github.com/Amsterdam',
  },
]

export const FOOTER_LINKS_HELP: ContentLinkArticle[] = [
  {
    testId: 'HelpFAQ',
    title: 'Veelgestelde vragen',
    id: {
      acceptance: 'a939afed-ff98-4db1-a927-fe6c9bac1ae6',
      production: 'e42a6157-6499-48db-95b6-cb271f7999f7',
    },
    slug: 'veelgestelde-vragen',
  },
  {
    testId: 'HelpContact',
    title: 'Contact opnemen',
    id: {
      acceptance: 'aadfea20-7308-4caf-9126-a900f9e6df1f',
      production: 'c8f4d1da-75f3-4ee7-93e8-256b201d6ccf',
    },
    slug: 'contact',
  },
  {
    testId: 'HelpUitlegGebruik',
    title: 'Uitleg gebruik',
    id: {
      acceptance: '5a962d67-ae2d-41b5-9c1a-263591eb5b0c',
      production: '088c348e-73cd-42e0-9998-4123186feded',
    },
    slug: 'wat-kun-je-hier',
  },
]

export const FOOTER_LINK_PRIVACY: ContentLinkHref = {
  testId: 'PrivacyCookies',
  title: 'Privacy en cookies',
  href: 'https://www.amsterdam.nl/privacy/',
}

export const HEADER_LINKS_ABOUT: ContentLinkArticle[] = [
  {
    testId: 'OverOIS',
    title: 'Onderzoek, Informatie en Statistiek',
    id: {
      acceptance: '4dba60f2-7161-4fd8-81e9-03eddb52d259',
      production: '8cf61560-0f90-4b81-84bf-900a6755159d',
    },
    slug: 'over-ois',
  },
  {
    testId: 'OverOnderzoek',
    title: 'Onderzoek',
    id: {
      acceptance: 'bd25761c-ca8c-4587-bdd8-6f77bd8bd7e3',
      production: '3d7c706a-0898-4adc-b0e8-2c4c195ed7f9',
    },
    slug: 'onderzoek-door-ois',
  },
  {
    testId: 'OverDatabeleid',
    title: 'Databeleid',
    id: {
      acceptance: '29160257-dd4b-4349-a5df-d6f7715615ed',
      production: '8af0598f-12a0-47c5-9327-938fade1159a',
    },
    slug: 'amsterdam-en-data',
  },
  {
    testId: 'OverBronnen',
    title: 'Bronnen',
    id: {
      acceptance: 'e3bd02bc-ce8a-4ff3-8d2c-4d5138ef0115',
      production: '6f095138-5e73-4388-8300-489270fdd60a',
    },
    slug: 'bronnen',
  },
  {
    testId: 'OverContact',
    title: 'Contact',
    id: {
      acceptance: 'aadfea20-7308-4caf-9126-a900f9e6df1f',
      production: 'c8f4d1da-75f3-4ee7-93e8-256b201d6ccf',
    },
    slug: 'contact',
  },
]

export const HEADER_LINK_HELP: ContentLinkArticle = {
  testId: 'HelpHelp',
  title: 'Help',
  id: {
    acceptance: '4e5af47c-a67f-4cbc-be3c-7a0f410a45d6',
    production: 'de7d3101-354c-44f6-b94d-dde572239090',
  },
  slug: 'help',
}

export const NAVIGATION_LINK_DATA_IN_TABLES: ContentLinkArticle = {
  testId: 'Tabellen',
  title: 'Tabellen',
  description: 'Selecteer data en sla op als spreadsheet',
  id: {
    acceptance: '647c0fd0-567e-4157-b7ee-94c7b8504235',
    production: '3f5a9b94-a9d8-417d-aac8-45971f4b3a43',
  },
  slug: 'tabellen',
}

export const NAVIGATION_LINK_DATA_SERVICES: ContentLinkArticle = {
  testId: 'DataServices',
  title: 'Data services',
  description: 'Alles over het koppelen van data via APIs',
  id: {
    acceptance: '42e0c7ce-1694-4468-ae45-ce0e63823a50',
    production: 'bb2dddf3-ddd1-4533-bcce-e33ea00a8a60',
  },
  slug: 'services',
}

export const REDIRECTS_ARTICLES: ContentRedirect[] = [
  {
    from: '/content/beschikbaarheid-en-kwaliteit-data/',
    to: {
      id: {
        acceptance: 'e3bd02bc-ce8a-4ff3-8d2c-4d5138ef0115',
        production: '6f095138-5e73-4388-8300-489270fdd60a',
      },
      slug: 'bronnen',
    },
  },
  {
    from: '/content/apis/',
    to: {
      id: {
        acceptance: '42e0c7ce-1694-4468-ae45-ce0e63823a50',
        production: 'bb2dddf3-ddd1-4533-bcce-e33ea00a8a60',
      },
      slug: 'services',
    },
  },
  {
    from: '/content/help/',
    to: {
      id: {
        acceptance: '4e5af47c-a67f-4cbc-be3c-7a0f410a45d6',
        production: 'de7d3101-354c-44f6-b94d-dde572239090',
      },
      slug: 'help',
    },
  },
  {
    from: '/content/inloggen/',
    to: {
      id: {
        acceptance: '96d46e1f-3610-4eb4-b489-b576fbdc550e',
        production: 'cb7275e3-9bbf-4082-ab76-fd6c436a3ab1',
      },
      slug: 'alleen-voor-medewerkers',
    },
  },
  {
    from: '/content/gegevens/',
    to: {
      id: {
        acceptance: '816ca097-8227-4010-8941-24009030050f',
        production: '16fd6ce4-43fc-458d-a91a-010602cb046c',
      },
      slug: 'gegevens',
    },
  },
  {
    from: '/content/nieuws/',
    to: {
      id: {
        acceptance: '6940c6ff-fecf-4b6f-9359-bc44cadc7004',
        production: '2653a7b9-49fb-4bcf-a15a-ebe129908281',
      },
      slug: 'updates',
    },
  },
  {
    from: '/content/bediening/',
    to: {
      id: {
        acceptance: '5a962d67-ae2d-41b5-9c1a-263591eb5b0c',
        production: '088c348e-73cd-42e0-9998-4123186feded',
      },
      slug: 'wat-kun-je-hier',
    },
  },
]

export const HOMEPAGE_LINKS = {
  SPECIALS: {
    id: {
      acceptance: '9adfc6ee-a3ff-4632-ba75-86834bac5e92',
      production: 'f444a5a7-5434-4b20-90a1-6a1e414c06a2',
    },
  },
  COLLECTIONS: {
    id: {
      acceptance: 'b6574911-8c78-4fde-a82e-a2555ff28465',
      production: '781343d1-6694-4f5d-a4c8-bd7672b7e64b',
    },
  },
  ORGANIZATION: {
    id: {
      acceptance: 'd1500833-cdac-4e4b-9914-a67f1fbaccbe',
      production: 'c1caec02-b2f4-4e9f-8603-81e562ce4ded',
    },
  },
  ABOUT_DATA: {
    id: {
      acceptance: 'd9f076f2-74e6-4f5c-94c1-d95f2be1f2e0',
      production: '721dc4f2-7f29-420a-a890-2a7a655ae647',
    },
  },
  ABOUT: {
    id: {
      acceptance: 'bb27218f-8fa3-40cc-8c23-8aae8eab445d',
      production: 'ddfaba5c-d235-4d95-ab6d-25352d0e0789',
    },
  },
  HIGHLIGHT: {
    id: {
      acceptance: 'fffa0199-9a9a-4cce-86c4-7fe7bfed21a0',
      production: '9f02e2cd-b74d-474c-b251-c96e8416979d',
    },
  },
}

export const SHORTLINKS = {
  COLLECTIONS: {
    ECONOMY: {
      id: {
        acceptance: '6216c6bf-4ee1-4a72-a2a8-c00d8606e75b',
        production: '473ee7ce-1219-44f2-836e-90f63da7a751',
      },
    },
    TOURISM: {
      id: {
        acceptance: '21d21e58-aff7-406c-a565-129e1fe1a7cb',
        production: 'fdcc54a1-5aa7-4ddf-af16-1c28a99b8c5f',
      },
    },
    HOUSING: {
      id: {
        acceptance: '5bfec111-c3a8-43c0-9db7-294527d9fbfc',
        production: '2db4e140-6fc2-41e2-bd7b-3f017d00e976',
      },
    },
    EDUCATION: {
      id: {
        acceptance: 'ba42bfa3-4cf6-43ba-bb33-589c5dacefa7',
        production: '400f5adf-a728-4a6d-8dfe-5d14866fb576',
      },
    },
    CORONA: {
      id: {
        acceptance: '054e6a90-f02a-4805-b449-4a7849da38a9',
        production: 'e6d25646-a296-4af9-8081-9fe454db2b02',
      },
    },
    FAQ: {
      id: {
        acceptance: 'a939afed-ff98-4db1-a927-fe6c9bac1ae6',
        production: 'e42a6157-6499-48db-95b6-cb271f7999f7',
      },
    },
  },
}

export const ARTICLE_REDIRECT_FRAGMENTS = {
  ECONOMY_DASHBOARD: {
    from: {
      fragment: {
        acceptance: 'dashboard-kerncijfers-economie/562f52d4-d78a-4d20-94fd-f708f2ba76f7',
        production: 'dashboard-economie-dashboard/3233adae-70ec-413f-90f2-c74a19ab1a34',
      },
    },
    to: {
      fragment: {
        acceptance: 'coronamonitor-dashboard/054e6a90-f02a-4805-b449-4a7849da38a9',
        production:
          'dashboard-gevolgen-corona-voor-amsterdam-dashboard/e6d25646-a296-4af9-8081-9fe454db2b02',
      },
    },
  },
}
