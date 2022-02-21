const puppeteer = require('puppeteer');
const { expect } = require('chai');

describe('App', () => {
  let browser;
  let page;

  it('should load the page', async () => {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    page = await browser.newPage();
    await page.goto(process.env.FRONTEND_PREVIEW_URL, { waitUntil: 'load' });
  }).timeout(5000);

  it('should display empty form fields', async () => {
    expect(await getCategorySelectValue()).to.be.empty;
    expect(await getDocumentNameInputValue()).to.be.empty;
    expect(await getDocumentTypeSelectValue()).to.be.empty;
    expect(await getEmailInputValue()).to.be.empty;
  }).timeout(1000);

  it('should fill progress bar by 25% when only documentName input is filled', async () => {
    await setDocumentNameInputValue('ab');

    expect(await getCategorySelectValue()).to.be.empty;
    expect(await getDocumentNameInputValue()).to.be.equal('ab');
    expect(await getDocumentTypeSelectValue()).to.be.empty;
    expect(await getEmailInputValue()).to.be.empty;

    expect(await getProgressBarCompletion()).to.be.equal(25);
  }).timeout(1000);

  it('should fill progress bar by 50% when documentName and email inputs are filled', async () => {
    await setEmailInputValue('example@gmail.com');

    expect(await getCategorySelectValue()).to.be.empty;
    expect(await getDocumentNameInputValue()).to.be.equal('ab');
    expect(await getDocumentTypeSelectValue()).to.be.empty;
    expect(await getEmailInputValue()).to.be.equal('example@gmail.com');

    expect(await getProgressBarCompletion()).to.be.equal(50);
  }).timeout(1000);

  it('should fill progress bar by 75% when documentName and email inputs are filled and documentType is selected', async () => {
    await setDocumentTypeSelectValue('PDF');

    expect(await getCategorySelectValue()).to.be.empty;
    expect(await getDocumentNameInputValue()).to.be.equal('ab');
    expect(await getDocumentTypeSelectValue()).to.be.equal('PDF');
    expect(await getEmailInputValue()).to.be.equal('example@gmail.com');

    expect(await getProgressBarCompletion()).to.be.equal(75);
  }).timeout(1000);

  it('should fill progress bar by 100% when all form fields are filled and valid', async () => {
    await setCategorySelectValue('Other');
    await setDocumentNameInputValue('abcdefghijklmnopqrstuvwxyz!@#$');
    await setDocumentTypeSelectValue('Plain');

    expect(await getCategorySelectValue()).to.be.equal('Other');
    expect(await getDocumentNameInputValue()).to.be.equal('abcdefghijklmnopqrstuvwxyz!@#$');
    expect(await getDocumentTypeSelectValue()).to.be.equal('Plain');
    expect(await getEmailInputValue()).to.be.equal('example@gmail.com');

    expect(await getProgressBarCompletion()).to.be.equal(100);
  }).timeout(1000);

  it('should fill progress bar by 25% when documentType select is empty, category is selected, documentName and email inputs are invalid', async () => {
    await setCategorySelectValue('Audit');
    await setDocumentTypeSelectValue('');
    await setCategorySelectValue('Application');

    await setDocumentNameInputValue('abcdefghijklmnopqrstuvwxyz!@#$000');
    await setEmailInputValue('ccc@@@dd');

    expect(await getCategorySelectValue()).to.be.equal('Application');
    expect(await getDocumentNameInputValue()).to.be.equal('abcdefghijklmnopqrstuvwxyz!@#$000');
    expect(await getDocumentTypeSelectValue()).to.be.equal('');
    expect(await getEmailInputValue()).to.be.equal('ccc@@@dd');

    expect(await getProgressBarCompletion()).to.be.equal(25);
  }).timeout(1000);

  it('should fill progress bar by 75% when both documentType and category are selected, documentName is filled and email input is invalid', async () => {
    await setCategorySelectValue('Audit');
    await setDocumentTypeSelectValue('PDF');
    await setDocumentTypeSelectValue('Plain');
    await setDocumentTypeSelectValue('Plain');

    await setDocumentNameInputValue('abcdefghijklmnopqrstuvwxyz!@#$00');
    await setEmailInputValue('cccddd..ss');

    expect(await getCategorySelectValue()).to.be.equal('Audit');
    expect(await getDocumentNameInputValue()).to.be.equal('abcdefghijklmnopqrstuvwxyz!@#$00');
    expect(await getDocumentTypeSelectValue()).to.be.equal('Plain');
    expect(await getEmailInputValue()).to.be.equal('cccddd..ss');

    expect(await getProgressBarCompletion()).to.be.equal(75);
  }).timeout(1000);

  after(() => {
    browser.close();
  });

  const setDocumentNameInputValue = async (text) => {
    const input = await page.$('input[id="documentName"]');
    await input.click({ clickCount: 3 });
    await input.type(text);
  };

  const setEmailInputValue = async (text) => {
    const input = await page.$('input[id="email"]');
    await input.click({ clickCount: 3 });
    await input.type(text);
  };

  const setCategorySelectValue = async (value) => page.select('select[id="category"]', value);
  const setDocumentTypeSelectValue = async (value) => page.select('select[id="documentType"]', value);

  const getDocumentNameInputValue = async () => page.$eval('input[id="documentName"]', (elem) => elem.value);
  const getEmailInputValue = async () => page.$eval('input[id="email"]', (elem) => elem.value);
  const getCategorySelectValue = async () => page.$eval('select[id="category"]', (elem) => elem.value);
  const getDocumentTypeSelectValue = async () => page.$eval('select[id="documentType"]', (elem) => elem.value);

  const getProgressBarCompletion = async () => {
    const progressBarWrapper = await page.$('.form-progress-bar-wrapper');
    const progressBarWrapperWidth = (await progressBarWrapper.boundingBox()).width;
    const progressBar = await page.$('.form-progress-bar');
    const progressBarWidth = (await progressBar.boundingBox()).width;

    return Math.round((progressBarWidth * 100) / progressBarWrapperWidth);
  };

});
