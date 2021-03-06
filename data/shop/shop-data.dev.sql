INSERT INTO shop_category(id, name) VALUES ('J760KK', 'Plugin');
INSERT INTO shop_category(id, name) VALUES ('4MCZ11', 'Sample Pack');
INSERT INTO shop_category(id, name) VALUES ('103VOI', 'EP');

INSERT INTO shop_product_status(id, status) VALUES ('AXQBK7', 'AVAILABLE');
INSERT INTO shop_product_status(id, status) VALUES ('5Z06AN', 'UNAVAILABLE');
INSERT INTO shop_product_status(id, status) VALUES ('85P8TU', 'DISCONTINUED');
INSERT INTO shop_product_status(id, status) VALUES ('2U5UC0', 'REMOVED');

INSERT INTO shop_product(id, category_id, status_id, name, filename, amount, preview, description, image_url)
VALUES ('A4N30E',
        'J760KK',
        'AXQBK7',
        'Rotor',
        'rotor.zip',
        0.00,
        'Variable-waveform ring modulator',
        '[Rotor](https://youtu.be/IEbVJtUjxaM) is a variable waveform ring modulation plugin for OS X and Windows platforms available in the VST3 and AU formats. To see more, checkout the GitHub [repository](https://github.com/maxwellmattryan/rotor/)!',
        'images/shop/products/rotor.png');

INSERT INTO shop_product(id, category_id, status_id, name, filename, amount, preview, description, image_url)
VALUES ('BZFVBL',
        'J760KK',
        '5Z06AN',
        'Phantom',
        'phantom.zip',
        15.00,
        'Phase distortion-based synthesizer',
        'Phantom is a phase distortion-based synthesizer plugin targeting VST3 and AU formats for OS X and Windows platforms. This lesser-known method of synthesis is capable of some truly bizarre stuff, which is really what makes it fun to use. Check out a [sample](https://soundcloud.com/apellum/sample-phantom-phase-distortion-synthesizer) on SoundCloud!',
        'images/shop/products/phantom.png');

INSERT INTO shop_product(id, category_id, status_id, name, filename, amount, preview, description, image_url)
VALUES ('R5TD9P',
        'J760KK',
        '5Z06AN',
        'Garm',
        'garm.zip',
        9.00,
        'Wicked bass synth',
        'Garm is a small yet beefy monophonic bass synth that will cover all ground for gettin'' nasty on the low end (real nasty).',
        'images/shop/products/garm.png');

INSERT INTO shop_product(id, category_id, status_id, name, filename, amount, preview, description, image_url)
VALUES ('VDUI6X',
        '4MCZ11',
        '5Z06AN',
        'Recur',
        'recur.zip',
        3.00,
        'Granular delay-based samples',
        'This is my first ever sample pack featuring mostly my DIY Teensyduino synthesizer that I made. The samples are coming soon!',
        'images/shop/products/recur.png');