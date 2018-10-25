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
const createJockeyList = function() {
    return new Promise((resolve, reject) => {
        const jockey_id_list = [];

        // レース情報ファイルを読み込む
        var walk = function(dir, done) {
            var results = [];
            fs.readdir(dir, function(err, list) {
                if (err) return done(err);
                    var i = 0;
                    (function next() {
                        var file = list[i++];
                        if (!file) return done(null, results);
                        file = dir + '/' + file;
                        fs.stat(file, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(file, function(err, res) {
                                results = results.concat(res);
                                next();
                            });
                        } else {
                            results.push(file);
                            next();
                        }
                    });
                })();
            });
        };

        walk(__dirname + '/data/2017年度/', function done(err, result) {
            result.forEach(function(path, index) {
                const json = JSON.parse(fs.readFileSync(path))
                json.forEach(function(elem) {
                    if(jockey_id_list.indexOf(elem['jockey']) == -1) {
                        jockey_id_list.push(elem['jockey'])
                    }
                });

                if(index == result.length - 1) {
                    // ファイルに保存
                    fs.writeFileSync(__dirname + '/temp/jockey_list.json' ,JSON.stringify(jockey_id_list, null, 4));

                    resolve(jockey_id_list);
                }
            });
        });
    });
}


/**
 * レースの詳細情報をスクレイピングして取得する
 */
const scrape = function (jockey_id_list) {
    return new Promise((resolve, reject) => {
        jockey_info_map = {};

        jockey_id_list.forEach(function(jockey_id, jockey_index) {
            // URLを作成
            const url = URL + 'kis_info/' + jockey_id + '.do';

            // サイトにアクセス
            const html = client.fetchSync(url);
            const $ = html.$;

            const table = $('table.tb01');
            table.each(function(table_index) {
                if(table_index == 0) {
                    const jockey_map = {};
                    const tr = $(this).find('tr');
                    const tr_len = tr.length;
                    let td_index = 0;

                    if(tr_len == 4) {
                        tr.each(function(tr_index) {
                            const td = $(this).find('td');
                            if(tr_index != 0) {
                                td.each(function () {
                                    // テキストを取得
                                    let text = $(this).text();
                                    
                                    switch(td_index) {
                                        case 6:
                                            jockey_map['total_win'] = text;
                                            break;
                                        case 7:
                                            jockey_map['total_ren'] = text;
                                            break;
                                        case 14:
                                            jockey_map['this_win'] = text;
                                            break;
                                        case 15:
                                            jockey_map['this_ren'] = text;
                                            break;
                                        case 22:
                                            jockey_map['last_win'] = text;
                                            break;
                                        case 23:
                                            jockey_map['last_ren'] = text;
                                            jockey_info_map[jockey_id] = jockey_map;
                                            break;
                                    }

                                    td_index++;
                                });
                            }
                        });
                    } else if(tr_len == 3) {
                        tr.each(function(tr_index) {
                            const td = $(this).find('td');
                            if(tr_index != 0) {

                                td.each(function () {
                                    // テキストを取得
                                    let text = $(this).text();
                                    
                                    switch(td_index) {
                                        case 6:
                                            jockey_map['this_win'] = text;
                                            break;
                                        case 7:
                                            jockey_map['this_ren'] = text;
                                            break;
                                        case 14:
                                            jockey_map['last_win'] = text;
                                            break;
                                        case 15:
                                            jockey_map['last_ren'] = text;
                                            jockey_info_map[jockey_id] = jockey_map;
                                            break;
                                    }

                                    td_index++;
                                });
                            }
                        });
                    } else if(tr_len == 2) {
                        tr.each(function(tr_index) {
                            const td = $(this).find('td');
                            if(tr_index != 0) {

                                td.each(function () {
                                    // テキストを取得
                                    let text = $(this).text();
                                    
                                    switch(td_index) {
                                        case 6:
                                            jockey_map['this_win'] = text;
                                            break;
                                        case 7:
                                            jockey_map['this_ren'] = text;
                                            jockey_info_map[jockey_id] = jockey_map;
                                            break;
                                    }

                                    td_index++;
                                });
                            }
                        });
                    }
                }
            });

            console.log(jockey_id + '(' + (jockey_index + 1) + '/' + jockey_id_list.length + ')');
        });

        // ファイルに保存
        fs.writeFileSync(__dirname + '/temp/jockey.json' ,JSON.stringify(jockey_info_map, null, 4));

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
            return createJockeyList();
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