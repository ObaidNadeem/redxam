import { ChangeRequest, User } from '@/database';
import { transporter } from '@/service/emailService';

const { SERVICE_EMAIL } = process.env;

/**
 * Watches contracts Requests.
 * Use for account statistics
 */
class RequestWatcher {
  private static watcher: NodeJS.Timeout;
  private static readonly interval = 600000;
  private get watcher() {
    return RequestWatcher.watcher;
  }
  private set watcher(watcher) {
    RequestWatcher.watcher = watcher;
  }
  private async updateRequest() {
    try {
      const lastRequestsPerUser = await ChangeRequest.aggregate([
        {
          $match: {
            timestamp: { $lt: Date.now() - 24 * 60 * 60 * 1000 },
            emailSent: false,
          },
        },
        { $sort: { timestamp: 1 } },
        {
          $group: {
            _id: '$_id',
            lastSalesDate: { $last: '$timestamp' },
            emailSent: { $last: '$emailSent' },
            requiredPortfolio: { $last: '$requiredPortfolio' },
            userId: { $last: '$userId' },
          },
        },
      ]);
      const requestList = [];
      lastRequestsPerUser.forEach(request => {
        requestList.push(sendRequestEmail(request));
      });
      await Promise.all(requestList);
    } catch (error) {
      console.log(error);
      this.stop();
    }
  }
  public async start() {
    if (this.watcher) {
      throw new Error('Request watcher already watching!');
    }

    console.info('Starting Request watcher...');
    await this.updateRequest();
    this.watcher = setInterval(this.updateRequest.bind(this), RequestWatcher.interval);
    console.info('Request watcher started!');
  }
  public stop() {
    if (!this.watcher) {
      throw new Error('No Request watcher running!');
    }

    console.info('Stopping Request watcher...');
    clearInterval(this.watcher);
    this.watcher = null;
    console.info('Request watcher stopped!');
  }
}

const sendRequestEmail = async request => {
  console.log(request);
  const user = await User.findOne({ _id: request.userId });
  await transporter
    .sendMail({
      from: `redxam.com <${SERVICE_EMAIL}>`,
      to: 'events.portfoliochanges@redxam.com',
      subject: `Request for change portfolio from user ${user.firstName} ${user.lastName}`,
      text: `
    Change request of portfolio from user ${user.firstName} ${user.lastName} user ID: ${user._id}
    from ${user.portfolio} to ${request.requiredPortfolio}`,
    })
    .then(async () => {
      await ChangeRequest.updateOne({ _id: request._id }, { $set: { emailSent: true } });
    });
};

export const requestWatcher = new RequestWatcher();
