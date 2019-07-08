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
    'domains.list': {
      async handler(ctx) {
        return this.mailgun(ctx).request('GET', '/domains', ctx.params)
      }
    },
    'domains.get': {
      params: { domain: 'string' },
      async handler(ctx) {
        const { domain } = ctx.params
        return this.mailgun(ctx).domains(domain).info()
      }
    },
    'domains.create': {
      async handler(ctx) {
        return this.mailgun(ctx).domains().create(ctx.params)
      }
    },
    'domains.delete': {
      params: { domain: 'string' },
      async handler(ctx) {
        const { domain } = ctx.params
        return this.mailgun(ctx).domains(domain).delete()
      }
    },
    'domains.verify': {
      params: { domain: 'string' },
      async handler(ctx) {
        const { domain } = ctx.params
        return this.mailgun(ctx).domains(domain).verify().verify()
      }
    },

    'domains.webhooks.list': {
      params: { domain: 'string' },
      async handler(ctx) {
        const { domain } = ctx.params
        return this.mailgun(ctx).request('GET', `/domains/${domain}/webhooks`)
      }
    },
    'domains.webhooks.get': {
      params: { domain: 'string', webhook: 'string' },
      async handler(ctx) {
        const { domain, webhook } = ctx.params
        return this.mailgun(ctx).request('GET', `/domains/${domain}/webhooks/${webhook}`)
      }
    },
    'domains.webhooks.create': {
      params: { domain: 'string', webhook: 'string', url: 'string' },
      async handler(ctx) {
        const { domain, webhook, url } = ctx.params
        return this.mailgun(ctx).request('POST', `/domains/${domain}/webhooks`, { id: webhook, url })
      }
    },
    'domains.webhooks.update': {
      params: { domain: 'string', webhook: 'string', url: 'string' },
      async handler(ctx) {
        const { domain, webhook, url } = ctx.params
        return this.mailgun(ctx).request('PUT', `/domains/${domain}/webhooks/${webhook}`, { url })
      }
    },
    'domains.webhooks.delete': {
      params: { domain: 'string', webhook: 'string' },
      async handler(ctx) {
        const { domain, webhook } = ctx.params
        return this.mailgun(ctx).request('DELETE', `/domains/${domain}/webhooks/${webhook}`)
      }
    },

    'domains.tracking': {
      params: { domain: 'string' },
      async handler(ctx) {
        const { domain } = ctx.params
        return this.mailgun(ctx).request('GET', `/domains/${domain}/tracking`)
      }
    },
    'domains.tracking.open': {
      params: { domain: 'string', active: { type: 'enum', values: ['yes', 'no'] } },
      async handler(ctx) {
        const { domain, active } = ctx.params
        return this.mailgun(ctx).request('PUT', `/domains/${domain}/tracking/open`, { active })
      }
    },
    'domains.tracking.click': {
      params: { domain: 'string', active: { type: 'enum', values: ['yes', 'no', 'htmlonly'] } },
      async handler(ctx) {
        const { domain, active } = ctx.params
        return this.mailgun(ctx).request('PUT', `/domains/${domain}/tracking/click`, { active })
      }
    },
    'domains.tracking.unsubscribe': {
      params: { domain: 'string', active: 'boolean', html_footer: 'string', text_footer: 'string' },
      async handler(ctx) {
        const { domain, active, html_footer, text_footer } = ctx.params
        return this.mailgun(ctx).request('PUT', `/domains/${domain}/tracking/unsubscribe`, { active, html_footer, text_footer })
      }
    }
  }
}
