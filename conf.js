
function getWindowDOM(){
  let Window = require('window');
  let windowInstance = new Window();
  let documentInstance = windowInstance.document;
  return [windowInstance, documentInstance];
}


async function startBrowser(){
  browser.ignoreSynchronization = true;
  await browser.get('https://google.com');
  var screenTitle = await browser.getTitle();
  console.log( screenTitle );
}

exports.config = {

  //Protractor config properties
  beforeLaunch:async () => {
      const nfl = require('.//dsl//nfl');
      await nfl.createDSLScripts();
      console.log('beforeLaunch');

  },

  framework: 'jasmine2',
  onPrepare: () => {

    let currentWindowAndDocument = getWindowDOM();
    global.window = currentWindowAndDocument[0];
    global.document = currentWindowAndDocument[1];

      console.log('onPrepare');
      beforeAll(async function(){
             console.log('beforeAll');

           });

     beforeEach(async function(){
        console.log('beforeEachINCONF');
        await startBrowser();
     });

     afterEach(async function() {
          console.log('afterEach');
     });

     afterAll(async function(){
        console.log('afterAll');
     });


     var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'test_results',
        filePrefix: 'xmloutput'
    }));

  },

  onComplete: () => {
      console.log('onComplete');

      var browserName, browserVersion;
      var capsPromise = browser.getCapabilities();

     capsPromise.then(function (caps) {
        browserName = caps.get('browserName');
        browserVersion = caps.get('version');
        platform = caps.get('platform');

        var HTMLReport = require('protractor-html-reporter-2');

        testConfig = {
            reportTitle: 'Protractor Test Execution Report',
            outputPath: './/',
            outputFilename: 'ProtractorTestReport',
            screenshotPath: './screenshots',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true,
            testPlatform: platform
        };
        new HTMLReport().from('.//test_results//xmloutput.xml', testConfig);
    });
    var fs = require('fs-extra');
    fs.emptyDir('screenshots//', function (err) {
        console.log(err);
    });

    jasmine.getEnv().addReporter({
        specDone: function(result) {
            if (result.status == 'failed') {
                browser.getCapabilities().then(function (caps) {
                    var browserName = caps.get('browserName');

                    browser.takeScreenshot().then(function (png) {
                        var stream = fs.createWriteStream('screenshots//' + browserName + '-' + result.fullName+ '.png');
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                });
            }
        }
    });

    if (browser) browser.driver.quit();
  },

  onCleanUp: () => {
      console.log('onCleanUp');
  },

  afterLaunch: () => {
      console.log('afterLaunch');
  },

  directConnect: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
                  'browserName': 'chrome',
                  'chromeOptions':  {
                                      args: [ '--lang=sp',
                                              '--disable-infobars',
                                              '--start-maximized'
                                            ]
                                    }
                },

  specs: ['./tests/*.js'],
  SELENIUM_PROMISE_MANAGER: false
};
