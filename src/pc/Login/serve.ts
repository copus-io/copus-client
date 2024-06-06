import { EthereumProvider } from '@walletconnect/ethereum-provider';
import Web3 from 'web3';

class Server {
  static provider: any;
  static web3: any;
  public static account: any;
  public static state: boolean = false;
  protected static async initProvider(callback: Function) {
    this.provider = await EthereumProvider.init({
      projectId: '8a02973eb157922f76721624650089f0',
      chains: [1], // mainnet
      showQrModal: true,
    });

    this.web3 = new Web3(this.provider);

    this.provider.on('chainChanged', (chainId: any) => {
      console.info('chainChanged:', chainId);
    });

    this.provider.on('connect', (accounts: any[]) => {
      console.info('WC connect:', accounts);
    });

    this.provider.on('disconnect', (accounts: any[]) => {
      console.info('disconnect:', accounts);
    });

    this.provider.on('accountsChanged', (accounts: any[]) => {
      console.info('accountsChanged:', accounts);
      callback(accounts);
    });
  }

  public static async init(callback: Function) {
    if (!Server.state) {
      try {
        Server.state = true;
        await this.initProvider(callback);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

export default Server;
