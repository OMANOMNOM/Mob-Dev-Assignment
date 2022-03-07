class TestIPAddress {
  static address = '192.168.1.76';

  static port = '3333';

  static createAddress() {
    return `http://${TestIPAddress.address}:${TestIPAddress.port}`;
  }
}
export default TestIPAddress;
