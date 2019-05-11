# moleculer-mailgun

[![Build Status](https://travis-ci.org/YourSoftRun/moleculer-mailgun.svg?branch=master)](https://travis-ci.org/YourSoftRun/moleculer-mailgun)
[![Coverage Status](https://coveralls.io/repos/github/YourSoftRun/moleculer-mailgun/badge.svg?branch=master)](https://coveralls.io/github/YourSoftRun/moleculer-mailgun?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0de33278dbe44f18966a2e9fa429fb69)](https://www.codacy.com/app/Hugome/moleculer-mailgun?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YourSoftRun/moleculer-mailgun&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/18d0be3409e2d85d419e/maintainability)](https://codeclimate.com/github/YourSoftRun/moleculer-mailgun/maintainability)
[![David](https://img.shields.io/david/YourSoftRun/moleculer-mailgun.svg)](https://david-dm.org/YourSoftRun/moleculer-mailgun)
[![Known Vulnerabilities](https://snyk.io/test/github/YourSoftRun/moleculer-mailgun/badge.svg)](https://snyk.io/test/github/YourSoftRun/moleculer-mailgun)

[![Downloads](https://img.shields.io/npm/dm/moleculer-mailgun.svg)](https://www.npmjs.com/package/moleculer-mailgun)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FYourSoftRun%2Fmoleculer-mailgun.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FYourSoftRun%2Fmoleculer-mailgun?ref=badge_shield)

## How to use it

```js
const MailgunMixin = require('moleculer-mailgun')

module.exports = {
  name: 'mailgun',
  mixins: [MailgunMixin],
  settings: {
    mailgun: {
      /** @type {String} Mailgun apiKey (https://app.mailgun.com/app/dashboard). */
      apiKey: '',
      /** @type {String} Mailgun region : US/EU (Default US). */
      region: MailgunMixin.regions.US,
      /** @type {String} Mailgun domain (Can be override by action meta). */
      domain: '',
      /** @type {Object?} Additional options for mailgun contructor */
      options: { },
      /** @type {Number} Max "To" by batch requests (It will chunk list by that, Mailgun limit : 1000) */
      bySendingBatch: 950,
      /** @type {Object?} Defaults options for mailgun send mail */
      defaults: { },
      /** @type {Object?} Webhooks handler (Placeholder {event} for event type) */
      webhooks: {
        /** @type {String?} Action to call after webhooks validated */
        action: undefined,
        /** @type {String?} Event to emit after webhooks validated */
        event: undefined
      }
    }
  }
}
```
