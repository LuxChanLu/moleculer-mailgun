const { ServiceBroker } = require('moleculer')
const QS = require('qs')
const MailgunMixin = require('../../../index')

describe('Basic integration', () => {
  const broker = new ServiceBroker({ logger: false })
  const mailgun = jest.fn()
  broker.createService({
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
    }
  })

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should send mail', async () => {
    mailgun.mockClear()
    await expect(broker.call('mailgun.campaigns.create', { id: 'test', name: 'TEST' })).resolves.toBeUndefined()
    expect(mailgun.mock.calls[0][0]).toMatchObject({ method: 'PUT', path: '/v3/example.org/campaigns', auth: 'api:examplekey' })
  })

})
