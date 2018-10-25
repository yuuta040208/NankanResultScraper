# 南関競馬結果情報スクレイピングスクリプト
[南関競馬](https://www.nankankeiba.com/)の結果情報をスクレイピングしてくるスクリプト群です。

## Version
```
$ node -v
v8.11.0
$ npm -v
5.8.0
```

## Prepare
``` 
$ git clone https://github.com/yuuta040208/NankanResultScraper.git
$ cd NankanResultScraper
$ npm install
```

## ＊scrape.js
指定した年の結果情報をスクレイピングするスクリプト  
基本は年単位だが、以下の箇所を修正することでレース単位でのスクレイピングが可能
```

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

        // ここでスクレイピングしたいレースIDの配列を与える
        // resolve(race_id_list);
        resolve(["2018091221070301",
                "2018091221070302",
                "2018091221070303])
    });
}
```

## ＊scraoe_odds.js
指定した年のオッズ結果情報をスクレイピングするスクリプト  
scrape.jsと同様の箇所を修正することでレース単位でのスクレイピングが可能

## ＊scrape_today.js
本日開催しているレースの結果情報をスクレイピングするスクリプト  
それだけだが意外と便利

## ＊scrape_jockey.js
騎手情報をスクレイピングするスクリプト  
scrape.jsを実行した後に実行すべし