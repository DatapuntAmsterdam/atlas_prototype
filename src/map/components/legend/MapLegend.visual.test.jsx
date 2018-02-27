import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: '0.01',
  failureThresholdType: 'percent'
});
expect.extend({ toMatchImageSnapshot });

describe('MapLegend', () => {
  const moduleName = 'Map';
  const componentName = 'MapLegend';

  let page = null;

  const linkSelector = (names) => (
    names.map((name) => `[data-name="${name}"]`).join(' ~ * ')
  );

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto(global.__HOST__ + '?selectedKind=Map%2FMapLegend&selectedStory=default&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel');
    await page.waitFor(linkSelector([moduleName]));
    await page.click(linkSelector([moduleName]));
    await page.waitFor(linkSelector([moduleName, componentName]));
    await page.click(linkSelector([moduleName, componentName]));
  });

  afterEach(async () => {
    await page.close();
  });

  it('should render the map legend', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'default']));
    await page.click(linkSelector([moduleName, componentName, 'default']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
