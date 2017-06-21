var express = require('express');
var app = express();
var fs = require('fs');
var ca = fs.readFileSync('./cert/srca.cer.pem');
var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";
var request = require('request');
app.use(express.static(__dirname + '/public'));

app.get('/v1/getTickets', function (req, res) {
    // console.log(req.headers);
    var params = req.url.split('?')[1];
    request({
        // will be ignored
        method: 'GET',
        url: 'https://kyfw.12306.cn/otn/leftTicket/query?' + params,
        ca: [ca],
        headers: {
            'Connection': 'keep-alive',
            'Host': 'kyfw.12306.cn',
            'User-Agent': UA,
            "Connection": "keep-alive",
            "Referer": "https://kyfw.12306.cn/otn/leftTicket/init",
            "Cookie": "__NRF=D2A7CA0EBB8DD82350AAB934FA35745B; JSESSIONID=0A02F03F9852081DDBFEA4AA03EF4252C569EB7AB1; _jc_save_detail=true; _jc_save_showIns=true; BIGipServerotn=1072693770.38945.0000; _jc_save_fromStation=%u77F3%u5BB6%u5E84%2CSJP; _jc_save_toStation=%u5408%u80A5%2CHFH; _jc_save_fromDate=2017-02-17; _jc_save_toDate=2017-05-20; _jc_save_wfdc_flag=dc",
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200 ) {
            if(!JSON.parse(body) || !JSON.parse(body).data){
                res.send([])
                return;
            }
            body = JSON.parse(body)
            res.send(ticketsFn(body.data.result, body.data.map));
        }
    })
    // res.send('Hello World!');
});

app.get('/v1/getTicketPrice', function (req, res) {
    var formData = {
        'leftTicketDTO.train_date': '2017-05-20',
        'leftTicketDTO.from_station': 'GZQ',
        'leftTicketDTO.to_station': 'NNZ',
        'purpose_codes': 'ADULT'
    }
    request({
        // will be ignored
        method: 'GET',
        url: 'https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=580000K2300M&from_station_no=10&to_station_no=17&seat_types=1413&train_date=2017-05-20',
        ca: [ca],
        headers: {
            'Connection': 'keep-alive',
            'Host': 'kyfw.12306.cn',
            'User-Agent': UA,
            "Connection": "keep-alive",
            "Referer": "https://kyfw.12306.cn/otn/leftTicket/init",
            "Cookie": "__NRF=D2A7CA0EBB8DD82350AAB934FA35745B; JSESSIONID=0A02F03F9852081DDBFEA4AA03EF4252C569EB7AB1; _jc_save_detail=true; _jc_save_showIns=true; BIGipServerotn=1072693770.38945.0000; _jc_save_fromStation=%u77F3%u5BB6%u5E84%2CSJP; _jc_save_toStation=%u5408%u80A5%2CHFH; _jc_save_fromDate=2017-02-17; _jc_save_toDate=2017-05-20; _jc_save_wfdc_flag=dc",
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body)
            res.send(body);
        }
    })
    // res.send('Hello World!');
});

app.get('/v1/station', function (req, res) {
    var formData = {
        'leftTicketDTO.train_date': '2017-05-20',
        'leftTicketDTO.from_station': 'GZQ',
        'leftTicketDTO.to_station': 'NNZ',
        'purpose_codes': 'ADULT'
    }
    request({
        // will be ignored
        method: 'GET',
        url: 'https://kyfw.12306.cn/otn/resources/js/framework/station_name.js?station_version=1.9009',
        ca: [ca],
        headers: {
            'Connection': 'keep-alive',
            'Host': 'kyfw.12306.cn',
            'User-Agent': UA,
            "Connection": "keep-alive",
            // "Referer": "https://kyfw.12306.cn/otn/leftTicket/init",
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            eval(body)
            var stations = '';
            if(station_names){
                stations = station_names
            }
            // var body = JSON.parse(body)
            res.send(stations);
        }
    })
});

app.get('/index', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


function ticketsFn(cp, cr) {
    var co = [];
    for (var cn = 0; cn < cp.length; cn++) {
        var cs = {};
        var cm = cp[cn].split("|");
        cs.secretStr = cm[0];
        cs.buttonTextInfo = cm[1];
        var cq = {};
        cq.train_no = cm[2];
        cq.station_train_code = cm[3];
        cq.start_station_telecode = cm[4];
        cq.end_station_telecode = cm[5];
        cq.from_station_telecode = cm[6];
        cq.to_station_telecode = cm[7];
        cq.start_time = cm[8];
        cq.arrive_time = cm[9];
        cq.lishi = cm[10];
        cq.canWebBuy = cm[11];
        cq.yp_info = cm[12];
        cq.start_train_date = cm[13];
        cq.train_seat_feature = cm[14];
        cq.location_code = cm[15];
        cq.from_station_no = cm[16];
        cq.to_station_no = cm[17];
        cq.is_support_card = cm[18];
        cq.controlled_train_flag = cm[19];
        cq.gg_num = cm[20] ? cm[20] : "--";
        cq.gr_num = cm[21] ? cm[21] : "--";
        cq.qt_num = cm[22] ? cm[22] : "--";
        cq.rw_num = cm[23] ? cm[23] : "--";
        cq.rz_num = cm[24] ? cm[24] : "--";
        cq.tz_num = cm[25] ? cm[25] : "--";
        cq.wz_num = cm[26] ? cm[26] : "--";
        cq.yb_num = cm[27] ? cm[27] : "--";
        cq.yw_num = cm[28] ? cm[28] : "--";
        cq.yz_num = cm[29] ? cm[29] : "--";
        cq.ze_num = cm[30] ? cm[30] : "--";
        cq.zy_num = cm[31] ? cm[31] : "--";
        cq.swz_num = cm[32] ? cm[32] : "--";
        cq.yp_ex = cm[33];
        cq.seat_types = cm[34];
        cq.from_station_name = cr[cm[6]];
        cq.to_station_name = cr[cm[7]];
        cs.queryLeftNewDTO = cq;
        co.push(cs)
    }
    return co
}
// var express = require('express');
// var app = express();
// var request = require('request');

// app.get('/', function(req, res){
//   request('http://www.cnblogs.com', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//        res.send('hello world');
//     }
//   })
// });
// app.listen(3000);