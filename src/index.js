/*
 * moleculer-mailgun
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-mailgun)
 * MIT Licensed
 */

'use strict'
const Mailgun = require('mailgun-js')
const Chunk = require('chunk')

const BouncesApi = require('./api/bounces.js')
const ComplaintsApi = require('./api/complaints.js')
const CredentialsApi = require('./api/credentials.js')
const DomainApi = require('./api/domain.js')
const EventsApi = require('./api/events.js')
const ListApi = require('./api/list.js')
const MessageApi = require('./api/message.js')
const RoutesApi = require('./api/routes.js')
const StatsApi = require('./api/stats.js')
const TagsApi = require('./api/tags.js')
const TrackingApi = require('./api/tracking.js')
const UnsubscribesApi = require('./api/unsubscribes.js')

const regions = {
  US: 'api.mailgun.net',
  EU: 'api.eu.mailgun.net'
}

module.exports = {
  mixins: [
    BouncesApi, ComplaintsApi, CredentialsApi, DomainApi, EventsApi,
    ListApi, MessageApi, RoutesApi, StatsApi, TagsApi, TrackingApi,
    UnsubscribesApi
  ],
  /**
	 * Mailgun const
	 */
  regions,

  /**
	 * Default settings
	 */
  settings: {
    $secureSettings: ['mailgun'],
    mailgun: {
      /** @type {String} Mailgun apiKey (https://app.mailgun.com/app/dashboard). */
      apiKey: '',
      /** @type {String} Mailgun region (Default US). */
      region: regions.US,
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
        /** @type {String?} Action to call */
        action: undefined,
        /** @type {String?} Event to emit */
        event: undefined
      },
    }
  },

  /**
	 * Actions
	 */
  actions: {
    send: {
      params: { to: 'email' },
      async handler(ctx) {
        return this.send(ctx, ctx.params)
      }
    },
    domain: {
      async handler(ctx) {
        return this.mailgun(ctx).domains(this.domain(ctx)).info()
      }
    },
    batch: {
      params: { to: 'object' },
      async handler(ctx) {
        const results = []
        let params = { ...ctx.params, 'recipient-variables': {} }
        for (const chunk of Chunk(Object.entries(ctx.params.to), this.settings.mailgun.bySendingBatch)) {
          params.to = chunk.map(([key, vars]) => {
            params['recipient-variables'][key] = vars
            return key
          })
          results.push(await this.send(ctx, params))
        }
        return results
      }
    },
    validate: {
      params: { email: 'email' },
      async handler(ctx) {
        const body = await (this.mailgun(ctx)).validate(ctx.params.email)
        return body !== undefined && body.is_valid === true
      }
    },
    webhooks: {
      params: { signature: 'object', 'event-data': 'object' },
      async handler(ctx) {
        const { signature } = ctx.params
        if (this.validateWebhook(ctx, signature)) {
          const { action, event } = this.settings.mailgun.webhooks
          const eventData = ctx.params['event-data']
          if (event) {
            ctx.emit(event.replace(/\{event\}/g, eventData.event), eventData)
          }
          if (action) {
            return ctx.call(action.replace(/\{event\}/g, eventData.event), eventData)
          }
          return true
        }
        return false
      }
    }
  },

  /**
	 * Methods
	 */
  methods: {
    domain(ctx) {
      return ctx && ctx.meta && ctx.meta.domain ? ctx.meta.domain : this.settings.mailgun.domain
    },
    mailgun(ctx) {
      const { region, options, apiKey } = this.settings.mailgun
      return Mailgun({
        apiKey,
        host: region,
        domain: this.domain(ctx),
        ...options
      })
    },
    send(ctx, params) {
      return this.mailgun(ctx).messages().send({ ...this.settings.mailgun.defaults, ...params })
    },
    validateWebhook(ctx, { timestamp, token, signature }) {
      return this.mailgun(ctx).validateWebhook(timestamp, token, signature)
    }
  }
}
