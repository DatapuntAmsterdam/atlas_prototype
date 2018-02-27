import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: '0.01',
  failureThresholdType: 'percent'
});
expect.extend({ toMatchImageSnapshot });

describe('SelectButton', () => {
  const moduleName = 'Shared';
  const componentName = 'SelectButton';

  let page = null;

  const linkSelector = (names) => (
    names.map((name) => `[data-name="${name}"]`).join(' ~ * ')
  );

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto(global.__HOST__ + '?selectedKind=Shared%2FSelectButton&selectedStory=active&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel');
    await page.waitFor(linkSelector([moduleName]));
    await page.click(linkSelector([moduleName]));
    await page.waitFor(linkSelector([moduleName, componentName]));
    await page.click(linkSelector([moduleName, componentName]));
  });

  afterEach(async () => {
    await page.close();
  });

  it('should render the active select button', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'active']));
    await page.click(linkSelector([moduleName, componentName, 'active']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });

  it('should render the disabled select button', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'disabled']));
    await page.click(linkSelector([moduleName, componentName, 'disabled']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });

  it('should render the expanded select button', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'expanded']));
    await page.click(linkSelector([moduleName, componentName, 'expanded']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
