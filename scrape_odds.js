/**********************************
* モジュール
**********************************/
const client = require('cheerio-httpcli');
const fs = require('fs');

/**********************************
* グローバル変数・定数
**********************************/
const URL = 'https://www.nankankeiba.com/';

const target_year = ['2017'];

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

        resolve(race_id_list);
        // resolve(["2018101220120503"])
    });
}


/**
 * レースの詳細情報をスクレイピングして取得する
 */
const scrape = function (race_id_list) {
    return new Promise((resolve, reject) => {
        // 単勝オッズを取得
        function scrapeWinOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 7) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 単勝オッズ
                                case 3:
                                    odds_map['odds'] = Number(text.replace(/[^0-9.]/g, ''));
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = Number(text.replace(/[^0-9]/g, ''));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // 複勝オッズを取得
        function scrapePlaceOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 7) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 複勝オッズ
                                case 3:
                                    let place = text.replace(/[^0-9.-]/g, '').split('-');
                                    place = (Number(place[0]) + Number(place[1])) / 2;
                                    place = Math.round(place * 10) / 10;
                                    odds_map['odds'] = place;
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = Number(text.replace(/[^0-9]/g, ''));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // 馬単オッズを取得
        function scrapeExactaOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 10) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 馬単オッズ
                                case 3:
                                    odds_map['odds'] = Number(text.replace(/[^0-9.]/g, ''));
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = [];
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 8:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }
        
        // 馬連オッズを取得
        function scrapeQuinellaOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 10) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 馬連オッズ
                                case 3:
                                    odds_map['odds'] = Number(text.replace(/[^0-9.]/g, ''));
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = [];
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 8:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // ワイドオッズを取得
        function scrapeQuinellaPlaceOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 10) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // ワイドオッズ
                                case 3:
                                    let place = text.replace(/[^0-9.-]/g, '').split('-');
                                    place = (Number(place[0]) + Number(place[1])) / 2;
                                    place = Math.round(place * 10) / 10;
                                    odds_map['odds'] = place;
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = [];
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 8:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // 3連単オッズを取得
        function scrapeTierceOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 13) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 3連単オッズ
                                case 3:
                                    odds_map['odds'] = Number(text.replace(/[^0-9.]/g, ''));
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = [];
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 8:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 11:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // 3連複オッズを取得
        function scrapeTrioOdds(url) {
            const odds_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01.w100pr');
            table.each(function(table_index) {
                // trタグにアクセス
                const tr = $(this).find('tr');
                tr.each(function(tr_index) {
                    // tdタグにアクセス
                    const td = $(this).find('td');
                    const td_len = td.length;

                    if(td_len == 13) {
                        const odds_map = {};
                        td.each(function (td_index) {
                            // テキストを取得
                            let text = $(this).text();
                            switch(td_index % td_len) {
                                // 3連複オッズ
                                case 3:
                                    odds_map['odds'] = Number(text.replace(/[^0-9.]/g, ''));
                                    break;
                                // 馬番
                                case 5:
                                    odds_map['number'] = [];
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 8:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));
                                    break;
                                case 11:
                                    odds_map['number'].push(Number(text.replace(/[^0-9]/g, '')));

                                    // リストに追加
                                    odds_list.push(odds_map);
                                    break;
                            }
                        });
                    }
                });
            });

            return odds_list
        }

        // レースの結果情報を取得
        function scrapeRaceResult(url) {
            const result_list = [];

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            // tableタグにアクセス
            const table = $('table.tb01');
            table.each(function(table_index) {
                if(table_index == 0) {
                    // trタグにアクセス
                    const tr = $(this).find('tr');
                    tr.each(function(tr_index) {
                        // tdタグにアクセス
                        const td = $(this).find('td');
                        if(tr_index != 0) {
                            const result_map = {};

                            td.each(function (td_index) {
                                // テキストを取得
                                let text = $(this).text();

                                switch(td_index) {
                                    // 着順
                                    case 0:
                                        result_map['rank'] = Number(text);
                                        break;
                                    // 馬番
                                    case 2:
                                        result_map['number'] = Number(text);

                                        // リストに追加
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

        race_id_list.forEach(function(race_id, race_index) {
            // 単勝オッズを取得
            const win_url = URL + 'odds_nin_search/' + race_id
                          + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=01';
            const win_list = scrapeWinOdds(win_url);

            // 複勝オッズを取得
            const place_url = URL + 'odds_nin_search/' + race_id
                            + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=02';
            const place_list = scrapePlaceOdds(place_url);

            // 馬単オッズを取得
            const exacta_url = URL + 'odds_nin_search/' + race_id
                             + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=03';
            const exacta_list = scrapeExactaOdds(exacta_url);

            // 馬連オッズを取得
            const quinella_url = URL + 'odds_nin_search/' + race_id
                               + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=04';
            const quinella_list = scrapeQuinellaOdds(quinella_url);

            // ワイドオッズを取得
            const quinellaPlace_url = URL + 'odds_nin_search/' + race_id
                                    + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=07';
            const quinellaPlace_list = scrapeQuinellaPlaceOdds(quinellaPlace_url);

            // 3連単オッズを取得
            const tierce_url = URL + 'odds_nin_search/' + race_id
                             + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=08';
            const tierce_list = scrapeTierceOdds(tierce_url);

            // 3連複オッズを取得
            const trio_url = URL + 'odds_nin_search/' + race_id
                           + '.do?METHOD=searchHigh&programID=' + race_id + '&SHIKIBETSU=09';
            const trio_list = scrapeTrioOdds(trio_url);

            // 着順を取得
            const result_url = URL + 'result/' + race_id + '.do';
            const result_list = scrapeRaceResult(result_url)

            if(result_list.length > 0) {
                output_map = {
                    "win"          : win_list,
                    "place"        : place_list,
                    "exacta"       : exacta_list,
                    "quinella"     : quinella_list,
                    "quinellaPlace": quinellaPlace_list,
                    "tierce"       : tierce_list,
                    "trio"         : trio_list,
                    "result"       : result_list
                }
                // ファイルに保存
                const dir_name = __dirname + '/data/' + target_year[0] + '年度/' + race_id.slice(0, -2) + '/';
                const file_name = race_id + '.json';
                fs.writeFileSync(dir_name + file_name, JSON.stringify(output_map, null, 4));
            }

            console.log(race_id + '(' + (race_index + 1) + '/' + race_id_list.length + ')');
        });

        // // 各レースに対して処理を実行
        // race_id_list.forEach(function(race_id, race_index) {
        //     // URLを作成
        //     const info_url = URL + 'uma_shosai/' + race_id + '.do';
        //     const result_url = URL + 'result/' + race_id + '.do';
            
        //     // レースの詳細情報を取得
        //     const info_list = scrapeRaceInfo(info_url)

        //     // レースの結果情報を取得
        //     const result_list = scrapeRaceResult(result_url)

        //     if(result_list.length > 0) {

        //         // 詳細情報に結果情報を入れ込む
        //         result_list.sort(function(a,b) {
        //             if(Number(a.horse_number) < Number(b.horse_number)) return -1;
        //             if(Number(a.horse_number) > Number(b.horse_number)) return 1;
        //             return 0;
        //         });

        //         info_list.forEach(function(elem, index) {
        //             info_list[index]['three_furlong'] = result_list[index].three_furlong;
        //             info_list[index]['popularity'] = result_list[index].popularity;
        //             info_list[index]['rank'] = result_list[index].rank;
        //         });

        //         // ファイルに保存
        //         const dir_name = __dirname + '/data/' + target_year[0] + '年度/' + race_id.slice(0, -2) + '/';
        //         const file_name = race_id + '.json';
        //         fs.writeFileSync(dir_name + file_name, JSON.stringify(info_list, null, 4));
        //     }

        //     console.log(race_id + '(' + (race_index + 1) + '/' + race_id_list.length + ')');
        // });

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