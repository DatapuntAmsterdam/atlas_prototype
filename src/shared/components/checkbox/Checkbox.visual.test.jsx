import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  failureThreshold: '0.01',
  failureThresholdType: 'percent'
});
expect.extend({ toMatchImageSnapshot });

describe('Checkbox', () => {
  const moduleName = 'Shared';
  const componentName = 'Checkbox';

  let page = null;

  const linkSelector = (names) => (
    names.map((name) => `[data-name="${name}"]`).join(' ~ * ')
  );

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto(global.__HOST__ + '?selectedKind=Shared%2FCheckbox&selectedStory=unchecked&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel');
    await page.waitFor(linkSelector([moduleName]));
    await page.click(linkSelector([moduleName]));
    await page.waitFor(linkSelector([moduleName, componentName]));
    await page.click(linkSelector([moduleName, componentName]));
  });

  afterEach(async () => {
    await page.close();
  });

  it('should render the unchecked checkbox', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'unchecked']));
    await page.click(linkSelector([moduleName, componentName, 'unchecked']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });

  it('should render the checked checkbox', async () => {
    await page.waitFor(linkSelector([moduleName, componentName, 'checked']));
    await page.click(linkSelector([moduleName, componentName, 'checked']));
    const iframe = await page.$('#storybook-preview-iframe');
    const screenshot = await iframe.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
