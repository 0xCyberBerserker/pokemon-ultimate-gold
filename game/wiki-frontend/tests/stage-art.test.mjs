import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { stageIllustration } from '../src/features/trainers/stage-art.ts';

function pngDimensions(image) {
  assert.equal(image.toString('hex', 0, 8), '89504e470d0a1a0a', 'valid PNG signature');
  assert.equal(image.toString('ascii', 12, 16), 'IHDR', 'PNG starts with IHDR');
  return [image.readUInt32BE(16), image.readUInt32BE(20)];
}

function webpDimensions(image) {
  assert.equal(image.toString('ascii', 0, 4), 'RIFF', 'valid WebP RIFF container');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP', 'valid WebP signature');
  for (let offset = 12; offset + 8 <= image.length;) {
    const type = image.toString('ascii', offset, offset + 4);
    const size = image.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + size <= image.length, `${type} chunk stays inside the WebP file`);
    if (type === 'VP8X') {
      assert.ok(size >= 10, 'VP8X header has canvas dimensions');
      return [1 + image.readUIntLE(data + 4, 3), 1 + image.readUIntLE(data + 7, 3)];
    }
    if (type === 'VP8L') {
      assert.ok(size >= 5 && image[data] === 0x2f, 'VP8L header is valid');
      const b1 = image[data + 1], b2 = image[data + 2], b3 = image[data + 3], b4 = image[data + 4];
      return [1 + (((b2 & 0x3f) << 8) | b1), 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | (b2 >> 6))];
    }
    if (type === 'VP8 ') {
      assert.ok(size >= 10 && image[data + 3] === 0x9d && image[data + 4] === 0x01 && image[data + 5] === 0x2a, 'VP8 frame header is valid');
      return [image.readUInt16LE(data + 6) & 0x3fff, image.readUInt16LE(data + 8) & 0x3fff];
    }
    offset = data + size + (size & 1);
  }
  assert.fail('WebP has no supported image dimension chunk');
}

test('decorative illustrations are bound to their own documented stages', async () => {
  const journey = JSON.parse(await readFile(new URL('../../web/data/trainer-journey.json', import.meta.url)));
  const webpHashes = {
    'sprout-tower.png': 'f02e1a5b0618071e2e6f352bc8a3f8065f610e17bed672829ff4590e31c3f8ae',
    'ruins-of-alph.png': '12e6128a9093074bf45dbe55d3f205f8082133aa34eb3c3c5dae334d78719a9b',
    'violet-city-gym.png': 'cd2942c36f7f7f88d007c747a4bff36c0af12a41b7b0bc54bce670fe0e3ac930',
    'union-cave.png': '2701a49a31b95182dc5c835b1d8678b668d1e4158d7a71f76c0633f5af768f58',
    'slowpoke-well.png': '9738eed2125656f43958cfaa577cacab92040578b2fd97917473491cf5785e15',
    'azalea-town-gym.png': '7e3fda41852d71f2de1912f76a8f7964649b0c0fe20c31fe8991ed00d94bbf6f',
    'azalea-town.png': '562085b3ca7744d2d2db7f7388e1db82d291b897a78689d29b89a9f60cf28a40',
    'goldenrod-tunnel.png': '638724d15833fe7181fb7eb571eb9415c2d65bb3fccfda0a7f26b5e4cad5a507',
    'goldenrod-city-gym.png': '8bde7444406718bd14b9a887f7a40ba57a20cff5b622f50dce52c7030acd7e8b',
    'national-park.png': '6224e44b5b041b6d31eaf3324477b8f2a382b077e22508a815c85718c35892d9',
    'burned-tower.png': '5c2444bdf9f4c113dd8bdadb1d52c76d99c76adc1f20858fcded2e3bb238c58f',
    'ecruteak-city.png': '8aaa19b429e3237af91bfd4234797026e0e0841cc5b96ac66b54227da0b139c1',
    'ecruteak-city-gym.png': '183414ab1f3861050765fe4bf9a2926f62cc86dd37cefcca0e28d1196713b32b',
    'olivine-city.png': '7d21a38215741ecde7b9ba3772e9d1b2daa26a6b5cb6f30016cc889483905f39',
    'olivine-lighthouse.png': '39701b1ea3c520cb0b065c8a0d28be222c4bde1a8fc95171696e693b996a44fc',
    'cianwood-city.png': '302672d8c3e8962c01911c09c41121fd16dc4cb99bad9aa46de7b4b6a8c7ddaf',
    'cianwood-city-gym.png': '241c37ba4a38795ec7876a3fa1cb039dcc69b08888bc2731e6725ba5fdeb1f49',
    'cliff-edge-gate.png': 'e8c00b33833275ee439b18327695428e6f8e56e67a1a9f422359316398aeeddc',
    'cliff-cave.png': '51ed7508f16bb058dc35b99b8af6df4bc66b3d486b9783a806647a0dea98edde',
    'safari-zone-gate.png': 'ac1d4a3baed8820e0420951ed6fab5fd1d7871fc37c04f820ccd8dfbbcf6f1e3',
    'olivine-city-gym.png': 'ccdf5bf84be32dc7ff2894a9840c37145159db261d027eb190ad3586893ac381',
    'mt-mortar.png': 'c6e3c6198eeaa0a39e3603f0051535ac0b0df572c0db2b0a4e60946068c58379',
    'team-rocket-hq.png': '05ce9d7354e84be9e5df9f645e47137e0092574a55d48e1c49162ee476a5d02f',
    'mahogany-town-gym.png': 'fab2b7bfc956098cd19014548411b21a8f0c98c86e96f7775a8206e0e4cc9f58',
    'radio-tower.png': 'f501b6707663e1546a8523d8934b10b2c4dc91fc6f271872292f733469706fc0',
    'goldenrod-city.png': '4fba9b58e262a713aba9fc6d3e0319d264baeb6d4a01f318943b17130f5d39cd',
    'blackthorn-city-gym.png': 'f96c97c2609619e8b2dc3cdb8405eaf993573c5b5f6d47d9791991001c640032',
    'dragons-den.png': 'cca189a58fa26fd76b812536654ac4a75156713bbc5a1d70d8fc8249a72daf47',
    'victory-road.png': '215c38168d87ad92124139c58a56326954240806e8c01ac7ea84a36ee82d474c',
    'pokemon-league.png': 'a1883516f937964365a7862cbb29deee24a1936c5378e097854577401c11f19f',
    'ss-aqua.png': '5ed02377122e467d84b9f47af82ccb3407bd037e4dcc81180709c923ad58eef3',
    'pewter-city-gym.png': '7d493cffa86d3a817e0e0b59d18a0985eba1e06cc37f8d1141e34fc66f0fe24e',
  };
  const cases = [
    ['stage-01', 'Cherrygrove City', 'cherrygrove-city.png', '38dc8fcf71e931df9953dab85963d9bc0d732bccf174fa4edd8fba6d9576059f'],
    ['stage-02', 'Route 30', 'route-30.png', '0c0d9bca9a3346014dd0a19c3b3efe5daf5f5491cabd428576acaec2395c98fd'],
    ['stage-03', 'Route 31', 'route-31.png', 'a02ccb20c73d48845b90179c016d137544dd2b616a60e7e69767286ae14eb549'],
    ['stage-04', 'Sprout Tower', 'sprout-tower.png', 'e41561ed67c0736ceb771966ef52648f07406a9539963e153458f7af4f32d6aa'],
    ['stage-05', 'Ruins of Alph', 'ruins-of-alph.png', '5b5cd31f9398171eae3ece812f9aa4c05dae32440291ecd19974772cf6ecd253'],
    ['stage-06', 'Violet City Gym', 'violet-city-gym.png', 'ee406c34b8416f28e2472aa1c72f3eef374195ff6d45ab918c1fd9c6f7fa7325'],
    ['stage-07', 'Route 32', 'route-32.png', '9a6080a93c2a7fc8421e001ac9a5c5173391bba7fc4dab5dc6f0ca64ecd11463'],
    ['stage-08', 'Union Cave', 'union-cave.png', '8fe84b00c07ab8712809e92394afa1c8d3c077a000f64dc13351b09f8690d056'],
    ['stage-09', 'Route 33', 'route-33.png', '179c58c17659fb4374415c1291e11b639ec7860ac271d518a9d745fcf21ffaba'],
    ['stage-10', 'Slowpoke Well', 'slowpoke-well.png', 'e3ef1de14cbfd8be348bf4c629bd1b104421ca63d3c80424adf3db88527ab8da'],
    ['stage-11', 'Azalea Town Gym', 'azalea-town-gym.png', '98feaa4be2746200f8fc5701ef628604ee7abcac44f2c96f3fce83406172af16'],
    ['stage-12', 'Azalea Town', 'azalea-town.png', '261a9266b445f2df6828b74d31b4f7ec77613e5127ee1b4ece2f61cce3d8eaa0'],
    ['stage-13', 'Route 34', 'route-34.png', 'f06afe6f354670055cd5f25e1173d2e159c072961da10e5cb4404cfac5c38033'],
    ['stage-14', 'Goldenrod Tunnel', 'goldenrod-tunnel.png', 'fed5082c1700d7252be75f35abec9392954173300a86e14c80e8272c56e55fc9'],
    ['stage-15', 'Goldenrod City Gym', 'goldenrod-city-gym.png', '02f8d2e3e1f59da80279f8a834c805daf3c4f0696218e38d6e563c8aac0b2ca2'],
    ['stage-17', 'Route 35', 'route-35.png', '7da0e49fb39bd47928d12c2aeae46777b7242b2ce877260cd1775f7d23d3a6a6'],
    ['stage-18', 'National Park', 'national-park.png', '9d1153445413a3a59d67caf242864eddb8e15dcd4b5df66063705c919535f820'],
    ['stage-19', 'Route 36', 'route-36.png', 'b03a3d3023b1a50a2f278a2d51f04fb5706eb50b10c74436a5b2486f64f9bcf9'],
    ['stage-20', 'Route 37', 'route-37.png', '043f6641452e706550b0bece324510a9add443792d149887c1c3aabbcdb61b99'],
    ['stage-21', 'Burned Tower', 'burned-tower.png', 'e75e36447476b7b769116153bf718f4dec3cd3cc7df671efcc52980899f9d844'],
    ['stage-22', 'Ecruteak City', 'ecruteak-city.png', '7337ec490276d83e212bee375039b25768b3e835893875da1b4eabaa94d3a0fa'],
    ['stage-23', 'Ecruteak City Gym', 'ecruteak-city-gym.png', 'aacafc5bb04851f7db431f78c033d3d2b379b548963eec84e18271f464265e61'],
    ['stage-24', 'Route 38', 'route-38.png', '4238c63b302ed805c9b35d167cff54b356cc60a0d63e30c718a7c46fbd65a7e3'],
    ['stage-25', 'Route 39', 'route-39.png', 'fb3234d3e345160e4e652f76faee48a5a8879a0f6f3ecb4abf7207ef250e509a'],
    ['stage-26', 'Olivine City', 'olivine-city.png', '2a1d6ab023a032d548d120d31ce35af6b13c9d1ed175161cfc71b90416587a15'],
    ['stage-27', 'Olivine Lighthouse', 'olivine-lighthouse.png', '1de06c970b908c2d51ef266cfd5f20cb65246c32ef0706bd921752d03169697e'],
    ['stage-28', 'Route 40', 'route-40.png', 'cc7e931e3932b8d3667984a1ffdbcd8994a6b2a439652f6b8d041054a38f30ac'],
    ['stage-29', 'Route 41', 'route-41.png', '998487867c757b96ecfe81b5b71e0202b7f8a3729c45e951015f5493badc23e0'],
    ['stage-30', 'Cianwood City', 'cianwood-city.png', '3c489ee2b9f1231adead8801b2968806cea27d4c2d3ce8979ad34ac437687a75'],
    ['stage-31', 'Cianwood City Gym', 'cianwood-city-gym.png', '6518614adde0640ffcf60d552b822cbf9046af982ebc68a70ef88a2e38b19748'],
    ['stage-32', 'Cliff Edge Gate', 'cliff-edge-gate.png', '71f7ce3ef20faa23f9584243310d94b732906bc325de9b13d3223f88abe65adb'],
    ['stage-37', 'Route 42', 'route-42.png', '7290eeb5879edb734da8f07330cbc8ad62a3d53060b7c679a44f0764130bc1a1'],
    ['stage-39', 'Route 43', 'route-43.png', '19de0517ddcf21858b89ab358cb69e727548b6ba05e4e41aa80db1aa730469a6'],
    ['stage-44', 'Route 44', 'route-44.png', '6abfc1a978c82b80da16f7abb176964be8cca29479b8dd5363866876a9ede3f5'],
    ['stage-45', 'Route 45', 'route-45.png', '836b96ce132a0671fc345fc7280b984b30a26aa93ed884a86aea7065b7600192'],
    ['stage-16', 'Route 46', 'route-46.png', '33d4e0d41ffac21d22f467a5ecdc497eec00e511cda5597492c7f809de742dfd'],
    ['stage-33', 'Route 47', 'route-47.png', 'aefc11e3b949081cd099b7db69511349f797bccd503e14bdb2004dd09fd3d61a'],
    ['stage-34', 'Cliff Cave', 'cliff-cave.png', '1abd4aed86eecbb77341862b0cc92b57c578ea37b07801d91fd13e6aeb1e52fa'],
    ['stage-35', 'Safari Zone Gate', 'safari-zone-gate.png', 'c548a70decbe660657ffcbae64d43e6ac7cb91b1686dd1be94cea57b6ac5050a'],
    ['stage-36', 'Olivine City Gym', 'olivine-city-gym.png', '1834f4b7fce28acdc03b9e44071062316c5c92530682cf57cbd3546c6c2a600d'],
    ['stage-38', 'Mt. Mortar', 'mt-mortar.png', 'c89f88a7ec6a396329027bc4de8a95abe64d57e9dac38fa80a7578c0303425f9'],
    ['stage-40', 'Team Rocket HQ', 'team-rocket-hq.png', '1152ca9bd0ee8820c4ace942573f92a2070a041605cbd7f0d3147ffb8434b11a'],
    ['stage-41', 'Mahogany Town Gym', 'mahogany-town-gym.png', '72d86ab611a20d6c68937a3192cf0935d03262bf7038e6f4571857145e4f4986'],
    ['stage-42', 'Radio Tower', 'radio-tower.png', '4b767c16d7c1b7c4a357d28911ea043a14a8605ab9bf434ea30b062055d64490'],
    ['stage-43', 'Goldenrod City', 'goldenrod-city.png', '2f6de28a66810d7868d1e214a2c7bebadbb7e9670a4481e049c9e2bb999300b5'],
    ['stage-46', 'Blackthorn City Gym', 'blackthorn-city-gym.png', '5f7b41ddcd9af4b6881bb2302a453c9c8acc96ca5fac995ced2768df687ef79e'],
    ['stage-47', "Dragon's Den", 'dragons-den.png', '30ecd58da4cb5f72fbcb7d51490cafb2191f3292f35651c82e490a505ae6fe7b'],
    ['stage-50', 'Victory Road', 'victory-road.png', '02d2f0261a25b4f60119cf9c55b69d2277458d32a77810239f8459c366570388'],
    ['stage-51', 'Pokémon League', 'pokemon-league.png', 'd4527a60433705149381b7c283f3148a397f5bff1f009fff7b2f1a6084cc93a2'],
    ['stage-52', 'S.S. Aqua ~ First Voyage', 'ss-aqua.png', 'd3a47e7d69f0eb984f9662e34abe7f9ff3cadfe271b06af7b60b38e0240b9de4'],
    ['stage-53', 'S.S. Aqua ~ Vermilion to Olivine', 'ss-aqua.png', 'd3a47e7d69f0eb984f9662e34abe7f9ff3cadfe271b06af7b60b38e0240b9de4'],
    ['stage-54', 'S.S. Aqua ~ Olivine to Vermilion', 'ss-aqua.png', 'd3a47e7d69f0eb984f9662e34abe7f9ff3cadfe271b06af7b60b38e0240b9de4'],
    ['stage-58', 'Pewter City Gym', 'pewter-city-gym.png', '375ebf97b2b8152f654d1acbf9dffda1eb39eacf195de9d1ba8711e621715eba'],
    ['stage-48', 'Route 27', 'route-27.png', 'cf8a817aa52822c2d3de4b270a397a74f9a5dbc03832f40de489ea01dc9a350f'],
    ['stage-49', 'Route 26', 'route-26.png', '9dab37d3d985c3a85d4ebb78bc2b95f28e67832cbe895b3304bbf16da1f318f0'],
    ['stage-55', 'Route 6', 'route-6.png', '899aba4ce43a223a9736dd9d27d7a5839959cf34d6652e390cb6b1acfd337d98'],
    ['stage-56', 'Route 2 ~ North', 'route-2.png', '509eb8461ba80710eb4944f804139db164de95ff3073992e7c511d593592d547'],
    ['stage-57', 'Route 3', 'route-3.png', 'fecf55b5731c1c2a8099bf1d055ed9753c174c15b9854f6f0ab323322591e164'],
    ['stage-60', 'Route 4', 'route-4.png', '0b7d06b84e52422acf2408a005913eb3ded9722bf340674c1cb321fc021f9970'],
    ['stage-61', 'Route 9', 'route-9.png', '24dba49c7fcaf52310c261bfc5dbd2de20d21fec61173bcfd739fe693f8d5765'],
    ['stage-62', 'Route 24', 'route-24.png', '23486e15757cc245eadef9bb0bec161d8b98cb92577ee38750d9bc874854e13b'],
    ['stage-63', 'Route 25', 'route-25.png', 'a8e496d92b915a7e3e349483029e13666ed17a6fc9d14e8c8eee76e2bca7d327'],
    ['stage-66', 'Route 10', 'route-10.png', '23e72deb07b22526d7fff591f2fb9780db4e714eaec342adbc2ca468adf9422b'],
    ['stage-67', 'Route 8', 'route-8.png', '681909f299e99899d2b4db503509f558e2d2a8890f711e5ad37b0b1e1d2fd9da'],
    ['stage-68', 'Route 11', 'route-11.png', '1ae9cf85ef88cccd4f6f84a3262068268aa6a4816f266b9bb7c6e0f1f0f0d3d2'],
    ['stage-69', 'Route 12', 'route-12.png', '3ae699104e4e2eb3261a59c944a83e75cff231707c52a7d6a1fbfa34c5019047'],
    ['stage-70', 'Route 13', 'route-13.png', 'a68ec862168d78e7974c5384dc5433103cfeaa9d083b06ff268043a31e33cd0e'],
    ['stage-71', 'Route 14', 'route-14.png', 'f03f067aa8f9bac2658d8ce26196b0aef156751b71eb0224cc4e6d54b408cc0c'],
    ['stage-72', 'Route 15', 'route-15.png', 'd159ff796640fd875439b18b81c611d567b5c879ecb878d5cb5a9003a306c508'],
    ['stage-75', 'Route 17', 'route-17.png', '3a5b84213256a7bb40130f39a141326e56d1b36a070bbbaf4dee2efa41e10e15'],
    ['stage-74', 'Route 18', 'route-18.png', '2030f53f4d98ebcb2fbe77d43ccd8f1136a677eec30fc801eceaad2592e7a471'],
    ['stage-78', 'Route 19', 'route-19.png', 'fa8a54024306698bdf9a8b70b856f538ab4bb9a1c851d2a0467128fbd66e66a1'],
    ['stage-79', 'Route 20 ~ East', 'route-20.png', '4f6cc496927a8d34db6a56dc6e0078f3a52fb232c6d5d5840acff7460d689b6b'],
    ['stage-81', 'Route 20 ~ West', 'route-20.png', '4f6cc496927a8d34db6a56dc6e0078f3a52fb232c6d5d5840acff7460d689b6b'],
    ['stage-83', 'Route 21', 'route-21.png', '39d8746219b1b62688561dcb594ce79a20c3fa632d241a7a76ce96fb6430b296'],
    ['stage-84', 'Route 1', 'route-1.png', '64f4ddcd65c7a4c207907439a3cec5aaeeeba7812a2fdf2bfc19d2b87176483b'],
    ['stage-85', 'Route 2 ~ South', 'route-2.png', '509eb8461ba80710eb4944f804139db164de95ff3073992e7c511d593592d547'],
  ];
  for (const [id, name, file, hash] of cases) {
    assert.equal(journey.stages.find((stage) => stage.id === id)?.name.en, name);
    assert.equal(stageIllustration(id), `../assets/locations/${file}`);
    const image = await readFile(new URL(`../../web/assets/locations/${file}`, import.meta.url));
    assert.equal(createHash('sha256').update(image).digest('hex'), hash);
    const webpPath = new URL(`../../web/assets/locations/${file.replace(/\.png$/, '.webp')}`, import.meta.url);
    const webp = await readFile(webpPath);
    assert.ok(webp.byteLength > 0, `${file} WebP exists`);
    if (webpHashes[file]) assert.equal(createHash('sha256').update(webp).digest('hex'), webpHashes[file]);
    const [sourceWidth, sourceHeight] = pngDimensions(image);
    const [webpWidth, webpHeight] = webpDimensions(webp);
    assert.ok(webpWidth <= 1600 && webpHeight <= 1600, `${file} WebP stays within 1600px`);
    assert.ok(webpWidth <= sourceWidth && webpHeight <= sourceHeight, `${file} WebP is not enlarged`);
    assert.ok(Math.abs(webpWidth / webpHeight - sourceWidth / sourceHeight) < 0.01, `${file} aspect ratio is preserved`);
  }
  assert.equal(stageIllustration('other'), undefined);
});

test('stage banners label art in both languages and leave other stages neutral', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' });
  globalThis.location = { hash: '#/trainers' };
  try {
    const { default: TrainerExplorer } = await server.ssrLoadModule('/src/features/trainers/TrainerExplorer.tsx');
    for (const [stage, language, label, file] of [
      ['stage-01', 'es', 'Ilustración decorativa', 'cherrygrove-city.png'],
      ['stage-02', 'es', 'Ilustración decorativa', 'route-30.png'],
      ['stage-03', 'en', 'Decorative illustration', 'route-31.png'],
      ['stage-04', 'es', 'Ilustración decorativa', 'sprout-tower.png'],
      ['stage-05', 'en', 'Decorative illustration', 'ruins-of-alph.png'],
      ['stage-06', 'es', 'Ilustración decorativa', 'violet-city-gym.png'],
      ['stage-07', 'en', 'Decorative illustration', 'route-32.png'],
      ['stage-08', 'en', 'Decorative illustration', 'union-cave.png'],
      ['stage-09', 'es', 'Ilustración decorativa', 'route-33.png'],
      ['stage-10', 'es', 'Ilustración decorativa', 'slowpoke-well.png'],
      ['stage-11', 'en', 'Decorative illustration', 'azalea-town-gym.png'],
      ['stage-12', 'es', 'Ilustración decorativa', 'azalea-town.png'],
      ['stage-13', 'en', 'Decorative illustration', 'route-34.png'],
      ['stage-14', 'en', 'Decorative illustration', 'goldenrod-tunnel.png'],
      ['stage-15', 'es', 'Ilustración decorativa', 'goldenrod-city-gym.png'],
      ['stage-17', 'es', 'Ilustración decorativa', 'route-35.png'],
      ['stage-18', 'en', 'Decorative illustration', 'national-park.png'],
      ['stage-19', 'en', 'Decorative illustration', 'route-36.png'],
      ['stage-20', 'es', 'Ilustración decorativa', 'route-37.png'],
      ['stage-21', 'es', 'Ilustración decorativa', 'burned-tower.png'],
      ['stage-22', 'en', 'Decorative illustration', 'ecruteak-city.png'],
      ['stage-23', 'es', 'Ilustración decorativa', 'ecruteak-city-gym.png'],
      ['stage-24', 'en', 'Decorative illustration', 'route-38.png'],
      ['stage-25', 'es', 'Ilustración decorativa', 'route-39.png'],
      ['stage-26', 'en', 'Decorative illustration', 'olivine-city.png'],
      ['stage-27', 'es', 'Ilustración decorativa', 'olivine-lighthouse.png'],
      ['stage-28', 'en', 'Decorative illustration', 'route-40.png'],
      ['stage-29', 'es', 'Ilustración decorativa', 'route-41.png'],
      ['stage-30', 'es', 'Ilustración decorativa', 'cianwood-city.png'],
      ['stage-31', 'es', 'Ilustración decorativa', 'cianwood-city-gym.png'],
      ['stage-32', 'en', 'Decorative illustration', 'cliff-edge-gate.png'],
      ['stage-37', 'en', 'Decorative illustration', 'route-42.png'],
      ['stage-39', 'es', 'Ilustración decorativa', 'route-43.png'],
      ['stage-44', 'en', 'Decorative illustration', 'route-44.png'],
      ['stage-45', 'es', 'Ilustración decorativa', 'route-45.png'],
      ['stage-16', 'en', 'Decorative illustration', 'route-46.png'],
      ['stage-33', 'es', 'Ilustración decorativa', 'route-47.png'],
      ['stage-34', 'es', 'Ilustración decorativa', 'cliff-cave.png'],
      ['stage-35', 'en', 'Decorative illustration', 'safari-zone-gate.png'],
      ['stage-36', 'es', 'Ilustración decorativa', 'olivine-city-gym.png'],
      ['stage-38', 'en', 'Decorative illustration', 'mt-mortar.png'],
      ['stage-40', 'es', 'Ilustración decorativa', 'team-rocket-hq.png'],
      ['stage-41', 'es', 'Ilustración decorativa', 'mahogany-town-gym.png'],
      ['stage-42', 'es', 'Ilustración decorativa', 'radio-tower.png'],
      ['stage-43', 'en', 'Decorative illustration', 'goldenrod-city.png'],
      ['stage-46', 'es', 'Ilustración decorativa', 'blackthorn-city-gym.png'],
      ['stage-47', 'en', 'Decorative illustration', 'dragons-den.png'],
      ['stage-50', 'es', 'Ilustración decorativa', 'victory-road.png'],
      ['stage-51', 'en', 'Decorative illustration', 'pokemon-league.png'],
      ['stage-52', 'es', 'Ilustración decorativa', 'ss-aqua.png'],
      ['stage-53', 'en', 'Decorative illustration', 'ss-aqua.png'],
      ['stage-54', 'es', 'Ilustración decorativa', 'ss-aqua.png'],
      ['stage-58', 'es', 'Ilustración decorativa', 'pewter-city-gym.png'],
      ['stage-48', 'en', 'Decorative illustration', 'route-27.png'],
      ['stage-49', 'es', 'Ilustración decorativa', 'route-26.png'],
      ['stage-55', 'en', 'Decorative illustration', 'route-6.png'],
      ['stage-56', 'es', 'Ilustración decorativa', 'route-2.png'],
      ['stage-57', 'en', 'Decorative illustration', 'route-3.png'],
      ['stage-60', 'es', 'Ilustración decorativa', 'route-4.png'],
      ['stage-61', 'en', 'Decorative illustration', 'route-9.png'],
      ['stage-62', 'es', 'Ilustración decorativa', 'route-24.png'],
      ['stage-63', 'en', 'Decorative illustration', 'route-25.png'],
      ['stage-66', 'es', 'Ilustración decorativa', 'route-10.png'],
      ['stage-67', 'en', 'Decorative illustration', 'route-8.png'],
      ['stage-68', 'es', 'Ilustración decorativa', 'route-11.png'],
      ['stage-69', 'en', 'Decorative illustration', 'route-12.png'],
      ['stage-70', 'es', 'Ilustración decorativa', 'route-13.png'],
      ['stage-71', 'en', 'Decorative illustration', 'route-14.png'],
      ['stage-72', 'es', 'Ilustración decorativa', 'route-15.png'],
      ['stage-75', 'en', 'Decorative illustration', 'route-17.png'],
      ['stage-74', 'es', 'Ilustración decorativa', 'route-18.png'],
      ['stage-78', 'en', 'Decorative illustration', 'route-19.png'],
      ['stage-79', 'es', 'Ilustración decorativa', 'route-20.png'],
      ['stage-81', 'en', 'Decorative illustration', 'route-20.png'],
      ['stage-83', 'es', 'Ilustración decorativa', 'route-21.png'],
      ['stage-84', 'en', 'Decorative illustration', 'route-1.png'],
      ['stage-85', 'en', 'Decorative illustration', 'route-2.png'],
    ]) {
      globalThis.sessionStorage = { getItem: () => JSON.stringify({ stage }) };
      const html = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language, mode: 'normal' }));
      assert.ok(html.includes(label));
      assert.ok(html.includes(file));
      assert.ok(html.includes(file.replace(/\.png$/, '.webp')));
      assert.ok(html.includes(`<picture><source type="image/webp" srcSet="../assets/locations/${file.replace(/\.png$/, '.webp')}"/><img class="journey-illustration" src="../assets/locations/${file}" alt=""/></picture>`));
      assert.match(html, /journey-hero has-art/);
    }
    globalThis.sessionStorage = { getItem: () => JSON.stringify({ stage: 'other' }) };
    const html = renderToStaticMarkup(React.createElement(TrainerExplorer, { data, language: 'en', mode: 'normal' }));
    assert.doesNotMatch(html, /journey-hero has-art|Decorative illustration/);
  } finally {
    await server.close();
    delete globalThis.location;
    delete globalThis.sessionStorage;
  }
});
