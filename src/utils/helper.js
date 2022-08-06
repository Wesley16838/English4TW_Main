import authDeviceStorage from "services/authDeviceStorage";

let nodejs = {};
nodejs.en_pos = require("en-pos");
nodejs.compendium = require('compendium-js');
nodejs.wink_pos_tagger = require( 'wink-pos-tagger' );

export const getToken = async () => {
    const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
    const token = userInfo && JSON.parse(userInfo).token
    return token
}

export const dep_parse = (line) => {
    line = line.trim();
	let com_tags = nodejs.compendium.analyse(line)[0].tags;
	
	let tagger = nodejs.wink_pos_tagger();
	let wink_tags = [];
	tagger.tagSentence(line).forEach(function (item) { wink_tags.push(item.pos); });
	
	let tokens = line
            .replace(/n't/gui, ' not')
            .replace(/([,'.])/gui, ' $1')
            .split(' ').filter(w => w.length);
	let en_pos = new nodejs.en_pos.Tag(tokens);
	let en_pos_tags = en_pos.initial().smooth().tags;
	
	
	let raws = tokens;//results.tokens;
	let tags = wink_tags;//en_pos_tags;//results.tags;

	console.log(com_tags);
	console.log(wink_tags);
	console.log(tokens);
	console.log(en_pos_tags);
	return {
		tokens: tokens,
		com_tags: com_tags,
		wink_tags: wink_tags,
		en_pos_tags: en_pos_tags
	};
}