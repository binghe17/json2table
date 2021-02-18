
if(typeof HisArr != 'undefined'){
    console.log('기존변수 HisArr가 클래스로 수정되었습니다.')
    HisArr = undefined;
} 
HisArr = class {
    dom = $('body')
    max = 20;
    datas = [];
    index = 0;//현재 인덱스
    isEnd = true;

    constructor(callback, max=20){
        let self = this;
        this.max = max;
        this.dom.off('keyup')
        this.dom.on('keyup', function(){
            if(event.ctrlKey){
                if(event.key == 'z'){
                    if(typeof callback == 'function') self.prev(callback)
                    else self.prev();
                }else if(event.key == 'y'){
                    if(typeof callback == 'function') self.next(callback)
                    else self.next();
                }
            }
            //console.log(event)
        })
    }

    addData(data){
        if(typeof data == 'undefined'){ console.log('is not addData!!', data);return;}
        if(this.datas.length > this.max) this.datas.shift();
        if(this.index != this.datas.length-1){ this.datas = this.datas.splice(0,this.index+1); }
        this.datas.push(data);
        this.index = this.datas.length -1;
    }

    prev(callback){
        --this.index;
        if(this.index >= this.max){ this.index = this.max-1;}
        if(this.index < 0){
            this.index = 0;
            return;
        } 
        this.isEnd = (this.index == this.max -1 ) ? true : false;
        if(typeof callback == 'function') callback(this);
        // console.log('----- prev [ctrl+z] -----', this.index, this.datas[this.index])
    }

    next(callback){
        ++this.index;
        if(this.index < 0) this.index = 0;
        if(this.index >= this.datas.length){ this.index = this.datas.length - 1; return;}
        if(this.index >= this.max){
            this.index = this.max-1
            return;
        } 
        this.isEnd = (this.index == this.max -1 ) ? true : false;
        if(typeof callback == 'function') callback(this);
        // console.log('----- next [ctrl+y] -----',  this.index, this.datas[this.index])
    }

    removeData(index){
        if(this.datas.length > 0 && typeof this.datas[index] != 'undefined'){
            this.datas.splice(index, 1);;
            this.index = this.datas.length - 1;
        }
    }

}



if(typeof hisArr == 'undefined') hisArr = new HisArr()
// hisArr.addData('111111')
// hisArr.addData('22222')
// hisArr.addData([[3333,2,3,4]])
// console.log(hisArr.datas)
// console.log(hisArr.index)
// //please keydown  ctrl + z , ctrl + y
