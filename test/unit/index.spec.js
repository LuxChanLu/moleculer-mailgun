const { ServiceBroker } = require('moleculer')
const QS = require('qs')
const MailgunMixin = require('../../index')

describe('Basic integration', () => {
  const broker = new ServiceBroker({ logger: false })
  const mailgun = jest.fn()
  const webhooks = {
    action: jest.fn(() => true),
    event: jest.fn()
  }
  const service = broker.createService({
    name: 'mailgun',
    mixins: [MailgunMixin],
    settings: {
      mailgun: {
        apiKey: 'examplekey',
        region: MailgunMixin.regions.EU,
        options: {
          testMode: true,
          testModeLogger: mailgun,
          mute: true
        },
        bySendingBatch: 2,
        domain: 'example.org',
        defaults: {
          from:'Example <test@example.org>'
        }
      }
    },
    actions: {
      'events.test': ({ params }) => webhooks.action(params)
    },
    events: {
      'mailgun.events.test': payload => webhooks.event(payload)
    }
  })
  const mailgunClientGenerator = service.mailgun

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should send mail', async () => {
    mailgun.mockClear()
    await expect(broker.call('mailgun.send', { to: 'test@example.org' })).resolves.toBeUndefined()
    expect(mailgun.mock.calls[0][0]).toMatchObject({ path: '/v3/example.org/messages', auth: 'api:examplekey' })
  })

  it('should get current domain info', async () => {
    mailgun.mockClear()
    await expect(broker.call('mailgun.domain')).resolves.toBeUndefined()
    expect(mailgun.mock.calls[0][0]).toMatchObject({ path: '/v3/domains/example.org' })
  })

  it('should send a batch', async () => {
    mailgun.mockClear()
    const to = {
      'test1@example.org': { firstname: 'Test1', lastname: 'Example' },
      'test2@example.org': { firstname: 'Test2', lastname: 'Example' },
      'test3@example.org': { firstname: 'Test3', lastname: 'Example' },
      'test4@example.org': { firstname: 'Test4', lastname: 'Example' },
      'test5@example.org': { firstname: 'Test5', lastname: 'Example' },
      'test6@example.org': { firstname: 'Test6', lastname: 'Example' }
    }
    await expect(broker.call('mailgun.batch', { to }, { meta: { domain: 'example.net' } })).resolves.toMatchObject([undefined, undefined, undefined])
    expect(mailgun.mock.calls[0][0]).toMatchObject({ path: '/v3/example.net/messages' })
    expect(QS.parse(mailgun.mock.calls[0][1])).toMatchObject({ to: ['test1@example.org', 'test2@example.org'] })
    expect(QS.parse(mailgun.mock.calls[1][1])).toMatchObject({ to: ['test3@example.org', 'test4@example.org'] })
    expect(QS.parse(mailgun.mock.calls[2][1])).toMatchObject({ to: ['test5@example.org', 'test6@example.org'] })
  })

  it('should validate email', async () => {
    mailgun.mockClear()
    await expect(broker.call('mailgun.validate', { email: 'test@example.org' })).resolves.toBeFalsy()
    expect(mailgun.mock.calls[0][0]).toMatchObject({ path: `/v3/address/validate?${QS.stringify({ address: 'test@example.org' })}` })
    service.mailgun = jest.fn(() => ({ validate: () => ({ is_valid: true }) }))
    await expect(broker.call('mailgun.validate', { email: 'test@example.org' })).resolves.toBeTruthy()
    service.mailgun = mailgunClientGenerator
  })

  it('should handle webhooks', async () => {
    mailgun.mockClear()
    await expect(broker.call('mailgun.webhooks', { signature: {}, 'event-data': { event: 'test' } })).resolves.toBeFalsy()
    service.validateWebhook = jest.fn(() => true)
    await expect(broker.call('mailgun.webhooks', { signature: {}, 'event-data': { event: 'test' } })).resolves.toBeTruthy()

    service.settings.mailgun.webhooks.action = 'mailgun.events.{event}'
    await expect(broker.call('mailgun.webhooks', { signature: {}, 'event-data': { event: 'test' } })).resolves.toBeTruthy()
    expect(webhooks.action).toHaveBeenCalledWith({ event: 'test' })
    expect(webhooks.event).not.toHaveBeenCalled()

    webhooks.action.mockClear()
    webhooks.event.mockClear()
    service.settings.mailgun.webhooks.action = undefined
    service.settings.mailgun.webhooks.event = 'mailgun.events.{event}'
    await expect(broker.call('mailgun.webhooks', { signature: {}, 'event-data': { event: 'test' } })).resolves.toBeTruthy()
    expect(webhooks.event).toHaveBeenCalledWith({ event: 'test' })
    expect(webhooks.action).not.toHaveBeenCalled()

    service.settings.mailgun.webhooks.action = undefined
    service.settings.mailgun.webhooks.event = undefined
    service.validateWebhook.mockRestore()
  })
})
