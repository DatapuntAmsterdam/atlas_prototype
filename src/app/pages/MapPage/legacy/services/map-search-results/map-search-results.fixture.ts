export const basicSortDataModel = [
  {
    type: 'pand/address',
    categoryLabel: 'label',
    categoryLabelPlural: 'labels',
    subCategories: [],
    results: [
      {
        type: 'string',
        categoryLabel: 'string',
        categoryLabelPlural: 'string',
        label: 'string',
        statusLabel: 'string',
      },
    ],
    parent: 'string',
  },
  {
    type: 'kadaster/kadastraal_object',
    categoryLabel: 'label',
    categoryLabelPlural: 'labels',
    subCategories: [],
    results: [
      {
        type: 'string',
        categoryLabel: 'string',
        categoryLabelPlural: 'string',
        label: 'string',
        statusLabel: 'string',
      },
    ],
    parent: 'string',
  },
  {
    type: 'bag/pand',
    categoryLabel: 'label',
    categoryLabelPlural: 'labels',
    subCategories: [],
    results: [
      {
        type: 'string',
        categoryLabel: 'string',
        categoryLabelPlural: 'string',
        label: 'string',
        statusLabel: 'string',
      },
    ],
    parent: 'string',
  },
]

export const basicDataModel = [
  {
    uri: 'https://acc.api.data.amsterdam.nl/',
    label: 'Warmoesstraat 178',
    categoryLabel: 'Adres',
    categoryLabelPlural: 'Adressen',
    type: 'pand/address',
    parent: 'bag/pand',
    subCategories: [],
    results: [],
  },
  {
    uri: 'https://acc.api.data.amsterdam.nl/',
    label: 'ASD04 F 06417 G 0000',
    categoryLabel: 'Kadastraal object',
    categoryLabelPlural: 'Kadastrale objecten',
    type: 'kadaster/kadastraal_object',
    subCategories: [],
    results: [],
  },
  {
    uri: 'https://acc.api.data.amsterdam.nl/',
    label: '0363100012168052',
    categoryLabel: 'Pand',
    categoryLabelPlural: 'Panden',
    type: 'bag/pand',
    subCategories: [],
    results: [],
  },
]

export const expectedDataModel = [
  {
    categoryLabel: 'Pand',
    categoryLabelPlural: 'Panden',
    results: [
      {
        categoryLabel: 'Pand',
        categoryLabelPlural: 'Panden',
        label: '0363100012168052',
        results: [],
        subCategories: [],
        type: 'bag/pand',
        uri: 'https://acc.api.data.amsterdam.nl/',
      },
    ],
    subCategories: [
      {
        categoryLabel: 'Adres',
        categoryLabelPlural: 'Adressen',
        results: [
          {
            categoryLabel: 'Adres',
            categoryLabelPlural: 'Adressen',
            label: 'Warmoesstraat 178',
            results: [],
            subCategories: [],
            parent: 'bag/pand',
            type: 'pand/address',
            uri: 'https://acc.api.data.amsterdam.nl/',
          },
        ],
        subCategories: [],
        type: 'pand/address',
      },
    ],
    type: 'bag/pand',
  },
  {
    categoryLabel: 'Kadastraal object',
    categoryLabelPlural: 'Kadastrale objecten',
    results: [
      {
        categoryLabel: 'Kadastraal object',
        categoryLabelPlural: 'Kadastrale objecten',
        label: 'ASD04 F 06417 G 0000',
        results: [],
        subCategories: [],
        type: 'kadaster/kadastraal_object',
        uri: 'https://acc.api.data.amsterdam.nl/',
      },
    ],
    subCategories: [],
    type: 'kadaster/kadastraal_object',
  },
]
