import { setBundler, callPiletBuild, callPiletDebug, callPiralBuild, callPiralDebug, callDebugPiralFromMonoRepo } from './bundler';

let common: any;
let defaults = {
  bundler: false,
};

jest.mock('./inject', () => ({
  inject() {
    if (defaults.bundler) {
      setBundler({
        name: 'default',
        actions: {
          buildPilet: jest.fn(() => Promise.resolve({})),
          debugPilet: jest.fn(() => Promise.resolve({})),
          buildPiral: jest.fn(() => Promise.resolve({})),
          debugPiral: jest.fn(() => Promise.resolve({})),
          watchPiral: jest.fn(() => Promise.resolve({})),
        } as any,
      });
    }
  },
}));

jest.mock('./common', () => common = ({
  config: {
    bundler: 'parcel',
  },
  cliVersion: '1.0.0',
  installPackage: jest.fn(),
  fail(msg) {
    throw new Error(msg);
  },
  progress() { },
  log() { },
  determineNpmClient() {
    return 'npm';
  },
  patchModules: jest.fn(),
  logReset() { },
}));

describe('Piral CLI Bundler Module', () => {
  it('fails if no default bundler can be installed, but required', async () => {
    defaults.bundler = false;
    return expect(callPiletBuild({ root: undefined, } as any)).rejects.toThrow();
  });

  it('using no bundler installs a bundler if none available', async () => {
    defaults.bundler = true;
    return expect(callPiletBuild({ root: undefined, } as any)).resolves.not.toThrow();
  });

  it('setting the bundler can resolve it properly for call pilet build', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'foo1',
      actions: actions as any,
    });

    await callPiletBuild({ root: undefined, } as any, 'foo1');
    expect(actions.buildPilet).toHaveBeenCalled();
  });

  it('setting the bundler with optimize modules calls optimize modules', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'bar1',
      actions: actions as any,
    });

    await callPiletBuild({ root: undefined, optimizeModules: true } as any, 'bar1');
    expect(common.patchModules).toHaveBeenCalled();
  });

  it('using no bundler uses the first bundler when available', async () => {
    const result = await callPiletBuild({ root: undefined, optimizeModules: false } as any);
    expect(result).not.toBeUndefined();
  });

  it('setting the bundler can resolve it properly for call piral build', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'foo2',
      actions: actions as any,
    });

    await callPiralBuild({ root: undefined, } as any, 'foo2');
    expect(actions.buildPiral).toHaveBeenCalled();
  });

  it('setting the bundler can resolve it properly for call pilet debug', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'foo3',
      actions: actions as any,
    });

    await callPiletDebug({ root: undefined, } as any, 'foo3');
    expect(actions.debugPilet).toHaveBeenCalled();
  });

  it('setting the bundler can resolve it properly for call piral debug', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'foo4',
      actions: actions as any,
    });

    await callPiralDebug({ root: undefined, } as any, 'foo4');
    expect(actions.debugPiral).toHaveBeenCalled();
  });

  it('setting the bundler can resolve it properly for call piral watch', async () => {
    const actions = {
      buildPilet: jest.fn(() => Promise.resolve({})),
      debugPilet: jest.fn(() => Promise.resolve({})),
      buildPiral: jest.fn(() => Promise.resolve({})),
      debugPiral: jest.fn(() => Promise.resolve({})),
      watchPiral: jest.fn(() => Promise.resolve({})),
    };

    setBundler({
      name: 'foo5',
      actions: actions as any,
    });

    await callDebugPiralFromMonoRepo({ root: undefined, } as any, 'foo5');
    expect(actions.watchPiral).toHaveBeenCalled();
  });

  it('using a non-available bundler should fail', () => {
    return expect(callDebugPiralFromMonoRepo({ root: undefined, } as any, 'qxz')).rejects.toThrow();
  });
});
