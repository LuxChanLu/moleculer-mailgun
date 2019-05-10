/*
 * moleculer-mailgun
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-mailgun)
 * MIT Licensed
 */

'use strict'
const Mailgun = require('mailgun-js')
const MailComposer = require('nodemailer/lib/mail-composer')

module.exports = {
  /**
	 * Mailgun const
	 */
  regions: {
    US: 'api.mailgun.net',
    EU: 'api.eu.mailgun.net'
  },

  /**
	 * Default settings
	 */
  settings: {
    $secureSettings: ['mailgun'],
    mailgun: {
      /** @type {String} Mailgun apiKey (https://app.mailgun.com/app/dashboard). */
      apiKey: '',
      /** @type {String} Mailgun region (Default US). */
      region: module.exports.regions.US,
      /** @type {String} Mailgun domain (Can be override by action meta). */
      domain: '',
      /** @type {Object?} Additional options for mailgun contructor */
      options: { },
      /** @type {Object?} Defaults options for mailgun send mail */
      defaults: { }
    }
  },

  /**
	 * Actions
	 */
  actions: {

  },

  /**
	 * Methods
	 */
  methods: {
    async mailgun(ctx) {
      const { region, options, apiKey, domain } = this.settings.mailgun
      return Mailgun({
        apiKey,
        host: region,
        domain: ctx && ctx.meta && ctx.meta.domain ? ctx.meta.domain : domain,
        ...options
      })
    }
  }
}
