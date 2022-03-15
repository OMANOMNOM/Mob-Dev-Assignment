class TestIPAddress {
  /// So to test this on my phone i have to use the same IP address as the laptop running EXPO.
  // So set the address here.
  static address = '172.31.183.51';

  static port = '3333';

  static createAddress() {
    return `http://${TestIPAddress.address}:${TestIPAddress.port}`;
  }
}
export default TestIPAddress;
