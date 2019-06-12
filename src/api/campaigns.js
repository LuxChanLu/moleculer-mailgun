/*
 * moleculer-mailgun
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-mailgun)
 * MIT Licensed
 */

'use strict'
module.exports = {
  settings: {},
  /**
	 * Actions
	 */
  actions: {
    'campaigns.create': {
      async handler(ctx) {
        return this.mailgun(ctx).request('PUT', '/campaigns', ctx.params)
      }
    }
  },
}
