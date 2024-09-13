import { CustomTableTemplatePage } from './app.po';

describe('CustomTable App', function() {
  let page: CustomTableTemplatePage;

  beforeEach(() => {
    page = new CustomTableTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
