const levelOptions: string[] = ["初級", "初中級", "中級", "中高級", "高級"];
const sortOptions: string[] = ["最近", "最早", "A - Z", "Z - A", "詞性"];
const speedOptions: string[] = ["慢", "中", "快"];
const photoOptions: string[] = ["移除目前的相片", "相機", "從相簿"];
const tagOptions: string[] = ["重新命名", "刪除"];
const playOptions: string[] = ["一次播放", "分段播放"];
const speechObj: any= {
    '動詞': 'v. 動詞',
    '名詞': 'n. 名詞',
    '代名詞': 'pron. 代名詞',
    '連接詞': 'conj. 連接詞',
    '形容詞': 'adj. 形容詞',
    '感嘆詞': 'int. 感嘆詞',
    '副詞': 'adv. 副詞',
    '介系詞': 'prep. 介系詞'
}
const propertyObj: any= {
    'phrases': '片語',
    'synonyms': '同義詞',
}

export {
    levelOptions,
    sortOptions,
    speedOptions,
    photoOptions,
    tagOptions,
    playOptions,
    speechObj,
    propertyObj
}