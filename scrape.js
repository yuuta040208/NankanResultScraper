/**********************************
* モジュール
**********************************/
const client = require('cheerio-httpcli');
const fs = require('fs');

/**********************************
* グローバル変数・定数
**********************************/
const URL = 'https://www.nankankeiba.com/';

const target_year = ['2018'];

/**********************************
* メイン処理
**********************************/

/**
 * レースのリストをスクレイピングして作成する
 */
const createRaceList = function() {
    return new Promise((resolve, reject) => {
        const race_id_list = [];

        target_year.forEach(year => {
            // 各年のフォルダ作成
            if(fs.readdirSync(__dirname + '/data/').indexOf(year + '年度') == -1) {
                fs.mkdirSync(__dirname + '/data/' + year + '年度');
            }
            ['04', '10'].forEach(period => {
                // URLを作成
                const url = URL + 'calendar/' + year + period + '.do';
                
                // サイトにアクセス
                const html = client.fetchSync(url);
                const $ = html.$;

                // レースのURLを取得
                $('em a').each(function() {
                    const program_url = $(this).attr('href');
                    const result_url = program_url.replace(/[^0-9]/g, '');

                    // 1日のレース回数分ループ
                    // TODO レース回数は固定じゃないみたい
                    for(let i = 1; i <= 12; i++) {
                        let race_num = ('0' + i).slice(-2);
                        race_id_list.push(result_url + race_num);
                    }

                    // 各開催日のフォルダ作成
                    if(fs.readdirSync(__dirname + '/data/' + year + '年度/').indexOf(result_url) == -1) {
                        fs.mkdirSync(__dirname + '/data/' + year + '年度/' + result_url);
                    }
                });
            });
        });

        // ファイルに保存
        fs.writeFileSync(__dirname + '/temp/racelist.json', JSON.stringify(race_id_list, null, 4));

        // resolve(race_id_list);
        resolve(["2018091221070301",
                "2018091221070302",
                "2018091221070303",
                "2018091221070304",
                "2018091221070305",
                "2018091221070306",
                "2018091221070307",
                "2018091221070308",
                "2018091221070309",
                "2018091221070310",
                "2018091221070311",
                "2018091221070312",
                "2018091321070401",
                "2018091321070402",
                "2018091321070403",
                "2018091321070404",
                "2018091321070405",
                "2018091321070406",
                "2018091321070407",
                "2018091321070408",
                "2018091321070409",
                "2018091321070410",
                "2018091321070411",
                "2018091321070412",
                "2018091421070501",
                "2018091421070502",
                "2018091421070503",
                "2018091421070504",
                "2018091421070505",
                "2018091421070506",
                "2018091421070507",
                "2018091421070508",
                "2018091421070509",
                "2018091421070510",
                "2018091421070511",
                "2018091421070512",
                "2018091820110101",
                "2018091820110102",
                "2018091820110103",
                "2018091820110104",
                "2018091820110105",
                "2018091820110106",
                "2018091820110107",
                "2018091820110108",
                "2018091820110109",
                "2018091820110110",
                "2018091820110111",
                "2018091820110112",
                "2018091920110201",
                "2018091920110202",
                "2018091920110203",
                "2018091920110204",
                "2018091920110205",
                "2018091920110206",
                "2018091920110207",
                "2018091920110208",
                "2018091920110209",
                "2018091920110210",
                "2018091920110211",
                "2018091920110212",
                "2018092020110301",
                "2018092020110302",
                "2018092020110303",
                "2018092020110304",
                "2018092020110305",
                "2018092020110306",
                "2018092020110307",
                "2018092020110308",
                "2018092020110309",
                "2018092020110310",
                "2018092020110311",
                "2018092020110312",
                "2018092120110401",
                "2018092120110402",
                "2018092120110403",
                "2018092120110404",
                "2018092120110405",
                "2018092120110406",
                "2018092120110407",
                "2018092120110408",
                "2018092120110409",
                "2018092120110410",
                "2018092120110411",
                "2018092120110412",
                "2018092418070101",
                "2018092418070102",
                "2018092418070103",
                "2018092418070104",
                "2018092418070105",
                "2018092418070106",
                "2018092418070107",
                "2018092418070108",
                "2018092418070109",
                "2018092418070110",
                "2018092418070111",
                "2018092418070112",
                "2018092518070201",
                "2018092518070202",
                "2018092518070203",
                "2018092518070204",
                "2018092518070205",
                "2018092518070206",
                "2018092518070207",
                "2018092518070208",
                "2018092518070209",
                "2018092518070210",
                "2018092518070211",
                "2018092518070212",
                "2018092618070301",
                "2018092618070302",
                "2018092618070303",
                "2018092618070304",
                "2018092618070305",
                "2018092618070306",
                "2018092618070307",
                "2018092618070308",
                "2018092618070309",
                "2018092618070310",
                "2018092618070311",
                "2018092618070312",
                "2018092620110501",
                "2018092620110502",
                "2018092620110503",
                "2018092620110504",
                "2018092620110505",
                "2018092620110506",
                "2018092620110507",
                "2018092620110508",
                "2018092620110509",
                "2018092620110510",
                "2018092620110511",
                "2018092620110512",
                "2018092718070401",
                "2018092718070402",
                "2018092718070403",
                "2018092718070404",
                "2018092718070405",
                "2018092718070406",
                "2018092718070407",
                "2018092718070408",
                "2018092718070409",
                "2018092718070410",
                "2018092718070411",
                "2018092718070412",
                "2018092720110601",
                "2018092720110602",
                "2018092720110603",
                "2018092720110604",
                "2018092720110605",
                "2018092720110606",
                "2018092720110607",
                "2018092720110608",
                "2018092720110609",
                "2018092720110610",
                "2018092720110611",
                "2018092720110612",
                "2018092818070501",
                "2018092818070502",
                "2018092818070503",
                "2018092818070504",
                "2018092818070505",
                "2018092818070506",
                "2018092818070507",
                "2018092818070508",
                "2018092818070509",
                "2018092818070510",
                "2018092818070511",
                "2018092818070512",
                "2018100119070101",
                "2018100119070102",
                "2018100119070103",
                "2018100119070104",
                "2018100119070105",
                "2018100119070106",
                "2018100119070107",
                "2018100119070108",
                "2018100119070109",
                "2018100119070110",
                "2018100119070111",
                "2018100119070112",
                "2018100219070201",
                "2018100219070202",
                "2018100219070203",
                "2018100219070204",
                "2018100219070205",
                "2018100219070206",
                "2018100219070207",
                "2018100219070208",
                "2018100219070209",
                "2018100219070210",
                "2018100219070211",
                "2018100219070212",
                "2018100319070301",
                "2018100319070302",
                "2018100319070303",
                "2018100319070304",
                "2018100319070305",
                "2018100319070306",
                "2018100319070307",
                "2018100319070308",
                "2018100319070309",
                "2018100319070310",
                "2018100319070311",
                "2018100319070312",
                "2018100419070401",
                "2018100419070402",
                "2018100419070403",
                "2018100419070404",
                "2018100419070405",
                "2018100419070406",
                "2018100419070407",
                "2018100419070408",
                "2018100419070409",
                "2018100419070410",
                "2018100419070411",
                "2018100419070412",
                "2018100519070501",
                "2018100519070502",
                "2018100519070503",
                "2018100519070504",
                "2018100519070505",
                "2018100519070506",
                "2018100519070507",
                "2018100519070508",
                "2018100519070509",
                "2018100519070510",
                "2018100519070511",
                "2018100519070512",
                "2018100820120101",
                "2018100820120102",
                "2018100820120103",
                "2018100820120104",
                "2018100820120105",
                "2018100820120106",
                "2018100820120107",
                "2018100820120108",
                "2018100820120109",
                "2018100820120110",
                "2018100820120111",
                "2018100820120112"])
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


        // レースの結果情報をスクレイピング
        function scrapeRaceResult(url) {
            const result_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            const table = $('table.tb01');
            table.each(function(table_index) {
                if(table_index == 0) {
                    const tr = $(this).find('tr');

                    tr.each(function(tr_index) {
                        const td = $(this).find('td');
                        if(tr_index != 0) {
                            const result_map = {};

                            td.each(function (td_index) {
                                // テキストを取得
                                let text = $(this).text();
                                
                                switch(td_index) {
                                    case 0:
                                        result_map['rank'] = text;
                                        break;
                                    case 2:
                                        result_map['horse_number'] = text;
                                        break;
                                    case 12:
                                        result_map['three_furlong'] = text;
                                        break;
                                    case 14:
                                        result_map['popularity'] = text;
                                        result_list.push(result_map);
                                        break;
                                }
                            });
                        }
                    });
                }
            });

            return result_list;
        }

        // 各レースに対して処理を実行
        race_id_list.forEach(function(race_id, race_index) {
            // URLを作成
            const info_url = URL + 'uma_shosai/' + race_id + '.do';
            const result_url = URL + 'result/' + race_id + '.do';
            
            // レースの詳細情報を取得
            const info_list = scrapeRaceInfo(info_url)

            // レースの結果情報を取得
            const result_list = scrapeRaceResult(result_url)

            if(result_list.length > 0) {

                // 詳細情報に結果情報を入れ込む
                result_list.sort(function(a,b) {
                    if(Number(a.horse_number) < Number(b.horse_number)) return -1;
                    if(Number(a.horse_number) > Number(b.horse_number)) return 1;
                    return 0;
                });

                info_list.forEach(function(elem, index) {
                    info_list[index]['three_furlong'] = result_list[index].three_furlong;
                    info_list[index]['popularity'] = result_list[index].popularity;
                    info_list[index]['rank'] = result_list[index].rank;
                });

                // ファイルに保存
                const dir_name = __dirname + '/data/' + target_year[0] + '年度/' + race_id.slice(0, -2) + '/';
                const file_name = race_id + '.json';
                fs.writeFileSync(dir_name + file_name, JSON.stringify(info_list, null, 4));
            }

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