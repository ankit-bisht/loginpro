import { LoginfbPage } from './app.po';

describe('loginfb App', () => {
  let page: LoginfbPage;

  beforeEach(() => {
    page = new LoginfbPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
