/**********************************
* モジュール
**********************************/
const client = require('cheerio-httpcli');
const fs = require('fs');

/**********************************
* グローバル変数・定数
**********************************/
const URL = 'https://www.nankankeiba.com/';

/**********************************
* メイン処理
**********************************/

/**
 * レースのリストをスクレイピングして作成する
 */
const createRaceList = function() {
    return new Promise((resolve, reject) => {
        const race_id_list = [];
        
        // 今年度のディレクトリを作成
        if(fs.readdirSync(__dirname + '/data/').indexOf('2018年度') == -1) {
            fs.mkdirSync(__dirname + '/data/2018年度');
        }

        // URLを作成
        const program_url = URL + 'program/00000000000000.do';

        // サイトにアクセス
        const html = client.fetchSync(program_url);
        const $ = html.$;

        // レースのURLを取得
        $('table.tb01c a').each(function() {
            const url = $(this).attr('href');

            if(url.indexOf('syousai') != -1) {
                race_id_list.push(url.replace(/\D/g, ''));
            }
        });

        // 各開催日のフォルダ作成
        const race_id_today = race_id_list[0].slice(0, -2);
        if(fs.readdirSync(__dirname + '/data/2018年度/').indexOf(race_id_today) == -1) {
            fs.mkdirSync(__dirname + '/data/2018年度/' + race_id_today);
        }

        // ファイルに保存
        fs.writeFileSync(__dirname + '/temp/racelist_today.json', JSON.stringify(race_id_list, null, 4));

        resolve(race_id_list);
    });
}


/**
 * レースの詳細情報をスクレイピングして取得する
 */
const scrape = function (race_id_list) {
    return new Promise((resolve, reject) => {
        // レースの詳細情報をスクレイピング
        function scrapeRaceInfo(url) {
            const info_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            let cource = '';
            let distance = '';
            let circumference = '';
            let div_a = $('div#race-data01-a');
            div_a.each(function() {
                let text = $(this).text();
                text = text.replace(/(\r|\t)/g, '').split('\n').filter(Boolean);
                
                // コース種別
                cource = text[3][0];

                // 距離
                distance = text[3].slice(1, text[3].indexOf('m')).replace(/\D/g, '');

                // 周り方
                circumference = text[3].substr(text[3].indexOf('（') + 1, 1);
            });

            let prize = '';
            let div_b = $('div#race-data01-b');
            div_b.each(function() {
                let text = $(this).text();
                text = text.replace(/(\r|\t)/g, '').split('\n').filter(Boolean);
                
                // 1着賞金
                prize = text[2].split('　')[1].slice(2).replace(/\D/g, '');
            });

            // 出馬表データを取得
            const tr = $('table.tb-shousai tr');
            tr.each(function() {
                const td = $(this).find('td');
                const td_len = td.length;

                const info_map = {};
                td.each(function(index) {
                    // テキストを取得
                    let text = $(this).text();

                    if(td_len == 15) {
                        // 枠番あり行の場合
                        switch(index % 15) {
                            case 0: // 枠番
                                info_map['bracket_number'] = text;
                                break;

                            case 1: // 馬番
                                info_map['horse_number'] = text;
                                break;

                            case 2: // 馬名、父馬名、母馬名、馬齢、性別
                                text = text.replace(/(\r|\t)/g, '').split('\n');

                                // info_map['father'] = text[0];
                                info_map['horse_name'] = text[2];
                                info_map['sex'] = text[7][0];
                                info_map['age'] = text[7][1];
                                // info_map['mother'] = text[9];
                                break;

                            case 3: // 騎手、斤量、調教師
                                text = text.replace(/(\r|\t)/g, '').split('\n').filter(Boolean);
                                info_map['burden'] = text[2];
                                
                                $(this).find('a').each(function(a_index) {
                                    switch(a_index) {
                                        case 0:
                                            info_map['jockey'] = $(this).attr('href').replace(/\D/g, '');
                                            break;
                                        case 1:
                                            info_map['trainer'] = $(this).attr('href').replace(/\D/g, '');
                                            break;
                                    }
                                });
                                break;

                            case 5: // 馬体重、増減
                                text = text.replace(/(\r|\t)/g, '').split('\n');

                                info_map['weight'] = text[1];
                                info_map['margin'] = text[2];
                                break;
                                
                            case 8: // 開催場所＆距離別成績
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text[5].indexOf('--') == -1) {
                                    const array = splitByLength(text[5], 2);
                                    
                                    const denominator = Number(array[0]) + Number(array[1]) + Number(array[2]) + Number(array[3]);
                                    const win_rate = Number(array[0]) / denominator;
                                    const ren_rate = (Number(array[0]) + Number(array[1])) / denominator;
                                    const fuku_rate = (Number(array[0]) + Number(array[1]) + Number(array[2])) / denominator;

                                    info_map['limit_win_rate'] = String(win_rate);
                                    info_map['limit_ren_rate'] = String(ren_rate);
                                    info_map['limit_fuku_rate'] = String(fuku_rate);
                                } else {
                                    info_map['limit_win_rate'] = String(0);
                                    info_map['limit_ren_rate'] = String(0);
                                    info_map['limit_fuku_rate'] = String(0);
                                }
                                break;

                            case 9: // 成績
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text[4].indexOf('--') == -1) {
                                    const array = splitByLength(text[4], 2);
                                    
                                    const denominator = Number(array[0]) + Number(array[1]) + Number(array[2]) + Number(array[3]);
                                    const win_rate = Number(array[0]) / denominator;
                                    const ren_rate = (Number(array[0]) + Number(array[1])) / denominator;
                                    const fuku_rate = (Number(array[0]) + Number(array[1]) + Number(array[2])) / denominator;

                                    info_map['total_win_rate'] = String(win_rate);
                                    info_map['total_ren_rate'] = String(ren_rate);
                                    info_map['total_fuku_rate'] = String(fuku_rate);
                                } else {
                                    info_map['total_win_rate'] = String(0);
                                    info_map['total_ren_rate'] = String(0);
                                    info_map['total_fuku_rate'] = String(0);
                                }
                                break;

                            case 10: // 前走
                            case 11: // 前々走
                            case 12: // 3走前
                            case 13: // 4走前
                            case 14: // 5走前
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text.length == 14) {
                                    info_map[`prev${index - 9}_rank`] = text[0];
                                    info_map[`prev${index - 9}_popularity`] = text[5].split(/\D/g)[1];
                                    info_map[`prev${index - 9}_three_furlong`] = text[13];

                                    let time = text[11].replace('(', '').replace(')', '');
                                    if(text[0] == '1') {
                                        time = Number(time * -1);
                                    }

                                    info_map[`prev${index - 9}_time`] = String(time);
                                }
                                break;
                        }
                    } else if(td_len == 14) {
                        // 枠番なし行の場合
                        switch(index % 14) {
                            case 0: // 馬番、枠番
                                info_map['bracket_number'] = (info_list[info_list.length - 1]['bracket_number']);
                                info_map['horse_number'] = text;
                                break;

                            case 1: // 馬名、父馬名、母馬名、馬齢、性別
                                text = text.replace(/(\r|\t)/g, '').split('\n');

                                // info_map['father'] = text[0];
                                info_map['horse_name'] = text[2];
                                info_map['sex'] = text[7][0];
                                info_map['age'] = text[7][1];
                                // info_map['mother'] = text[9];
                                break;

                            case 2: // 騎手、斤量、調教師
                                text = text.replace(/(\r|\t)/g, '').split('\n').filter(Boolean);
                                info_map['burden'] = text[2];
                                
                                $(this).find('a').each(function(a_index) {
                                    switch(a_index) {
                                        case 0:
                                            info_map['jockey'] = $(this).attr('href').replace(/\D/g, '');
                                            break;
                                        case 1:
                                            info_map['trainer'] = $(this).attr('href').replace(/\D/g, '');
                                            break;
                                    }
                                });
                                break;

                            case 4: // 馬体重、増減
                                text = text.replace(/(\r|\t)/g, '').split('\n');

                                info_map['weight'] = text[1];
                                info_map['margin'] = text[2];
                                break;

                            case 7: // 開催場所＆距離別成績
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text[5].indexOf('--') == -1) {
                                    const array = splitByLength(text[5], 2);
                                    
                                    const denominator = Number(array[0]) + Number(array[1]) + Number(array[2]) + Number(array[3]);
                                    const win_rate = Number(array[0]) / denominator;
                                    const ren_rate = (Number(array[0]) + Number(array[1])) / denominator;
                                    const fuku_rate = (Number(array[0]) + Number(array[1]) + Number(array[2])) / denominator;

                                    info_map['limit_win_rate'] = String(win_rate);
                                    info_map['limit_ren_rate'] = String(ren_rate);
                                    info_map['limit_fuku_rate'] = String(fuku_rate);
                                } else {
                                    info_map['limit_win_rate'] = String(0);
                                    info_map['limit_ren_rate'] = String(0);
                                    info_map['limit_fuku_rate'] = String(0);
                                }
                                break;

                            case 8: // 成績
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text[4].indexOf('--') == -1) {
                                    const array = splitByLength(text[4], 2);
                                    
                                    const denominator = Number(array[0]) + Number(array[1]) + Number(array[2]) + Number(array[3]);
                                    const win_rate = Number(array[0]) / denominator;
                                    const ren_rate = (Number(array[0]) + Number(array[1])) / denominator;
                                    const fuku_rate = (Number(array[0]) + Number(array[1]) + Number(array[2])) / denominator;

                                    info_map['total_win_rate'] = String(win_rate);
                                    info_map['total_ren_rate'] = String(ren_rate);
                                    info_map['total_fuku_rate'] = String(fuku_rate);
                                } else {
                                    info_map['total_win_rate'] = String(0);
                                    info_map['total_ren_rate'] = String(0);
                                    info_map['total_fuku_rate'] = String(0);
                                }
                                break;

                            case 9: // 前走
                            case 10: // 前々走
                            case 11: // 3走前
                            case 12: // 4走前
                            case 13: // 5走前
                                text = text.replace(/(\r|\t|▲|☆)/g, '').split('\n').filter(Boolean);
                                if(text.length == 14) {
                                    info_map[`prev${index - 9}_rank`] = text[0];
                                    info_map[`prev${index - 9}_popularity`] = text[5].split(/\D/g)[1];
                                    info_map[`prev${index - 9}_three_furlong`] = text[13];

                                    let time = text[11].replace('(', '').replace(')', '');
                                    if(text[0] == '1') {
                                        time = Number(time * -1);
                                    }

                                    info_map[`prev${index - 9}_time`] = String(time);
                                }
                                break;
                        }
                    } else {
                    }
                });

                if(td_len != 0) {
                    info_map['cource'] = cource;
                    info_map['distance'] = distance;
                    info_map['circumference'] = circumference;
                    info_map['prize'] = prize;

                    info_list.push(info_map)
                }
            });

            return info_list
        }

        function splitByLength(str, length) {
            var resultArr = [];
            if (!str || !length || length < 1) {
                return resultArr;
            }
            var index = 0;
            var start = index;
            var end = start + length;
            while (start < str.length) {
                resultArr[index] = str.substring(start, end);
                index++;
                start = end;
                end = start + length;
            }
            return resultArr;
        }

        // 各レースに対して処理を実行
        race_id_list.forEach(function(race_id, race_index) {
            // URLを作成
            const info_url = URL + 'uma_shosai/' + race_id + '.do';
            
            // レースの詳細情報を取得
            const info_list = scrapeRaceInfo(info_url)

            // ファイルに保存
            const dir_name = __dirname + '/data/2018年度/' + race_id.slice(0, -2) + '/';
            const file_name = race_id + '.json';
            fs.writeFileSync(dir_name + file_name, JSON.stringify(info_list, null, 4));

            console.log(race_id + '(' + (race_index + 1) + '/' + race_id_list.length + ')');
        });

        resolve();
    });
}


/**
 * メイン処理の実行順を定義する
 */
const main = function () {
    return new Promise((resolve, reject) => {
    Promise.resolve()
        .then(function () {
            return createRaceList();
        })
        .then(result => {
            return scrape(result)
        })
        .then(result => {
            resolve();
        })
        .catch(err => {
            reject(err);
        });

    });
};

main();