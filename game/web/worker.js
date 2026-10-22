importScripts('./vendor/rompatcher/HashCalculator.js', './vendor/rompatcher/BinFile.js', './vendor/rompatcher/vcdiff.js');
self.onmessage = async ({ data }) => {
  try {
    const digest = async (bytes) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map((x) => x.toString(16).padStart(2, '0')).join('');
    const result = new VCDIFF(new BinFile(data.delta)).apply(new BinFile(data.source), false)._u8array;
    self.postMessage({ output: result.buffer, hash: await digest(result) }, [result.buffer]);
  } catch (error) { self.postMessage({ error: error.message }); }
};
