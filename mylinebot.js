'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const axios = require('axios');

const HOST = 'api.line.me'; 
const REPLY_PATH = '/v2/bot/message/reply';//リプライ用
const CH_SECRET = '1570169068'; //Channel Secretを指定
const CH_ACCESS_TOKEN = 'Pcu+9mrznL8P6hNzXxxWZS4hIV6ejykozTZ9WDJU5fHlpACLwnpT5ZHSTxK/Db8jJYSJZ91hTpx7e2BdDybuGKIWEszGZ1gUw6twNwVhKaaAqmDU+nH9BVeUmR3KgfvEaIgweMhxqDG0G35YNRt9zQdB04t89/1O/w1cDnyilFU='; //Channel Access Tokenを指定
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = 3000;

/**
 * httpリクエスト部分
 */
const client = (replyToken, SendMessageObject) => {    
    let postDataStr = JSON.stringify({ replyToken: replyToken, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: REPLY_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve(body);
                    });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};

http.createServer((req, res) => {    
    if(req.url !== '/' || req.method !== 'POST'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('');
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });        
    req.on('end', () => {
        if(body === ''){
          console.log('bodyが空です。');
          return;
        }

/*
        let WebhookEventObject = JSON.parse(body).events[0];        
        //メッセージが送られて来た場合
        if(WebhookEventObject.type === 'message'){
            let SendMessageObject;
            if(WebhookEventObject.message.type === 'text'){

                SendMessageObject = [{
                    type: 'text',
                    text: WebhookEventObject.message.text //おうむ返しする場合。
                }];
            }
            client(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                console.log(body);
            },(e)=>{console.log(e)});
        }
*/

        let WebhookEventObject = JSON.parse(body).events[0];  
        let SendMessageObject;
            console.log("受 信 メ ッ セ ー ジ：");
            console.log(WebhookEventObject);
            console.log("受信type: " + WebhookEventObject.message.type);
            console.log("受信text: " + WebhookEventObject.message.text);

        if(WebhookEventObject.message.text != undefined){
            var user_message = WebhookEventObject.message.text;
        }else {
             //スタンプが送られて来た場合
            if(WebhookEventObject.message.type  === 'sticker'){
                SendMessageObject = [{
                        type: 'text',
                        text: "スタンプ買って買って買って買って！！"
                    }];
                console.log("返 信 メ ッ  セ ー ジ");                
                console.log(SendMessageObject);
                console.log("==============================================================================");
                client(WebhookEventObject.replyToken, SendMessageObject)
                .then((body)=>{
                    //console.log(body);
                },(e)=>{console.log(e)});
                return;
            }else if(WebhookEventObject.message.type  === 'audio'){
                SendMessageObject = [{
                        type: 'text',
                        text: "うるさしうるさしうるさしうるさしうるさしうるさしうるさし！"
                    }];
                console.log("返 信 メ ッ  セ ー ジ");                
                console.log(SendMessageObject);
                console.log("==============================================================================");
                client(WebhookEventObject.replyToken, SendMessageObject)
                .then((body)=>{
                    //console.log(body);
                },(e)=>{console.log(e)});
                return;
            }else if(WebhookEventObject.message.type  === 'follow'){
                /*
                SendMessageObject = [{
                        type: 'text',
                        text: "うるさしうるさしうるさしうるさしうるさしうるさしうるさし！"
                    }];
                console.log("返 信 メ ッ  セ ー ジ");                
                console.log(SendMessageObject);
                console.log("==============================================================================");
                */
                client(WebhookEventObject.replyToken, SendMessageObject)
                .then((body)=>{
                    //console.log(body);
                },(e)=>{console.log(e)});
                return;
            }else if(WebhookEventObject.message.type  === 'image'){
            var photo_array = [
                    "わー満開の桜だね〜プラチナきれい〜",
                    "七分咲くらいかも？かもしれるよ！",
                    "五分咲くらいかな？もう決めつけちゃえばいいよ！",
                    "三分咲くらいかな？プラチナむかつく.."
                ];
            SendMessageObject = [{
                    type: 'text',
                    text: photo_array[Math.floor(Math.random() * photo_array.length)]
                }];
            console.log("返 信 メ ッ  セ ー ジ");                
            console.log(SendMessageObject);
            console.log("==============================================================================");
                client(WebhookEventObject.replyToken, SendMessageObject)
                .then((body)=>{
                    //console.log(body);
                },(e)=>{console.log(e)});
                return;
            } 
        }
        /*
        //画像が送られて来た場合
        if(WebhookEventObject.message.type === 'image'){
            var photo_array = [
                    "わー満開の桜だね〜プラチナきれい〜",
                    "七分咲くらいかも？かもしれるよ！",
                    "五分咲くらいかな？もう決めつけちゃえばいいよ！",
                    "三分咲くらいかな？プラチナむかつく.."
                ];
            SendMessageObject = [{
                    type: 'text',
                    text: photo_array[Math.floor(Math.random() * photo_array.length)]
                }];
            console.log("返 信 メ ッ  セ ー ジ");                
            console.log(SendMessageObject);
            console.log("==============================================================================");

            client(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
                //console.log(body);
            },(e)=>{console.log(e)});

        //メッセージが送られて来た場合
        }else
        */
        if(WebhookEventObject.type === 'message'){
            //var user_message = WebhookEventObject.message.text;
            var platinum_array = [
	            "まったくもーまったくもーだよまったくもー",
	            "プラチナむかつく！",
	            "これだからお兄ちゃんは",
	            "このお兄ちゃんやろう！",
                "うるさしうるさしうるさしうるさしうるさしうるさしうるさし！",
                "知らない知らない！　私は何にも知らないもん！　でっかいほうもちっちゃいほうもちゅうくらいなほうも全部知らない！",
                "教えるもんんか！"
            ];
            var platinum_word = platinum_array[Math.floor(Math.random() * platinum_array.length)]

            if(WebhookEventObject.message.text === 'こんにちは'){
                SendMessageObject = [{
                    type: 'text',
                    text: "こんにちわ！"
                }];
            //}else if(['なんじ', '何時', '時刻', 'じこく', '時間', 'じかん', '今何時', 'いまなんじ', '今なんじ', 'いま何時'].includes(user_message)){            //} else if (user_message.indexOf('なんじ') != -1 || user_message.indexOf('何時') != -1 || user_message.indexOf('時刻') != -1 || user_message.indexOf('じこく') != -1){
            }else if(user_message.indexOf('なんじ') != -1 || user_message.indexOf('何時') != -1 || user_message.indexOf('時刻') != -1 || user_message.indexOf('じこく') != -1 || user_message.indexOf('時間') != -1 || user_message.indexOf('じかん') != -1){
                var jikan= new Date();
				var hour = jikan.getHours();
				var minute = jikan.getMinutes();
				var jikan_message = "いまは" + hour + "時" + minute + "分だよ！\n";
				console.log("jikan_message" + jikan_message);

				var jikan_comment;
				if(hour >= 0 && hour <= 3){
					jikan_comment = "深夜の夜桜って不思議な気持ちになりそうだね、おにいちゃん";
				}else if(hour >= 4 && hour <= 12){
					jikan_comment = "朝早くみる桜はきっと気持ちがいいよ、おにいちゃん";
				}else if(hour >= 13 && hour <= 16){
					jikan_comment = "夕日に照らされる桜もきっと素敵だよね、おにいちゃん";
				}else if(hour >= 17 && hour <= 24){
					jikan_comment = "今夜は夜桜が綺麗そうだね、おにいちゃん";
				}
				console.log("jikan_comment" + jikan_comment);
                SendMessageObject = [{
                    type: 'text',
                    text: jikan_message + jikan_comment
                }];

            }else if(user_message.indexOf('天気') != -1 || user_message.indexOf('てんき') != -1 || user_message.indexOf('雨') != -1 || user_message.indexOf('晴') != -1 || user_message.indexOf('曇') != -1){
                var tenki_array = [
                    "天気なんてのはさー自分で調べるべきだって思うんだよね、おにいちゃん\nhttp://www.jma.go.jp/jp/yoho/319.html\n" ,
                    "天気なんか私にわかるわけないじゃん。まったくもーまったくもーだよまったくもー\nhttp://www.jma.go.jp/jp/yoho/319.html\n" ,
                    "私に天気とか聞かないでほしいんだよねープラチナむかつく\nhttp://www.jma.go.jp/jp/yoho/319.html\n"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: tenki_array[Math.floor(Math.random() * tenki_array.length)]
                    }];
            }else if(user_message.indexOf('地図') != -1 || user_message.indexOf('どこ') != -1 || user_message.indexOf('場所') != -1 || user_message.indexOf('車') != -1 || user_message.indexOf('交通') != -1 || user_message.indexOf('おすすめ') != -1 || user_message.indexOf('オススメ') != -1){
                var basho_array = [
                    "花見の場所くらい自分で調べなよ、まったくもーまったくもーだよまったくもー！\n" + "http://maps.google.co.jp/maps?q=お花見",
                    "花見の場所とか私が知るわけないじゃん、プラチナむかつく！\n" + "http://maps.google.co.jp/maps?q=お花見",
                    "知らない知らない！私は何にも知らないもん！知らなでっかいほうもちっちゃいほうもちゅうくらいなほうも全部知らない\n" + "http://maps.google.co.jp/maps?q=お花見",
                    "自分だけ勝手に花見にいくとかさやめてよね、おにいちゃん\n" + "http://maps.google.co.jp/maps?q=お花見"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: basho_array[Math.floor(Math.random() * basho_array.length)]
                    }];

                //SendMessageObject = [{
                //    type: 'text',
                //   text: "花見の場所くらい自分で調べなよ、まったくもーまったくもーだよまったくもー！\n" + "http://maps.google.co.jp/maps?q=お花見"
                //}];
			/*                
            }else if(user_message.indexOf('天気') != -1 || user_message.indexOf('てんき') != -1){

				var mes = 'ちょっとまってね'; //待ってねってメッセージだけ先に処理
    			getNodeVer(event.source.userId); //スクレイピング処理が終わったらプッシュメッセージ
				const getNodeVer = async (userId) => {
				const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=400040');
				const item = res.data;
					await client.pushMessage(userId, {
					    type: 'text',
					    text: item.description.text,
					});
				}
			*/
            }else if(user_message.indexOf('花見') != -1 || user_message.indexOf('はな') != -1 || user_message.indexOf('さくら') != -1 || user_message.indexOf('桜') != -1 || user_message.indexOf('花') != -1 || user_message.indexOf('綺麗') != -1 || user_message.indexOf('きれい') != -1 || user_message.indexOf('キレイ') != -1){
                var hanami_array = [
                    "プラチナきれいだねー",
                    "花見じゃないよ！月火だよ！",
                    "綺麗かもじゃないよ！かもしれるよ！",
                    "お兄ちゃん、お花を見すぎ！",
                    "勝手にひとりで花見しないでよね。つまんないからさ",
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: hanami_array[Math.floor(Math.random() * hanami_array.length)]
                }];
            }else if(user_message.indexOf('かも') != -1 || user_message.indexOf('悩') != -1){
                SendMessageObject = [{
                    type: 'text',
                    text: "もう決めつけちゃえばいいよ！ かもしれるよ！"
                }];
            }else if(user_message.indexOf('怖い') != -1 || user_message.indexOf('こわ') != -1){
                SendMessageObject = [{
                    type: 'text',
                    text: "もう。仕方ないなあ、お兄ちゃんは。よしよし、怖かったんだね"
                }];
            }else if(user_message.indexOf('どっこい') != -1 || user_message.indexOf('よいしょ') != -1 || user_message.indexOf('プラチナ') != -1){
                SendMessageObject = [{
                    type: 'text',
                    text: WebhookEventObject.message.text
                }];

            }else if(user_message.indexOf('愛') != -1 || user_message.indexOf('好') != -1 || user_message.indexOf('すき') != -1 || user_message.indexOf('かわいい') != -1){
                var love_array = [
                    "お兄ちゃん格好いいし。お兄ちゃん優しいし。お兄ちゃん素敵だし。",
                    "お兄ちゃんが優しいのは知ってる 私のほうが知ってる",
                    "わかった、いいよ",
                    "タイトル：都条例",
                    "スカイツリーの方がよかった？",
                    "乙女かお前！正座！",
                    "なんとなくで、なんとなくでなんとなくなんだもん",
                    "好きかなぁと思って、好きだなぁって感じて、好きだってわかる。そんな感じ。"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: love_array[Math.floor(Math.random() * love_array.length)]
                }];
            //}else if(['おっぱい','オッパイ','胸', 'エッチ', 'えっち', 'すけべ', 'スケベ', 'パンツ', 'ぱんつ', '裸', '幼女', 'タッチ', '触', 'かわいい', '可愛い', '月火', 'つきひ', 'キス','LOVE', 'まん','えろ', 'エロ'].includes(user_message)){
            }else if(user_message.indexOf('おっぱい') != -1 || user_message.indexOf('胸') != -1 || user_message.indexOf('タッチ') != -1 || user_message.indexOf('可愛い') != -1|| user_message.indexOf('エッチ') != -1|| user_message.indexOf('えっち') != -1|| user_message.indexOf('エロ') != -1|| user_message.indexOf('えろ') != -1|| user_message.indexOf('パンツ') != -1|| user_message.indexOf('ぱんつ') != -1|| user_message.indexOf('すけべ') != -1){
                var oppai_array = [
                    "もうお兄ちゃん、妹のおっぱい触り過ぎ",
                    "タイトル：都条例",
                    "悪いけどラブラブっすよ。ラブラブボンバー",
                    "妹の胸を揉め",
                    "え？ 何？ やめて、お兄ちゃん！ 何すんの、いやああああ！",
                    "キスしてきやがったら、舌で搦め捕ってやろうと思ってたのに",
                    "お兄ちゃん、欲求不満なんじゃない？",
                    "何言ってんだこの兄は。死なないかな",
                    "タッチパネルって平面じゃねーか！",
                    "それは恋じゃなくて性欲だよ",
                    "私今、なんでお兄ちゃんに脱がされて、拘束されて、挙句に押し倒されてるのかな？",
                    "何すんじゃあ！",
                    "死ねばいいんだ死ねばいいんだ死ねばいいんだ。",
                    "もう。仕方ないなあ、お兄ちゃんは。よしよし、怖かったんだね"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: oppai_array[Math.floor(Math.random() * oppai_array.length)]
                }];
            }else if(user_message.indexOf('ごめん') != -1){
                var oppai_array = [
                    "死ねばいいんだ死ねばいいんだ死ねばいいんだ。",
                    "乙女かお前！正座！",
                    "まったくもーまったくもーだよまったくもー",
                    "プラチナむかつく！"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: oppai_array[Math.floor(Math.random() * oppai_array.length)]
                }];
            }else if(user_message.indexOf('知ってる') != -1 || user_message.indexOf('教えて') != -1|| user_message.indexOf('おしえて') != -1){
                SendMessageObject = [{
                    type: 'text',
                    text: "知らない知らない！　私は何にも知らないもん！　でっかいほうもちっちゃいほうもちゅうくらいなほうも全部知らない！"
                }];
            /*
            }else if(user_message.indexOf('ひま') != -1 || user_message.indexOf('暇') != -1 || user_message.indexOf('ネタ') != -1 || user_message.indexOf('トーク') != -1){
                var neta_array = [
                    "おしえな〜い",
                    "みんな、中学の時の部活なにしてた？",
                    "Gateboxに誰でも召喚するとしたら誰を召喚する？そしてどんあ暮らしをしたい？",
                    "自己PRと志望動機を聞かせてください。",
                    "おしえな〜い",
                    "おしえな〜い",
                    "私が暇だわ",
                    "おしえるもんか",
                    "おしえな〜い",
                    "まだ帰ってこないの？",
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: neta_array[Math.floor(Math.random() * neta_array.length)]
                }];
            */
            }else if(user_message.indexOf('音') != -1 || user_message.indexOf('おんがく') != -1 || user_message.indexOf('おと') != -1 || user_message.indexOf('MUSIC') != -1 || user_message.indexOf('music') != -1 || user_message.indexOf('カラオケ') != -1 || user_message.indexOf('静か') != -1 || user_message.indexOf('しずか') != -1){
                var music_array = [
                    "あーーどっこい！\nhttps://www.youtube.com/watch?v=YKg3K4Lr080",
                    "おにににいいちゃん？失礼かみまみた！\nhttps://www.youtube.com/watch?v=QFExXjaobjg",
                    "正義の味方たじゃなくて正義そのものだよ！\nhttps://www.youtube.com/watch?v=t92m_-YzbyQ",
                    "そーしましょったらそーしましょ！\nhttps://www.youtube.com/watch?v=KoC2mncDecA",
                    "あーよいしょー。\nhttps://www.youtube.com/watch?v=hRwiHjf1N50",
                    "わかった、いいよ。（OP&EDのメドレーだよ）\nhttps://www.youtube.com/watch?v=CiftbJCLh90",
                    "タイトル「都条例」。私はキメ顔でそういった。\nhttps://www.youtube.com/watch?v=pv839bb1HW0",
                    "勝手にひとりで大人になんないでよね。つまんないからさ。\nhttps://www.youtube.com/watch?v=caF6nJxTejc",
                    "せんちゃんを泣かしちゃダメだよ\nhttps://www.youtube.com/watch?v=CWz_SjJSK9s",
                    "おにいちゃんやろうに教える音楽なんかあるかー！正座！"
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: music_array[Math.floor(Math.random() * music_array.length)]
                }];
            } else {
                var other_array = [
                    "かもしれるよ！",
                    "まったくもーまったくもーだよまったくもー",
                    "プラチナむかつく！",
                    "ほふにゃーん！",
                    "このお兄ちゃんやろう！",
                    "お兄ちゃんの趣味は、正直言って、やばい",
                    //"いい加減に起きないと駄目だよ！？",
                    //"着物を馬鹿にしちゃだめだよ",
                    "そりゃ驚くよ…驚くっていうか、轟くよ！『友達を作ると人間強度が下がるから』と痛いことを公言してたお兄ちゃんに、好きな相手ができただなんて",
                    "私達と、それにお兄ちゃんのパパとママなんだから、性格もそれなりだよ",
                    "乙女かお前！正座！",
                    "なんとなくで、なんとなくでなんとなくなんだもん",
                    "好きかなぁと思って、好きだなぁって感じて、好きだってわかる。そんな感じ。",
                    "背負いこむんじゃなくて、追い込むべきなんだよ",
                    "勝手にひとりで大人になんないでよね。つまんないからさ",                    
                    "私は後悔って、あんまりしないほうなんだけど　だけど、だからこそなんであのときに後悔しておかなかったのかなあ――って、後悔することはあるんだよね"                   
                    ];
                SendMessageObject = [{
                    type: 'text',
                    text: other_array[Math.floor(Math.random() * other_array.length)]
                }];
            }

            client(WebhookEventObject.replyToken, SendMessageObject)
            .then((body)=>{
            console.log("返 信 メ ッ セ ー ジ：");
            console.log(SendMessageObject);
            console.log("==============================================================================");
            },(e)=>{console.log(e)});
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('success');
    });

}).listen(PORT);

console.log(`Server running at ${PORT}`);