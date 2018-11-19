import { UnomasenlafamiliaPage } from './app.po';

describe('unomasenlafamilia App', () => {
  let page: UnomasenlafamiliaPage;

  beforeEach(() => {
    page = new UnomasenlafamiliaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
