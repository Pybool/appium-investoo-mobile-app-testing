const PROXY_HOST = process.env.MITM_PROXY_HOST ?? '192.168.0.135';
const PROXY_PORT = process.env.MITM_PROXY_PORT ?? '8899';

export async function enableDeviceProxy() {
  await driver.execute('mobile: shell', {
    command: 'settings',
    args: ['put', 'global', 'http_proxy', `${PROXY_HOST}:${PROXY_PORT}`],
  });
}

export async function disableDeviceProxy() {
  await driver.execute('mobile: shell', {
    command: 'settings',
    args: ['put', 'global', 'http_proxy', ':0'],
  });
}
