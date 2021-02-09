

        //날짜 함수
        Date.prototype.format = function(f) {
                if (!this.valueOf()) return " ";
                var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
                var d = this;
                 
                return f.replace(/(Y|y|m|d|H|h|i|s|W|p)/gi, function($1) {
                    switch ($1) {
                        case "Y": return d.getFullYear();
                        case "y": return (d.getFullYear() % 1000).zf(2);
                        case "m": return (d.getMonth() + 1).zf(2);
                        case "d": return d.getDate().zf(2);
                        case "H": return d.getHours().zf(2);
                        case "i": return d.getMinutes().zf(2);
                        case "s": return d.getSeconds().zf(2);
                        case "W": return weekName[d.getDay()];
                        case "p": return d.getHours() < 12 ? "오전" : "오후";
                        case "h": return ((h = d.getHours() % 12) ? h : 12).zf(2);
                        default: return $1;
                    }
                });
            };
            String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
            String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
            Number.prototype.zf = function(len){return this.toString().zf(len);};
            // console.log(new Date().format("Y-m-d H:i:s W p h시")); //2019-12-11 17:47:18 수요일 오후 05시
    
    
    
    
    //날짜 계산 (앞으로/뒤로 몇 년/월/일/시/분/초)
    function nextDate(conf=null, date=null, format='Y-m-d') {
        if(typeof conf == 'object'){
            if(date !== null && (date instanceof Date) == false) date = new Date(date); 
            let d = (date == null) ? new Date() : date;
            let seconds=0, minutes=0, hours=0, day=0, month=0, year=0;
            if(conf instanceof Array){
                year = (typeof conf[0] !== 'undefined') ? conf[0] : 0;
                month = (typeof conf[1] !== 'undefined') ? conf[1] : 0;
                day = (typeof conf[2] !== 'undefined') ? conf[2] : 0;
                hours = (typeof conf[3] !== 'undefined') ? conf[3] : 0;
                minutes = (typeof conf[4] !== 'undefined') ? conf[4] : 0;
                seconds = (typeof conf[5] !== 'undefined') ? conf[5] : 0;
            }
            else if(conf instanceof Object){
                year = (typeof conf['Y'] !== 'undefined') ? conf['Y'] : 0;
                month = (typeof conf['m'] !== 'undefined') ? conf['m'] : 0;
                day = (typeof conf['d'] !== 'undefined') ? conf['d'] : 0;
                hours = (typeof conf['H'] !== 'undefined') ? conf['H'] : 0;
                minutes = (typeof conf['i'] !== 'undefined') ? conf['i'] : 0;
                seconds = (typeof conf['s'] !== 'undefined') ? conf['s'] : 0;
            }
            if(seconds !== 0) d.setSeconds( d.getSeconds() + seconds);
            if(minutes !== 0) d.setMinutes(d.getMinutes() + minutes);
            if(hours !== 0) d.setHours(d.getHours() + hours);
            if(day !== 0) d.setDate( d.getDate() + day);
            if(month !== 0) d.setMonth(d.getMonth() + month);
            if(year !== 0) d.setFullYear(d.getFullYear() + year);
            return today(format,d);
        }
    }
    // nextDate([1,1,1,1,1,1],'2020-10-10 10:10:10','Y-m-d H:i:s:x')//"2021-11-11 11:11:11:000"
    // nextDate([0,0,0,0,0,0],'2020-10-10 10:10:10','Y-m-d H:i:s:x')//"2020-10-10 10:10:10:000"
    // nextDate([0,0,0,0,0,0],today(),'Y-m-d H:i:s:x')//"2021-01-05 18:43:35:167"
    
    
    
    //날짜 ('Y-m-d H:i:s:x w t')
    function today(format='Y-m-d H:i:s:x', date=null){
        function pad(n, width=2) {
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        }
        let today = (date == null) ? new Date() : date; 
    
        if(format.indexOf('Y') > - 1){
            let year = today.getFullYear(); // 년도
            format = format.replace(/Y/g, year)
        } 
        if(format.indexOf('m') > - 1){
            let month = pad(today.getMonth() + 1);  // 월
            format = format.replace(/m/g, month)
        } 
        if(format.indexOf('d') > - 1){
            let day = pad(today.getDate());  // 날짜
            format = format.replace(/d/g, day)
        } 
        if(format.indexOf('H') > - 1){
            let hours = pad(today.getHours()); // 시
            format = format.replace(/H/g, hours)
        }
        if(format.indexOf('i') > - 1){
            let minutes = pad(today.getMinutes());  // 분
            format = format.replace(/i/g, minutes)
        }
        if(format.indexOf('x') > - 1){
            let milliseconds = pad(today.getMilliseconds(), 3); // 밀리초
            format = format.replace(/x/g, milliseconds)
        }
        if(format.indexOf('s') > - 1){
            let seconds = pad(today.getSeconds());  // 초
            format = format.replace(/s/g, seconds)
        }
        if(format.indexOf('w') > - 1){
            let week = today.getDay();  // 요일
            format = format.replace(/w/g, week)
        }
        if(format.indexOf('n') > - 1){ //timestamp is number
            let timestamp = Date.parse(today);
            format = format.replace(/t/g, timestamp)
        }
        return format;
    }
    
    
    
    //timestamp to date
    function timestamp2date(timestamp){
        function pad(n, leng=2){
            return ('0'.repeat(leng) + n).slice(-leng);
        }
        if(typeof timestamp !== 'number') timestamp = Number(timestamp);
        if(typeof timestamp == 'number'){
            let d = new Date(timestamp);
            let year = d.getFullYear();
            let month = pad(d.getMonth() + 1);
            let day = pad(d.getDate());
            let hour = pad(d.getHours());
            let min = pad(d.getMinutes());
            let sec = pad(d.getSeconds());
            let ms = pad(d.getSeconds(),3);
            return year +'-'+ month +'-'+ day +' '+ hour +':'+ min +':'+ sec +':'+ ms;
        }
    }
    // timestamp2date(1566367953447)
    // today('n') //"1609840547000"
    // today('n').slice(0,-3)//"1609840547"
    
    
    
    
    //-----------------
    
    
            // function nextDate(day=0, month=0, year=0, date=null, format='Y-m-d') {
            //     if(date !== null){
            //         if((date instanceof Date) == false) date = new Date(date);  
            //     }
            //     let d = (date == null) ? new Date() : date;
            //     if(day !== 0) d.setDate( d.getDate() + day);
            //     if(month !== 0) d.setMonth(d.getMonth() + month);
            //     if(year !== 0) d.setFullYear(d.getFullYear() + year);
            // 	return today(format,d);
            // }
    
            // function nextTime(seconds=0, minutes=0, hours=0, date=null, format='H:i:s') {
            //     if(date !== null){
            //         if((date instanceof Date) == false) date = new Date(date);  
            //     }
            //     let d = (date == null) ? new Date() : date;
            //     if(seconds !== 0) d.setSeconds( d.getSeconds() + seconds);
            //     if(minutes !== 0) d.setMinutes(d.getMinutes() + minutes);
            //     if(hours !== 0) d.setHours(d.getHours() + hours);        
            // 	return today(format,d);
            // }
    
    
    
        // //날짜
        // function today(type='-'){
        //     function pad(n, width=2) {
        //         n = n + '';
        //         return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        //     }
        //     let today = new Date(); 
        //     let year = today.getFullYear(); // 년도
        //     let month = pad(today.getMonth() + 1);  // 월
        //     let date = pad(today.getDate());  // 날짜
        //     // let day = today.getDay();  // 요일
        //     return year + type + month + type + date;
        // }
    
    
        // //시간 
        // function time(type=':'){
        //     function pad(n, width=2) {
        //         n = n + '';
        //         return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
        //     }
        //     let today = new Date(); 
        //     let hours = pad(today.getHours()); // 시
        //     let minutes = pad(today.getMinutes());  // 분
        //     let seconds = pad(today.getSeconds());  // 초
        //     // let milliseconds = today.getMilliseconds(); // 밀리초
        //     return hours + type + minutes + type + seconds;
        // }
    
    
        // function nextDate(day=0, month=0, year=0, date=null) {
        //     let d = (date == null) ? new Date() : date;
        //     if(day !== 0) d.setDate( d.getDate() + day);
        //     if(month !== 0) d.setMonth(d.getMonth() + month);
        //     if(year !== 0) d.setFullYear(d.getFullYear() + year);
        //     return getDateStr(d);
        // }
    
        // function nextTime(seconds=0, minutes=0, hours=0, date=null) {
        //     let d = (date == null) ? new Date() : date;
        //     if(seconds !== 0) d.setSeconds( d.getSeconds() + seconds);
        //     if(minutes !== 0) d.setMinutes(d.getMinutes() + minutes);
        //     if(hours !== 0) d.setHours(d.getHours() + hours);
        //     return getDateStr(d);
        // }
    
    
    
        // Date.parse('2020-01-01 03:33:33:111');//1577817213111
        // Date.now() //1609832827210
    
    
    
    
        // yyyymmdd 형태로 포멧팅하여 날짜 반환
        // Date.prototype.yyyymmdd = function(t=''){
        //     var yyyy = this.getFullYear().toString();
        //     var mm = (this.getMonth() + 1).toString();
        //     var dd = this.getDate().toString();
        //     return yyyy +t+ (mm[1] ? mm : '0'+mm[0]) +t+ (dd[1] ? dd : '0'+dd[0]);
        // }
        // console.log((new Date()).yyyymmdd());
    
    
    
    
        // <script src="https://cdn.jsdelivr.net/npm/datejs@1.0.0-rc3/index.js"></script>
        // if(typeof inJS == 'undefined'){
        //     function inJS(url,callback){
        //         var s = window.document.createElement("script");
        //         s.src = url;
        //         window.document.head.appendChild(s);
        //         if(typeof callback != 'undefined'){
        //             s.onload = function() {
        //                 callback();
        //             } 
        //         }
        //     }
        //     inJS('https://cdn.jsdelivr.net/npm/datejs@1.0.0-rc3/index.js', ()=>{
        //         console.log('include datejs')
        //     })
        // }
    
            
    //--------------------
    