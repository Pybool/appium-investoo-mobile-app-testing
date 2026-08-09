async function getScreenSize() {
  const { width, height } = await driver.getWindowSize();
  return { width, height };
}

export async function swipeLeft() {
  const { width, height } = await getScreenSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(width * 0.8), y: Math.round(height * 0.5) },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 300, x: Math.round(width * 0.2), y: Math.round(height * 0.5) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

export async function swipeRight() {
  const { width, height } = await getScreenSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(width * 0.2), y: Math.round(height * 0.5) },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 300, x: Math.round(width * 0.8), y: Math.round(height * 0.5) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

export async function scrollDown(fraction = 0.5) {
  const { width, height } = await getScreenSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(width * 0.5), y: Math.round(height * 0.7) },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 500, x: Math.round(width * 0.5), y: Math.round(height * (0.7 - fraction)) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

export async function scrollUp(fraction = 0.5) {
  const { width, height } = await getScreenSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(width * 0.5), y: Math.round(height * 0.3) },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 500, x: Math.round(width * 0.5), y: Math.round(height * (0.3 + fraction)) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
}

export async function pullToRefresh() {
  const { width, height } = await getScreenSize();
  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: Math.round(width * 0.5), y: Math.round(height * 0.25) },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 700, x: Math.round(width * 0.5), y: Math.round(height * 0.7) },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ]);
  await driver.releaseActions();
  await browser.pause(1500);
}
