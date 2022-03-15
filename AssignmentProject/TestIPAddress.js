class TestIPAddress {
  static address = '172.31.183.51';

  static port = '3333';

  static createAddress() {
    return `http://${TestIPAddress.address}:${TestIPAddress.port}`;
  }
}
export default TestIPAddress;
