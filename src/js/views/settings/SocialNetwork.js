import Component from '../../BaseComponent';
import Name from '../../components/Name';
import Key from '../../nostr/Key';
import SocialNetwork from '../../nostr/SocialNetwork';
import { translate as t } from '../../translations/Translation';

export default class SocialNetworkSettings extends Component {
  constructor() {
    super();
    this.state = {
      blockedUsers: [],
    };
  }
  render() {
    let hasBlockedUsers = false;
    let blockedUsers = Array.from(this.state.blockedUsers).map((user) => {
      const bech32 = Key.toNostrBech32Address(user, 'npub');
      if (bech32) {
        hasBlockedUsers = true;
        return (
          <div key={user}>
            <a href={`/${bech32}`}>
              <Name pub={user} />
            </a>
          </div>
        );
      }
    });

    const followDistances = Array.from(SocialNetwork.usersByFollowDistance.entries()).slice(1);

    return (
      <>
        <div class="centered-container">
          <h2>{t('social_network')}</h2>
          <h3>Stored on your device</h3>
          <p>Total size: {followDistances.reduce((a, b) => a + b[1].size, 0)} users</p>
          <p>Depth: {followDistances.length} degrees of separation</p>
          {followDistances.map((distance) => (
            <div>
              {distance[0]}: {distance[1].size} users
            </div>
          ))}
          <h3>{t('blocked_users')}</h3>
          {!hasBlockedUsers && t('none')}
          <p>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                this.setState({ showBlockedUsers: !this.state.showBlockedUsers });
              }}
            >
              {this.state.showBlockedUsers ? t('hide') : t('show')} {blockedUsers.length}
            </a>
          </p>
          {this.state.showBlockedUsers && blockedUsers}
        </div>
      </>
    );
  }
  componentDidMount() {
    SocialNetwork.getBlockedUsers((blockedUsers) => {
      this.setState({ blockedUsers });
    });
  }
}